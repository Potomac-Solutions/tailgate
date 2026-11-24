import { CHART_CSS } from '@potomac-solutions/kit/charts';
// The page around the components: Tailgate's own look, the header, toasts, and the connection to
// the Sync log. Tailgate's frame stays cool and quiet so each farm's own colours carry the market.
export const escape = (value) =>
  String(value ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

/** What a finished action says, as a toast (or, without JavaScript, a banner). */
export const DONE = {
  added: 'Added to your cart.',
  placed: 'Order placed. A driver will pick it up soon.',
  claimed: 'Delivery claimed. Pick it up at the farm.',
  picked: 'Marked as picked up. The customer can see you’re on the way.',
  delivered: 'Marked as delivered. Nice work.',
};

const ROLE = { farmer: 'Farmer', customer: 'Shopper', driver: 'Driver' };

const fonts = [
  ['Barlow Condensed', 600, '/fonts/barlow-condensed-latin-600-normal.woff2'],
  ['Barlow Condensed', 700, '/fonts/barlow-condensed-latin-700-normal.woff2'],
  ['Source Sans 3', 400, '/fonts/source-sans-3-latin-400-normal.woff2'],
  ['Source Sans 3', 600, '/fonts/source-sans-3-latin-600-normal.woff2'],
  ['Source Sans 3', 700, '/fonts/source-sans-3-latin-700-normal.woff2'],
];

const STYLE = `
  .two { display: grid; grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr)); gap: 1rem; }
  .stack { display: grid; gap: 0.75rem; }
  .admin { display: grid; grid-template-columns: 13rem 1fr; gap: 1.5rem; align-items: start; }
  .admin-nav { position: sticky; top: 1rem; display: grid; gap: 0.15rem; padding: 0.75rem; border-radius: var(--radius); background: var(--card); box-shadow: 0 0 0 1px var(--border); }
  .admin-nav a { padding: 0.45rem 0.6rem; border-radius: 0.4rem; text-decoration: none; font-weight: 600; }
  .admin-nav a[aria-current] { background: var(--muted); color: var(--primary); }
  .admin-nav small { padding: 0.6rem 0.6rem 0.2rem; color: var(--muted-foreground); text-transform: uppercase; letter-spacing: 0.06em; font-size: 0.72rem; }
  .admin-body { display: grid; gap: 1.25rem; min-width: 0; }
  @media (max-width: 52rem) { .admin { grid-template-columns: 1fr; } .admin-nav { position: static; grid-auto-flow: column; overflow-x: auto; } .admin-nav small { display: none; } }
  .tiles { display: grid; grid-template-columns: repeat(auto-fit, minmax(11rem, 1fr)); gap: 0.75rem; }
  .tile { padding: 0.9rem 1rem; border-radius: var(--radius); background: var(--card); box-shadow: 0 0 0 1px var(--border); }
  .tile span { display: block; color: var(--muted-foreground); font-size: 0.85rem; font-weight: 600; }
  .tile strong { display: block; font-size: 1.7rem; line-height: 1.2; }
  .tile small { color: var(--muted-foreground); }
  .filters { display: flex; flex-wrap: wrap; gap: 0.6rem; align-items: end; }
  .filters label { font-size: 0.9rem; }
  .table-wrap { overflow-x: auto; }
  .badge { display: inline-block; padding: 0.1rem 0.5rem; border-radius: 999px; background: var(--muted); font-size: 0.8rem; font-weight: 700; }
  .badge.booked { background: #e3eef7; color: #163e5c; }
  .badge.cancelled, .badge.off { background: #fde4e1; color: #7a1f17; }
  .badge.past, .badge.handled { background: #dff3e6; color: #13472a; }
  .muted { color: var(--muted-foreground); }
  .num { text-align: right; font-variant-numeric: tabular-nums; }
  .pager { display: flex; gap: 1rem; align-items: center; }
  main.page.wide { width: min(76rem, 100% - 2 * clamp(1rem, 4vw, 2.5rem)); }
  .panel { display: grid; gap: 0.9rem; align-content: start; padding: 1.1rem 1.2rem; border-radius: var(--radius); background: var(--card); box-shadow: 0 0 0 1px var(--tg-line); }
  .panel.filters { display: flex; }
  @media (max-width: 26rem) { .panel.filters { flex-wrap: wrap; } }
  main.page > *, .admin > *, .admin-body > * { min-width: 0; }
  .admin-body .panel > * { min-width: 0; max-width: 100%; }
  .hint { overflow-wrap: anywhere; }
  .notice { margin: 0; padding: 0.6rem 0.9rem; border-radius: 0.5rem; background: #fde4e1; color: #7a1f17; }
  .ok { margin: 0; padding: 0.6rem 0.9rem; border-radius: 0.5rem; background: #dff3e6; color: #13472a; }
  .account-form label, .admin label { display: grid; gap: 0.3rem; font-weight: 600; }
  .account-form input, .admin input, .admin select, .admin textarea { font: inherit; padding: 0.55rem 0.7rem; border-radius: 0.5rem; border: 1px solid var(--tg-line); background: #fff; color: inherit; }
  .account-form button, .admin button, a.button { font: inherit; font-weight: 700; padding: 0.6rem 1.05rem; border: 0; border-radius: 0.5rem; background: var(--tg-pine); color: #fff; cursor: pointer; text-decoration: none; justify-self: start; }
  .admin .button.light, .account-form .button.light, a.button.light { background: var(--muted); color: var(--tg-ink); }
  .admin table, .account table { width: 100%; border-collapse: collapse; } .admin th, .admin td, .account th, .account td { padding: 0.5rem; text-align: left; border-bottom: 1px solid var(--tg-line); vertical-align: top; }
  .badge.placed { background: #e3eef7; color: #163e5c; } .badge.claimed, .badge.picked { background: #fff1d6; color: #6b4300; } .badge.delivered { background: #dff3e6; color: #13472a; }

  ${fonts.map(([family, weight, src]) => `@font-face { font-family: "${family}"; font-weight: ${weight}; font-display: swap; src: url(${src}) format("woff2"); }`).join('\n  ')}
  :root {
    --tg-ground: #f9f6f0; --tg-ink: #1d1b16; --tg-line: #d6cdbd; --tg-pine: #1d1b16; --tg-amber: #f26b1d; --tg-muted: #5e5a52;
    --background: var(--tg-ground); --foreground: var(--tg-ink); --card: #ffffff; --card-foreground: var(--tg-ink);
    --primary: var(--tg-pine); --primary-foreground: #ffffff; --ring: var(--tg-pine); --border: var(--tg-line);
    --muted: #ebe4d6; --muted-foreground: var(--tg-muted); --secondary: #ebe4d6; --secondary-foreground: var(--tg-ink);
    --accent: #e6ddcc; --accent-foreground: var(--tg-ink); --radius: 0.5rem;
    --font-heading: "Barlow Condensed", "Arial Narrow", sans-serif; --font-body: "Source Sans 3", system-ui, sans-serif;
    color-scheme: light;
  }
  * { box-sizing: border-box; }
  html { background: var(--tg-ground); }
  body { margin: 0; font-family: var(--font-body); font-size: 1.0625rem; line-height: 1.5; color: var(--tg-ink); background: var(--tg-ground); }
  h1, main.page h2, .app-body h2 { font-family: var(--font-heading); font-weight: 700; line-height: 1.05; letter-spacing: -0.005em; margin: 0; }
  main.page h1 { font-size: clamp(2.25rem, 5vw, 3.5rem); }
  main.page h2 { font-size: 1.75rem; }
  a:where(:not(.action-button)) { color: inherit; }
  :focus-visible { outline: 3px solid var(--tg-amber); outline-offset: 2px; }
  .skip { position: absolute; left: 0.5rem; top: -4rem; z-index: 10; padding: 0.6rem 1rem; border-radius: var(--radius); background: var(--tg-amber); color: var(--tg-ink); font-weight: 700; }
  .skip:focus { top: 0.5rem; }

  .site-head { display: flex; align-items: center; gap: 1.5rem; padding: 0.85rem clamp(1rem, 4vw, 2.5rem); background: var(--tg-ink); color: #f5f3ee; }
  .wordmark { font-family: var(--font-heading); font-weight: 700; font-size: 1.75rem; letter-spacing: 0.01em; color: #fff; text-decoration: none; display: flex; align-items: center; gap: 0.55rem; }
  .wordmark svg { width: 1.9rem; height: 1.9rem; }
  .site-nav { display: flex; gap: 1.25rem; }
  .site-nav a { color: #d4cfc4; text-decoration: none; font-weight: 600; }
  .site-nav a[aria-current] { color: #fff; box-shadow: 0 2px 0 var(--tg-amber); }
  .me { margin-left: auto; display: flex; align-items: center; gap: 0.6rem; font-size: 0.95rem; }
  .me .who { display: grid; line-height: 1.15; }
  .me .who small { color: #b3ada0; }
  .me a.switch { color: #d4cfc4; font-size: 0.9rem; }
  a.button-light { display: inline-block; padding: 0.45rem 0.9rem; border-radius: var(--radius); background: var(--tg-amber); color: var(--tg-ink); font-weight: 700; text-decoration: none; }

  main.page { width: min(72rem, 100% - 2 * clamp(1rem, 4vw, 2.5rem)); margin: 0 auto; padding: 2rem 0 4rem; display: grid; gap: 2.75rem; }
  .lede { max-width: 38rem; color: var(--tg-muted); font-size: 1.15rem; margin: 0.6rem 0 0; }
  .stalls { display: grid; grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr)); gap: 1.25rem; }
  .section-head { display: flex; align-items: baseline; justify-content: space-between; gap: 1rem; margin-bottom: 1rem; flex-wrap: wrap; }
  .section-head p { margin: 0; color: var(--tg-muted); }
  .stack { display: grid; gap: 1rem; }
  .site-foot { padding: 2rem clamp(1rem, 4vw, 2.5rem); color: var(--tg-muted); font-size: 0.9rem; border-top: 1px solid var(--tg-line); }

  /* The market's landing page: full-width sections, each with its own inner column. */
  main.page.landing { width: 100%; padding: 0 0 4rem; gap: 0; }
  .landing .wrap, .landing > section:not(.hero, .band) { width: min(72rem, 100% - 2 * clamp(1rem, 4vw, 2.5rem)); margin-inline: auto; }
  .landing > section:not(.hero, .band) { padding-top: clamp(2.5rem, 6vw, 4.5rem); }
  .landing .said { padding-top: 1.25rem; }
  .kicker { margin: 0 0 0.6rem; font-size: 0.82rem; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: var(--tg-pine); }
  a.go { display: inline-flex; align-items: center; justify-content: center; min-height: 3rem; padding: 0.7rem 1.5rem; border-radius: 0.5rem; background: var(--tg-amber); color: var(--tg-ink); font-weight: 700; font-size: 1.05rem; text-decoration: none; transition: transform 0.15s, background-color 0.15s; }
  a.go:hover { background: #ff8a45; transform: translateY(-1px); }
  a.go.ghost { background: transparent; color: #fff; box-shadow: inset 0 0 0 2px rgb(255 255 255 / 0.75); }
  a.go.ghost:hover { background: rgb(255 255 255 / 0.14); }
  a.go.pine { background: var(--tg-pine); color: #fff; }
  a.go.pine:hover { background: #000000; }

  .hero { position: relative; isolation: isolate; display: grid; align-content: end; min-height: min(84vh, 46rem); color: #fff; background: var(--tg-ink); overflow: hidden; }
  .hero.short { min-height: min(46vh, 24rem); }
  .hero .bg { position: absolute; inset: 0; z-index: -2; width: 100%; height: 100%; object-fit: cover; }
  .hero::before { content: ""; position: absolute; inset: 0; z-index: -1; background: linear-gradient(90deg, rgb(15 26 22 / 0.88) 0%, rgb(15 26 22 / 0.6) 45%, rgb(15 26 22 / 0.15) 100%), linear-gradient(0deg, rgb(15 26 22 / 0.75), transparent 45%); }
  .hero .wrap { padding-block: clamp(3rem, 9vw, 6rem) clamp(2rem, 5vw, 3.5rem); }
  .hero .kicker { color: var(--tg-amber); }
  main.page .hero h1 { font-size: clamp(3rem, 9vw, 6.5rem); line-height: 0.92; text-transform: uppercase; max-width: 13ch; }
  .hero h1 em { display: table; font-style: normal; margin-top: 0.14em; padding: 0.1em 0.22em 0.04em; background: var(--tg-amber); color: var(--tg-ink); rotate: -1.5deg; text-shadow: none; }
  .hero .lede { color: #ece9e2; font-size: clamp(1.15rem, 2.2vw, 1.4rem); max-width: 34rem; margin-top: 1.1rem; }
  .hero .actions { display: flex; flex-wrap: wrap; gap: 0.75rem; margin-top: 1.75rem; }
  .hero .also { margin: 1.1rem 0 0; color: #dcd7cc; }
  .hero-strip { border-top: 1px solid rgb(255 255 255 / 0.2); background: rgb(15 26 22 / 0.6); backdrop-filter: blur(6px); }
  .hero-strip .wrap { display: flex; flex-wrap: wrap; gap: 0.3rem 2.5rem; padding-block: 0.9rem; font-weight: 600; }
  .hero-strip p { margin: 0; }

  .steps { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(15rem, 100%), 1fr)); gap: 1.5rem; margin: 1.5rem 0 0; padding: 0; list-style: none; counter-reset: step; }
  .steps li { counter-increment: step; display: grid; gap: 0.3rem; align-content: start; padding-top: 1rem; border-top: 4px solid var(--tg-pine); }
  .steps li::before { content: counter(step); font-family: var(--font-heading); font-weight: 700; font-size: 3rem; line-height: 1; color: var(--tg-amber); }
  .steps h3 { margin: 0; font-family: var(--font-heading); font-size: 1.6rem; line-height: 1.1; }
  .steps p { margin: 0; color: var(--tg-muted); }

  .split { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(20rem, 100%), 1fr)); gap: clamp(1.5rem, 5vw, 4rem); align-items: center; }
  .split .pic { border-radius: calc(var(--radius) * 2); overflow: hidden; aspect-ratio: 3 / 2; background: var(--muted); box-shadow: 0 30px 60px -35px rgb(29 27 22 / 0.7); }
  .split .pic img { display: block; width: 100%; height: 100%; object-fit: cover; }
  main.page .split h2 { font-size: clamp(2.25rem, 5vw, 3.5rem); text-transform: uppercase; }
  .split p { font-size: 1.15rem; color: var(--tg-muted); max-width: 34rem; }
  main.page h2.big { font-size: clamp(2.25rem, 5vw, 3.5rem); text-transform: uppercase; }
  .order-cta { display: flex; flex-wrap: wrap; align-items: center; gap: 0.75rem 1.25rem; margin: 0; }

  .band { position: relative; isolation: isolate; margin-top: clamp(3rem, 7vw, 5rem); padding-block: clamp(3rem, 8vw, 6rem); color: #fff; background: var(--tg-ink); overflow: hidden; }
  .band .bg { position: absolute; inset: 0; z-index: -2; width: 100%; height: 100%; object-fit: cover; }
  .band::before { content: ""; position: absolute; inset: 0; z-index: -1; background: rgb(15 26 22 / 0.78); }
  .band .kicker { color: var(--tg-amber); }
  main.page .band h2 { font-size: clamp(2.25rem, 5vw, 3.5rem); text-transform: uppercase; max-width: 18ch; }
  .join { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(17rem, 100%), 1fr)); gap: 1.25rem; margin-top: 1.75rem; }
  .join div { display: grid; gap: 0.6rem; align-content: start; justify-items: start; padding: 1.4rem; border-radius: var(--radius); background: rgb(255 255 255 / 0.1); box-shadow: inset 0 0 0 1px rgb(255 255 255 / 0.22); backdrop-filter: blur(4px); }
  .join h3 { margin: 0; font-family: var(--font-heading); font-size: 1.8rem; line-height: 1; }
  .join p { margin: 0; color: #e6e2d9; }
  @media (prefers-reduced-motion: reduce) { .go { transition: none; } }

  /* Dashboards fill the window; the Zubra UI shell scrolls inside itself. */
  body.app { min-height: 100dvh; padding: clamp(0rem, 1.5vw, 1rem); }
  body.app dashboard-shell { --shell-height: calc(100dvh - 2 * clamp(0rem, 1.5vw, 1rem)); background: var(--card); }
  dashboard-shell h1 { font-family: var(--font-heading); font-size: clamp(1.6rem, 3vw, 2.25rem); letter-spacing: 0; }
  .app-body { display: grid; gap: 2rem; padding: 0.5rem 0 3rem; }
  .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(13rem, 1fr)); gap: 1rem; }
  .panels { display: grid; grid-template-columns: repeat(auto-fit, minmax(20rem, 1fr)); gap: 1.5rem; align-items: start; }
  .panel { display: grid; gap: 0.75rem; }
  .panel > h2 { font-size: 1.35rem; }
  .board { display: grid; grid-template-columns: repeat(4, minmax(14rem, 1fr)); gap: 1rem; overflow-x: auto; padding-bottom: 0.5rem; }
  .board order-card { display: block; }
  .board kanban-column h2 { font-family: var(--font-body); }
  .delivery { display: grid; gap: 0.6rem; }
  .delivery .route { margin: 0; font-size: 0.95rem; }
  .shell-actions-link { font-weight: 600; text-decoration: none; padding: 0.35rem 0.6rem; border-radius: var(--radius); box-shadow: 0 0 0 1px var(--border); }

  @media (max-width: 40rem) {
    .site-head { flex-wrap: wrap; gap: 0.75rem 1rem; }
    .site-nav { order: 3; width: 100%; }
    .me .who { display: none; }
  }
`;

const MARK = `<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M32 30c0-9-5-14-14-14 0 9 5 14 14 14zM32 30c0-11 5-17 15-18 0 11-5 17-15 18z" fill="#7bb83a"/><rect x="5" y="30" width="54" height="24" rx="5" fill="#f26b1d"/><rect x="24" y="39" width="16" height="6" rx="3" fill="#1d1b16"/><path d="M11 36v12M53 36v12" stroke="#fff" stroke-width="3" stroke-linecap="round"/></svg>`;

const SCRIPT = (done) => `
  <script type="module">
    import { connect } from '@zubra/sync/connect';
    connect();
    const toast = (detail) => document.dispatchEvent(new CustomEvent('toast', { detail }));
    // What the last action did, said once.
    const done = ${JSON.stringify(done ?? '')};
    if (done) {
      customElements.whenDefined('toast-region').then(() => toast({ message: done, variant: 'success' }));
      const url = new URL(location.href);
      url.searchParams.delete('done');
      history.replaceState(null, '', url);
    }
    // Losing the signal is normal out here: say what happens to changes made meanwhile.
    addEventListener('offline', () => toast({ heading: 'You’re offline', message: 'Changes save on this device and go out when you’re back.', variant: 'warning', duration: 0 }));
    addEventListener('online', () => toast({ message: 'Back online. Your changes are going out now.', variant: 'success' }));
    // The dashboard's user menu.
    document.addEventListener('menuselect', (event) => {
      const go = { switch: '/start', market: '/', storefront: event.target.dataset.storefront };
      if (go[event.detail]) location.href = go[event.detail];
    });
  </script>`;

function head(title, hero = '') {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escape(title)} · Tailgate</title>
  <meta name="description" content="Food from farms near you, brought to your door by a neighbour.">
  <link rel="preload" href="/fonts/barlow-condensed-latin-700-normal.woff2" as="font" type="font/woff2" crossorigin>
  ${hero ? `<link rel="preload" href="${hero}" as="image" fetchpriority="high">
  ` : ''}<link rel="stylesheet" href="/styles/theme.css">
  ${['paper', 'zinc', 'candy', 'midnight', 'terminal'].map((theme) => `<link rel="stylesheet" href="/styles/${theme}.css">`).join('\n  ')}
  <style>${STYLE}${CHART_CSS}</style>
</head>`;
}

/** A public page: the header, the page, a footer. */
export function layout({ title, path, person, banner = '', body, actionsScript, done, avatar = '', cartCount = 0, staff = false, wide = false, landing = false, hero = '' }) {
  const nav = [['/', 'Market'], ...(person?.role === 'customer' ? [['/cart', cartCount ? `Cart (${cartCount})` : 'Cart'], ['/orders', 'My orders']] : []), ...(person?.role === 'farmer' ? [['/farm', 'My farm']] : []), ...(person?.role === 'driver' ? [['/drive', 'My deliveries']] : []), ...(person?.account ? [['/account', 'Your account']] : []), ...(staff ? [['/admin', 'Admin']] : [])];
  return `${head(title, hero)}
<body>
  <a class="skip" href="#main">Skip to the page</a>
  <header class="site-head">
    <a class="wordmark" href="/">${MARK}Tailgate</a>
    <nav class="site-nav" aria-label="Main">${nav.map(([href, label]) => `<a href="${href}"${path === href ? ' aria-current="page"' : ''}>${label}</a>`).join('')}</nav>
    <div class="me">${
      person
        ? `${avatar}<span class="who"><strong>${escape(person.name)}</strong><small>${ROLE[person.role]}</small></span>${person.account ? '<a class="switch" href="/account">Account</a>' : '<a class="switch" href="/start">Switch</a>'}`
        : `<a class="switch" href="/account/sign-in">Sign in</a> <a class="button-light" href="/start">Choose who you are</a>`
    }</div>
  </header>
  <main id="main" class="page${wide ? ' wide' : ''}${landing ? ' landing' : ''}">
    ${banner ? (landing ? `<div class="wrap said">${banner}</div>` : banner) : ''}
    ${body}
  </main>
  <footer class="site-foot">Tailgate is a demo by <a href="https://potomac.solutions">Potomac Solutions</a>, built with <a href="https://github.com/zubra-js/zubra">Zubra</a> and Zubra UI. Checkout is in test mode; nothing here is really for sale.</footer>
  <toast-region></toast-region>
  ${actionsScript}
  ${SCRIPT(done)}
</body>
</html>`;
}

/** A dashboard: the Zubra UI shell, already rendered by the page, fills the window. */
export function appLayout({ title, shell, banner = '', actionsScript, done, palette = '' }) {
  return `${head(title)}
<body class="app" style="${palette}">
  <a class="skip" href="#main">Skip to the page</a>
  ${banner}
  ${shell}
  <toast-region></toast-region>
  ${actionsScript}
  ${SCRIPT(done)}
</body>
</html>`;
}
