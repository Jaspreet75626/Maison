// ─── MAISON — Shared Data & Cart Engine ─────────────────────────────────────

const PRODUCTS = [
  { id:1,  name:'Alpaca Oversized Coat',       category:'outerwear',   colour:'camel',    price:890,  originalPrice:null, status:'new',  badge:'New',  emoji:'🧥', desc:'Double-faced alpaca-wool blend with a fluid, elongated silhouette and hand-stitched lapels.' },
  { id:2,  name:'Cashmere Turtleneck',          category:'knitwear',    colour:'ivory',    price:340,  originalPrice:null, status:'new',  badge:'New',  emoji:'🧶', desc:'Extra-fine gauge cashmere knit with a relaxed ribbed finish. Unisex sizing.' },
  { id:3,  name:'Wide-Leg Tailored Trousers',   category:'trousers',    colour:'charcoal', price:420,  originalPrice:null, status:null,   badge:null,   emoji:'👖', desc:'Pressed crêpe-wool wide-leg trousers with a high rise and side zip.' },
  { id:4,  name:'Merino Cardigan',              category:'knitwear',    colour:'ecru',     price:295,  originalPrice:390,  status:'sale', badge:'Sale', emoji:'👕', desc:'Relaxed merino cardigan with shell buttons and drop shoulders. Limited sizes.' },
  { id:5,  name:'Double-Breasted Blazer',       category:'outerwear',   colour:'charcoal', price:680,  originalPrice:null, status:null,   badge:null,   emoji:'🥼', desc:'Structured double-breasted blazer in Italian wool suiting with patch pockets.' },
  { id:6,  name:'Silk Scarf',                   category:'accessories', colour:'ivory',    price:185,  originalPrice:null, status:'new',  badge:'New',  emoji:'🧣', desc:'Hand-rolled silk twill scarf with an abstract botanical print. 90cm×90cm.' },
  { id:7,  name:'Leather Belt',                 category:'accessories', colour:'camel',    price:145,  originalPrice:195,  status:'sale', badge:'Sale', emoji:'👜', desc:'Full-grain leather belt with a brushed gold-tone buckle. Made in Florence.' },
  { id:8,  name:'Pleated Wool Trousers',        category:'trousers',    colour:'slate',    price:385,  originalPrice:null, status:null,   badge:null,   emoji:'👖', desc:'Single-pleat lightweight wool trousers with side-adjusters and a clean break hem.' },
  { id:9,  name:'Shearling Collar Jacket',      category:'outerwear',   colour:'camel',    price:1250, originalPrice:null, status:'new',  badge:'New',  emoji:'🧥', desc:'Suede jacket with a tonal shearling collar and cuffs. Lined in silk crepe.' },
  { id:10, name:'Ribbed Wool Sweater',          category:'knitwear',    colour:'charcoal', price:265,  originalPrice:null, status:null,   badge:null,   emoji:'🧶', desc:'Chunky ribbed wool sweater with a crewneck and raw edges. Oversized fit.' },
  { id:11, name:'Leather Card Holder',          category:'accessories', colour:'ecru',     price:95,   originalPrice:140,  status:'sale', badge:'Sale', emoji:'💼', desc:'Vegetable-tanned leather card holder with six card slots and a centre pocket.' },
  { id:12, name:'Linen Trousers',               category:'trousers',    colour:'ivory',    price:310,  originalPrice:null, status:null,   badge:null,   emoji:'👖', desc:'Relaxed linen-cotton trousers with a drawstring waist and tapered leg.' },
  { id:13, name:'Cashmere Scarf',               category:'accessories', colour:'camel',    price:225,  originalPrice:null, status:'new',  badge:'New',  emoji:'🧣', desc:'Two-ply cashmere scarf in a generous wrap length. Naturally dyed.' },
  { id:14, name:'Statement Coat',               category:'outerwear',   colour:'slate',    price:975,  originalPrice:null, status:null,   badge:null,   emoji:'🧥', desc:'Sculptural A-line coat in boiled wool with a mandarin collar and hidden seams.' },
  { id:15, name:'Fine-Knit Vest',               category:'knitwear',    colour:'ivory',    price:210,  originalPrice:280,  status:'sale', badge:'Sale', emoji:'👕', desc:'Superfine merino ribbed vest with a deep V-neck. Pairs with everything.' },
  { id:16, name:'Suede Tote',                   category:'accessories', colour:'slate',    price:445,  originalPrice:null, status:'new',  badge:'New',  emoji:'👜', desc:'Structured Italian suede tote with an interior leather lining and brass zips.' },
];

// ─── Cart Engine (localStorage-backed) ─────────────────────────────────────
const Cart = {
  _key: 'maison_cart',

  get() {
    try { return JSON.parse(localStorage.getItem(this._key)) || {}; }
    catch { return {}; }
  },

  save(cart) {
    localStorage.setItem(this._key, JSON.stringify(cart));
  },

  add(id) {
    const cart = this.get();
    const product = PRODUCTS.find(p => p.id === id);
    if (!product) return;
    cart[id] = cart[id]
      ? { ...cart[id], qty: cart[id].qty + 1 }
      : { product, qty: 1 };
    this.save(cart);
    this.updateBadge();
    return cart;
  },

  remove(id) {
    const cart = this.get();
    delete cart[id];
    this.save(cart);
    this.updateBadge();
    return cart;
  },

  changeQty(id, delta) {
    const cart = this.get();
    if (!cart[id]) return cart;
    const newQty = cart[id].qty + delta;
    if (newQty <= 0) return this.remove(id);
    cart[id].qty = newQty;
    this.save(cart);
    this.updateBadge();
    return cart;
  },

  clear() {
    localStorage.removeItem(this._key);
    this.updateBadge();
  },

  total() {
    const cart = this.get();
    return Object.values(cart).reduce((s, i) => s + i.product.price * i.qty, 0);
  },

  count() {
    const cart = this.get();
    return Object.values(cart).reduce((s, i) => s + i.qty, 0);
  },

  updateBadge() {
    const el = document.getElementById('cartCount');
    if (!el) return;
    const n = this.count();
    el.textContent = n;
    el.classList.remove('bump');
    void el.offsetWidth;
    el.classList.add('bump');
  }
};

// ─── Colour background map ───────────────────────────────────────────────────
function colourBg(colour) {
  return { ivory:'#2a2720', camel:'#2c2418', charcoal:'#1a1a1c', ecru:'#25231e', slate:'#1c1f24' }[colour] || '#1e1b16';
}

// ─── Toast ───────────────────────────────────────────────────────────────────
let _toastTimer;
function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => t.classList.remove('show'), 2200);
}

// ─── Shared Nav Cart Drawer renderer ────────────────────────────────────────
function renderCartDrawer() {
  const container = document.getElementById('cartItems');
  const footer    = document.getElementById('cartFooter');
  if (!container) return;
  const cart  = Cart.get();
  const items = Object.values(cart);

  if (!items.length) {
    container.innerHTML = `<div class="cart-empty">
      <div class="cart-empty-icon">◻</div>
      <p>Your bag is empty</p>
      <p style="font-size:0.7rem;letter-spacing:0.05em">Add pieces to begin</p>
    </div>`;
    if (footer) footer.style.display = 'none';
    return;
  }

  if (footer) {
    footer.style.display = 'block';
    document.getElementById('cartTotal').textContent = '$' + Cart.total().toLocaleString();
  }

  container.innerHTML = items.map(i => `
    <div class="cart-item">
      <div class="cart-item-img">${i.product.emoji}</div>
      <div class="cart-item-info">
        <div class="cart-item-name">${i.product.name}</div>
        <div class="cart-item-category">${i.product.category}</div>
        <div class="cart-item-controls">
          <button class="qty-btn" onclick="cartChange(${i.product.id},-1)">−</button>
          <span class="qty-value">${i.qty}</span>
          <button class="qty-btn" onclick="cartChange(${i.product.id},1)">+</button>
          <button class="remove-btn" onclick="cartRemove(${i.product.id})">Remove</button>
        </div>
      </div>
      <div class="cart-item-price">$${(i.product.price * i.qty).toLocaleString()}</div>
    </div>`).join('');
}

function cartChange(id, delta) {
  Cart.changeQty(id, delta);
  renderCartDrawer();
  if (typeof renderProducts === 'function') renderProducts();
}

function cartRemove(id) {
  Cart.remove(id);
  renderCartDrawer();
  if (typeof renderProducts === 'function') renderProducts();
}

function toggleCart() {
  const overlay = document.getElementById('cartOverlay');
  const drawer  = document.getElementById('cartDrawer');
  const open = overlay.classList.toggle('open');
  drawer.classList.toggle('open', open);
  renderCartDrawer();
}

// Init badge on page load
document.addEventListener('DOMContentLoaded', () => Cart.updateBadge());
