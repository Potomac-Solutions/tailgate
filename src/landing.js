// The market's page (`/`): a full-screen photograph and one line, one button (shop the market),
// how it works, the farms' stalls, everything for sale with a photograph of each, and a word
// for farmers and drivers. A shopper who is already here to buy gets a short hero and goes
// straight to the food.
//
// The photographs are files in public/photos/; `photo(name)` is one's address, or ''.
import { escape } from './layout.js';

const picture = (src, alt, { eager = false, cls = '' } = {}) => (src ? `<img${cls ? ` class="${cls}"` : ''} src="${src}" alt="${escape(alt)}"${eager ? ' fetchpriority="high"' : ' loading="lazy"'} decoding="async">` : '');

/** `stalls` and `grid` are already rendered; `shopper` can order; `signedIn` is anyone at all; `fee` is a delivery's price in words. */
export function landing({ photo, shopper, signedIn, farms, fee, stalls, grid }) {
  const shop = `<a class="go" href="#fresh">Shop this week’s market</a>`;
  const pitch = !shopper;
  return `<section class="hero${pitch ? '' : ' short'}">${picture(photo('hero'), '', { eager: true, cls: 'bg' })}
  <div class="wrap">
    <p class="kicker">Farm to door · Western Maryland &amp; West Virginia</p>
    <h1>Picked this morning. <em>At your door tonight.</em></h1>
    <p class="lede">${farms} farms, one cart, one payment. Order by noon and a neighbour brings it the same day.</p>
    <div class="actions">${shop}${pitch ? '<a class="go ghost" href="#how">How it works</a>' : ''}</div>
    ${pitch ? '<p class="also">Farmer or driver? <a href="#join">Sell</a> or <a href="#join">Drive</a> with us.</p>' : ''}
  </div>
  <div class="hero-strip"><div class="wrap"><p>Order by noon, delivered today</p><p>${fee} delivery from each farm</p><p>Paid once, at checkout</p></div></div>
</section>
${pitch ? `<section id="how" aria-labelledby="how-h"><p class="kicker">How it works</p><h2 class="big" id="how-h">From the field to your porch</h2>
  <ol class="steps">
    <li><h3>Fill one cart</h3><p>Tomatoes from one farm, honey from another, cider from a third. It’s all one order to you.</p></li>
    <li><h3>Pay once</h3><p>One payment for the whole cart. Each farm gets its share.</p></li>
    <li><h3>Watch it come</h3><p>A neighbour picks up at each farm. You see every step as it happens.</p></li>
  </ol>
</section>
<section class="split">
  <div class="pic">${picture(photo('porch'), 'A crate of vegetables, eggs, honey and cider left on a front porch')}</div>
  <div><p class="kicker">Left at your door</p><h2>Skip the drive to three farms.</h2><p>The farms are twenty miles apart. Your driver is already headed your way.</p><p>${shop}</p></div>
</section>` : ''}
<section aria-labelledby="stalls"><div class="section-head"><h2 class="big" id="stalls">The farms</h2><p>Each farm runs its own stall.</p></div><div class="stalls">${stalls}</div></section>
<section aria-labelledby="fresh" id="fresh-section"><div class="section-head"><h2 class="big" id="fresh">For sale today</h2>${shopper ? '<p>Add what you like; check out once.</p>' : signedIn ? '<p class="order-cta"><a class="go pine" href="/start">Switch to a shopper to order</a></p>' : '<p class="order-cta"><a class="go pine" href="/account/sign-up">Make an account to order</a> <a href="/start">or try it as someone else</a></p>'}</div>${grid}</section>
${pitch ? `<section class="band" id="join">${picture(photo('road'), '', { cls: 'bg' })}<div class="wrap"><p class="kicker">Not just for shoppers</p><h2>Got a field, or a truck?</h2>
  <div class="join">
    <div><h3>Sell with us</h3><p>List what you have, set your prices, and dress your stall in your own colours.</p><a class="go" href="/start">See a farmer’s side</a></div>
    <div><h3>Drive with us</h3><p>Claim deliveries on your way and earn ${fee} for each one.</p><a class="go" href="/start">See a driver’s side</a></div>
  </div></div></section>` : ''}`;
}
