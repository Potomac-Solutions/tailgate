// Paying on the platform's page: the test page until PayPal is set up, then PayPal's own, by one
// setting. PayPal is faked here (its calls are the kit's, tested there); the trip is real.
import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createApp } from '../server.js';
import { served } from './http-client.js';

const dir = mkdtempSync(join(tmpdir(), 'tailgate-pay-'));
after(() => rmSync(dir, { recursive: true, force: true }));
const COST = { N: 2 ** 10, r: 8, p: 1 };
const SECRET = 'test-secret-of-at-least-thirty-two-characters';

function fakePayPal() {
  const seen = [];
  const state = { status: 'CREATED', captures: 0, amount: '0.00' };
  const fetcher = async (url, init = {}) => {
    const path = new URL(url).pathname;
    const body = init.body && String(init.headers?.['content-type'] ?? init.headers?.['Content-Type'] ?? '').includes('json') ? JSON.parse(init.body) : init.body ? String(init.body) : null;
    seen.push({ path, host: new URL(url).host, body });
    if (path === '/v1/oauth2/token') return Response.json({ access_token: 'A', expires_in: 3600 });
    if (path === '/v2/checkout/orders') {
      state.amount = body.purchase_units[0].amount.value;
      return Response.json({ id: 'ORDER7', status: 'CREATED', links: [{ rel: 'payer-action', href: 'https://www.sandbox.paypal.com/checkoutnow?token=ORDER7' }] }, { status: 201 });
    }
    if (path === '/v2/checkout/orders/ORDER7') return Response.json({ id: 'ORDER7', status: state.status, ...(state.status === 'COMPLETED' ? { purchase_units: [{ payments: { captures: [{ id: 'CAP7', status: 'COMPLETED', amount: { value: state.amount, currency_code: 'USD' } }] } }] } : {}) });
    if (path === '/v2/checkout/orders/ORDER7/capture') {
      state.captures++;
      state.status = 'COMPLETED';
      return Response.json({ id: 'ORDER7', status: 'COMPLETED', purchase_units: [{ payments: { captures: [{ id: 'CAP7', status: 'COMPLETED', amount: { value: state.amount, currency_code: 'USD' } }] } }] }, { status: 201 });
    }
    return new Response('{}', { status: 404 });
  };
  return { fetcher, seen, state };
}

async function market(name, paypal) {
  const s = await served(await createApp({ staffCost: COST, db: join(dir, `${name}.db`), cache: false, secret: SECRET, payEnv: { PAY_PAYPAL_CLIENT: 'client', PAY_PAYPAL_SECRET: 'secret', PAY_PAYPAL_SANDBOX: '1' }, payFetch: paypal.fetcher }));
  await s.post('/who', { who: 'rosa' });
  const add = await s.call('/_zb/action/produce-card/add', { method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded', accept: 'application/json', 'sec-fetch-site': 'same-origin' }, body: new URLSearchParams({ farm: 'bearrun', item: 'cider', qty: '2' }) });
  assert.equal(add.status, 204);
  const page = (await s.call('/checkout')).text;
  return { s, page, key: /name="checkout" value="([a-z0-9]+)"/.exec(page)[1] };
}

test('the same cart on PayPal once its settings are there: approved there, taken once on the way back', async () => {
  const paypal = fakePayPal();
  const { s, page, key } = await market('paypal', paypal);
  try {
    assert.equal(s.server.payments.name, 'paypal');
    assert.match(page, /You’ll pay on PayPal’s secure page next, in its test mode: no money moves\. We never see your card number\./);
    const sent = await s.post('/checkout', { checkout: key, name: 'Rosa', email: 'rosa@example.com', address: '1 Test Rd' });
    assert.equal(sent.location, 'https://www.sandbox.paypal.com/checkoutnow?token=ORDER7');
    const made = paypal.seen.find((one) => one.path === '/v2/checkout/orders');
    assert.equal(made.host, 'api-m.sandbox.paypal.com');
    assert.equal(made.body.payment_source.paypal.experience_context.return_url, `${s.base}/pay/back?checkout=${key}`);

    paypal.state.status = 'APPROVED';
    assert.equal((await s.call(`/pay/back?checkout=${key}`)).location, '/orders?done=placed');
    assert.equal(paypal.state.captures, 1, 'taken when they came back');
    assert.equal((await s.call(`/pay/back?checkout=${key}`)).location, '/orders?done=placed', 'back twice: still once');
    const webhook = await s.call('/pay/webhook', { method: 'POST', body: JSON.stringify({ event_type: 'CHECKOUT.ORDER.APPROVED', resource: { id: 'ORDER7' } }) });
    assert.equal(webhook.status, 200);
    assert.equal(paypal.state.captures, 1, 'the webhook finds it done');
  } finally {
    await s.close();
  }
});

test('backed out of PayPal: the cider goes back, and PayPal is never told to take it afterwards', async () => {
  const paypal = fakePayPal();
  const { s, key } = await market('paypal-cancel', paypal);
  try {
    await s.post('/checkout', { checkout: key, name: 'Rosa', email: 'rosa@example.com', address: '1 Test Rd' });
    assert.equal((await s.call(`/pay/cancel?checkout=${key}`)).location, '/checkout?problem=Nothing was charged. Your cart is still here.');
    paypal.state.status = 'APPROVED';
    const late = await s.call(`/pay/back?checkout=${key}`);
    assert.match(late.location, /^\/checkout\?problem=/);
    assert.equal(paypal.state.captures, 0, 'let go: only asked, never taken');
  } finally {
    await s.close();
  }
});
