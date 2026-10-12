
/* ══════════════════════════════════
   BRANCH CONFIG
══════════════════════════════════ */
const BRANCHES = {
  shokoufeh: {
    name: 'شعبه شکوفه',
    short: 'شکوفه',
    whatsapp: '',
  },
  mahtab: {
    name: 'شعبه مهتاب',
    short: 'مهتاب',
    whatsapp: '',
  }
};

let activeBranch = null;
let branchPickerTrigger = null;
let cartTrigger = null;
let variantTrigger = null;
let lightboxTrigger = null;

function selectBranch(id) {
  const b = BRANCHES[id];
  if (!b) return;

  const pickerWasOpen = !document.getElementById('branchOverlay').classList.contains('hidden');
  const isChangingBranch = activeBranch && activeBranch !== id;
  if (isChangingBranch && cart.length > 0 && !confirm('با تغییر شعبه، سبد خرید پاک می‌شود. ادامه می‌دهید؟')) {
    const picker = document.getElementById('branchOverlay');
    picker.classList.add('hidden');
    picker.setAttribute('aria-hidden', 'true');
    document.querySelector('.nav-branch-pill').focus();
    return;
  }

  activeBranch = id;
  document.querySelectorAll('.branch-pick-card').forEach(button => {
    button.setAttribute('aria-pressed', String(button.dataset.branch === id));
  });

  // Update all branch name displays
  document.getElementById('navBranchName').textContent = b.short;
  document.getElementById('heroBranchText').textContent = b.name;
  document.getElementById('menuBranchText').textContent = b.name;
  document.getElementById('cartHeaderBranch').textContent = 'شعبه: ' + b.name;

  // Show navbar, hide overlay
  document.getElementById('branchOverlay').classList.add('hidden');
  document.getElementById('branchOverlay').setAttribute('aria-hidden', 'true');
  document.getElementById('navbar').classList.add('visible');
  if (pickerWasOpen) document.querySelector('.nav-branch-pill').focus();

  // Clear the cart only after a confirmed switch to another branch.
  if (isChangingBranch) {
    cart = [];
    renderCart();
  }
  renderMenu();
  showToast('✓ ' + b.name + ' انتخاب شد');
}

function changeBranch() {
  const picker = document.getElementById('branchOverlay');
  branchPickerTrigger = document.activeElement;
  picker.classList.remove('hidden');
  picker.setAttribute('aria-hidden', 'false');
  document.querySelector('.branch-pick-card').focus();
}

/* ══════════════════════════════════
   MENU DATA
   نکته: برای لاته و آیس لاته، به‌جای آیتم جداگانه‌ی «+»، آرایه‌ی
   syrups تعریف شده تا کاربر بعد از انتخاب نوع دانه بتواند
   یک سیروپ اختیاری هم اضافه کند.
══════════════════════════════════ */
const menuData = [
  {
    id:'hotCoffee', label:'نوشیدنی‌های گرم بر پایه قهوه', emoji:'☕',
    note:'ترکیبی / تک خاستگاه',
    items:[
      { name:'اسپرسو',      desc:'اسپرسوی غنی و عمیق', prices:[{l:'ترکیبی',v:'۱۳۵,۰۰۰',n:135000},{l:'تک خاستگاه',v:'۱۹۰,۰۰۰',n:190000}] },
      { name:'امریکانو',    desc:'اسپرسو با آب گرم، ملایم و عمیق', prices:[{l:'ترکیبی',v:'۱۴۵,۰۰۰',n:145000},{l:'تک خاستگاه',v:'۱۹۵,۰۰۰',n:195000}] },
      { name:'کاپوچینو',    desc:'اسپرسو با شیر و کف فشرده', prices:[{l:'ترکیبی',v:'۱۹۵,۰۰۰',n:195000},{l:'تک خاستگاه',v:'۲۵۰,۰۰۰',n:250000}] },
      { name:'لاته',        desc:'اسپرسو با شیر بخار و کف ابری', prices:[{l:'ترکیبی',v:'۲۰۵,۰۰۰',n:205000},{l:'تک خاستگاه',v:'۲۶۰,۰۰۰',n:260000}],
        syrups:[{name:'شکلات',price:30000},{name:'تارگیل',price:30000},{name:'وانیل',price:30000},{name:'فندق',price:30000},{name:'کارامل',price:30000}] },
    ]
  },
  {
    id:'coldCoffee', label:'نوشیدنی‌های سرد بر پایه قهوه', emoji:'🧊',
    note:'ترکیبی / تک خاستگاه',
    items:[
      { name:'آیس امریکانو',   desc:'امریکانوی سرد روی یخ', prices:[{l:'ترکیبی',v:'۱۵۰,۰۰۰',n:150000},{l:'تک خاستگاه',v:'۲۰۰,۰۰۰',n:200000}] },
      { name:'آیس لاته',       desc:'لاته سرد با شیر و یخ', prices:[{l:'ترکیبی',v:'۲۱۰,۰۰۰',n:210000},{l:'تک خاستگاه',v:'۲۶۵,۰۰۰',n:265000}],
        syrups:[{name:'شکلات',price:30000},{name:'تارگیل',price:30000},{name:'وانیل',price:30000},{name:'فندق',price:30000},{name:'کارامل',price:30000}] },
      { name:'کلد برو تک خاستگاه', desc:'عصاره‌گیری با روش همجواری', prices:[{l:'قیمت',v:'۲۶۵,۰۰۰',n:265000}] },
      { name:'کلد برو لاماکینا',    desc:'کلد برو ویژه با روش لاماکینا', prices:[] },
      { name:'کلد برو تیپیکا لیچی', desc:'کلد برو با نت‌های لیچی', prices:[] },
      { name:'کلد برو پاپوآ',       desc:'دانه‌های نادر پاپوآ گینه نو', prices:[] },
    ]
  },
  {
    id:'brewedCoffee', label:'قهوه‌های دمی', emoji:'☕',
    items:[
      { name:'قهوه دم‌آوری شده', desc:'Pour Over با دقت و عشق', prices:[{l:'قیمت',v:'۲۴۰,۰۰۰',n:240000}] },
      { name:'V60',               desc:'درایپر V60 ژاپنی، عطرآگین', prices:[{l:'قیمت',v:'۲۶۰,۰۰۰',n:260000}] },
    ]
  },
  {
    id:'matcha', label:'نوشیدنی‌های بر پایه ماچا', emoji:'🍵',
    items:[
      { name:'لاته ماچا',            desc:'ماچای ژاپنی درجه اول با شیر گرم', prices:[{l:'قیمت',v:'۲۶۰,۰۰۰',n:260000}] },
      { name:'آیس ماچا توت فرنگی',   desc:'ماچا سرد با پوره توت فرنگی تازه', prices:[{l:'قیمت',v:'۲۶۵,۰۰۰',n:265000}] },
      { name:'آیس ماچا پینادا',      desc:'ماچا سرد با طعم تروپیکال', prices:[{l:'قیمت',v:'۲۸۰,۰۰۰',n:280000}] },
    ]
  },
  {
    id:'tea', label:'چای و دمنوش', emoji:'🫖',
    items:[
      { name:'چای سیاه',                desc:'چای سیاه اصیل لاهیجانی', prices:[{l:'قیمت',v:'۱۰۰,۰۰۰',n:100000}] },
      { name:'چای سبز',                 desc:'چای سبز معطر و آرام‌بخش', prices:[{l:'قیمت',v:'۱۱۰,۰۰۰',n:110000}] },
      { name:'دمنوش لمون گرس جینجر',   desc:'زنجبیل، آویشن، نعنا', prices:[{l:'قیمت',v:'۱۶۵,۰۰۰',n:165000}] },
      { name:'دمنوش اپل پارادایس',     desc:'سیب، دارچین، به', prices:[{l:'قیمت',v:'۱۶۵,۰۰۰',n:165000}] },
      { name:'دمنوش گلدن وانیلا',      desc:'فندق، وانیل، بهارنارنج، دارچین', prices:[{l:'قیمت',v:'۱۷۰,۰۰۰',n:170000}] },
      { name:'دمنوش کوئین بری',        desc:'چای ترش، زرشک، میوه‌های قرمز', prices:[{l:'قیمت',v:'۱۷۳,۰۰۰',n:173000}] },
    ]
  },
  {
    id:'hotDrinks', label:'نوشیدنی‌های گرم', emoji:'🥛',
    items:[
      { name:'ماسالا',     desc:'ماسالای هندی با ادویه‌های معطر', prices:[{l:'قیمت',v:'۲۰۰,۰۰۰',n:200000}] },
      { name:'شیرعسل',    desc:'شیر گرم با عسل طبیعی', prices:[{l:'قیمت',v:'۲۱۰,۰۰۰',n:210000}] },
      { name:'هات چاکلت', desc:'شکلات داغ با کاکائوی بلژیکی', prices:[{l:'قیمت',v:'۲۲۰,۰۰۰',n:220000}] },
    ]
  },
  {
    id:'smoothies', label:'اسموتی‌ها', emoji:'🥤',
    items:[
      { name:'هندوانه توت فرنگی', desc:'تابستانی و خنک', prices:[{l:'قیمت',v:'۲۵۰,۰۰۰',n:250000}] },
      { name:'شانوت انبه',        desc:'سرشار از ویتامین', prices:[{l:'قیمت',v:'۳۵۵,۰۰۰',n:355000}] },
    ]
  },
  {
    id:'shakes', label:'شیک‌ها', emoji:'🧋',
    items:[
      { name:'شیک توت فرنگی',       desc:'با میوه تازه و خامه', prices:[{l:'قیمت',v:'۳۰۰,۰۰۰',n:300000}] },
      { name:'شیک بری',             desc:'تمشک و بلوبری مخلوط', prices:[{l:'قیمت',v:'۳۲۰,۰۰۰',n:320000}] },
      { name:'شیک شکلات',           desc:'غنی با بستنی وانیل', prices:[{l:'قیمت',v:'۳۵۰,۰۰۰',n:350000}] },
      { name:'شیک کیت کت',          desc:'با کیت‌کت و بستنی شکلاتی', prices:[{l:'قیمت',v:'۳۵۰,۰۰۰',n:350000}] },
      { name:'شیک لوتوس',           desc:'کرم بیسکویت لوتوس، اعتیادآور!', prices:[{l:'قیمت',v:'۳۷۰,۰۰۰',n:370000}] },
      { name:'شیک کره بادام زمینی', desc:'خامه‌ای و غنی', prices:[{l:'قیمت',v:'۳۷۰,۰۰۰',n:370000}] },
    ]
  },
  {
    id:'mocktails', label:'موکتل‌ها', emoji:'🍹',
    items:[
      { name:'لیموناد',   desc:'لیموناد تازه و خنک', prices:[{l:'قیمت',v:'۲۱۰,۰۰۰',n:210000}] },
      { name:'پیناکولادا', desc:'آناناس و نارگیل', prices:[{l:'قیمت',v:'۲۵۰,۰۰۰',n:250000}] },
      { name:'شانوت',     desc:'موکتل با طعمی منحصربه‌فرد', prices:[{l:'قیمت',v:'۲۸۵,۰۰۰',n:285000}] },
    ]
  },
  {
    id:'food', label:'میان وعده‌ها', emoji:'🍰',
    items:[
      { name:'کیک و شیرینی', desc:'جزئیات و قیمت در این نسخه ثبت نشده است', prices:[] },
    ]
  }
];

let currentFilter = 'all';
let currentSearch = '';

function renderMenu() {
  const container = document.getElementById('menuContent');
  let html = '';
  let resultCount = 0;

  menuData.forEach(cat => {
    if (currentFilter !== 'all' && cat.id !== currentFilter) return;
    const items = cat.items.filter(item =>
      item.name.includes(currentSearch) || item.desc.includes(currentSearch)
    );
    if (!items.length) return;
    resultCount += items.length;

    html += `<div class="menu-section">
      <h3 class="menu-section-title">
        ${cat.emoji} ${cat.label}
        ${cat.note ? `<span class="menu-section-note">${cat.note}</span>` : ''}
      </h3>
      <div class="menu-grid">
        ${items.map(item => buildMenuItemHTML(item)).join('')}
      </div>
    </div>`;
  });

  container.innerHTML = html || `<p style="text-align:center;color:var(--text-muted);padding:3rem">موردی یافت نشد.</p>`;
  document.getElementById('menuStatus').textContent = resultCount
    ? `${resultCount.toLocaleString('fa')} مورد در منو`
    : 'موردی یافت نشد';
}

function buildMenuItemHTML(item) {
  let priceArea = '';
  let addBtn = '';
  const syrupBadge = item.syrups ? `<span class="menu-section-note">امکان افزودن سیروپ</span>` : '';

  if (item.prices.length === 0) {
    priceArea = `<span class="price-ask">قیمت هنوز ثبت نشده</span>`;
  } else if (item.prices.length === 1 && !item.syrups) {
    priceArea = `<div class="price-tags">
      <div class="price-tag">
        <span class="price-label">${item.prices[0].l}</span>
        <span class="price-val">${item.prices[0].v}</span>
      </div>
    </div>`;
    addBtn = `<button class="add-btn" onclick="handleAdd('${esc(item.name)}','${esc(item.desc)}',${item.prices[0].n},'${esc(item.prices[0].l)}')">+ افزودن</button>`;
  } else {
    priceArea = `<div class="price-tags">
      ${item.prices.map(p => `<div class="price-tag"><span class="price-label">${p.l}</span><span class="price-val">${p.v}</span></div>`).join('')}
    </div>`;
    const pricesJson = encodeURIComponent(JSON.stringify(item.prices));
    const syrupsJson = item.syrups ? encodeURIComponent(JSON.stringify(item.syrups)) : '';
    addBtn = `<button class="add-btn" onclick="openVariant('${esc(item.name)}','${esc(item.desc)}','${pricesJson}','${syrupsJson}')">+ افزودن</button>`;
  }

  return `<div class="menu-item">
    <div class="menu-item-body">
      <div class="menu-item-name">${item.name} ${syrupBadge}</div>
      <div class="menu-item-desc">${item.desc}</div>
      <div class="menu-item-footer">
        ${priceArea}
        ${addBtn}
      </div>
    </div>
  </div>`;
}

function esc(s){ return (s||'').replace(/'/g,"\\'"); }

function setFilter(btn, f) {
  currentFilter = f;
  document.querySelectorAll('.filter-btn').forEach(b => {
    b.classList.remove('active');
    b.setAttribute('aria-pressed', 'false');
  });
  btn.classList.add('active');
  btn.setAttribute('aria-pressed', 'true');
  renderMenu();
}
function filterMenu(val) {
  currentSearch = val;
  renderMenu();
}

/* ══════════════════════════════════
   VARIANT MODAL (نوع دانه + سیروپ اختیاری)
══════════════════════════════════ */
let variantState = null;

function openVariant(name, desc, pricesEnc, syrupsEnc) {
  if (!activeBranch) { changeBranch(); return; }
  const prices = JSON.parse(decodeURIComponent(pricesEnc));
  const syrups = syrupsEnc ? JSON.parse(decodeURIComponent(syrupsEnc)) : null;
  variantState = { name, desc, prices, selected: 0, syrups, syrupSelected: -1 };

  document.getElementById('variantTitle').textContent = name;
  document.getElementById('variantDesc').textContent = desc;

  const opts = document.getElementById('variantOptions');
  opts.innerHTML = prices.map((p, i) => `
    <button type="button" class="variant-option ${i===0?'selected':''}" aria-pressed="${i===0}" onclick="selectVariant(this,${i})">
      <span class="variant-option-name">${p.l}</span>
      <span class="variant-option-price">${p.v} ریال</span>
    </button>`).join('');

  const syrupSection = document.getElementById('syrupSection');
  if (syrups && syrups.length) {
    syrupSection.style.display = 'block';
    const syrupOpts = document.getElementById('syrupOptions');
    syrupOpts.innerHTML = `
      <button type="button" class="variant-option selected" aria-pressed="true" onclick="selectSyrup(this,-1)">
        <span class="variant-option-name">بدون سیروپ</span>
        <span class="variant-option-price">—</span>
      </button>
      ` + syrups.map((s, i) => `
      <button type="button" class="variant-option" aria-pressed="false" onclick="selectSyrup(this,${i})">
        <span class="variant-option-name">${s.name}</span>
        <span class="variant-option-price">+${s.price.toLocaleString('fa')} ریال</span>
      </button>`).join('');
  } else {
    syrupSection.style.display = 'none';
  }

  const backdrop = document.getElementById('variantBackdrop');
  variantTrigger = document.activeElement;
  backdrop.classList.add('open');
  backdrop.setAttribute('aria-hidden', 'false');
  document.querySelector('#variantOptions .variant-option')?.focus();
}

function selectVariant(el, i) {
  document.querySelectorAll('#variantOptions .variant-option').forEach(o => {
    o.classList.remove('selected');
    o.setAttribute('aria-pressed', 'false');
  });
  el.classList.add('selected');
  el.setAttribute('aria-pressed', 'true');
  variantState.selected = i;
}

function selectSyrup(el, i) {
  document.querySelectorAll('#syrupOptions .variant-option').forEach(o => {
    o.classList.remove('selected');
    o.setAttribute('aria-pressed', 'false');
  });
  el.classList.add('selected');
  el.setAttribute('aria-pressed', 'true');
  variantState.syrupSelected = i;
}

function confirmVariant() {
  if (!variantState) return;
  const p = variantState.prices[variantState.selected];
  let price = p.n;
  let label = p.l;

  if (variantState.syrups && variantState.syrupSelected > -1) {
    const s = variantState.syrups[variantState.syrupSelected];
    price += s.price;
    label += ' + سیروپ ' + s.name;
  }

  addToCart(variantState.name, variantState.desc, price, label);
  closeVariant();
}

function closeVariant(e) {
  if (e && e.target !== document.getElementById('variantBackdrop')) return;
  const backdrop = document.getElementById('variantBackdrop');
  const wasOpen = backdrop.classList.contains('open');
  backdrop.classList.remove('open');
  backdrop.setAttribute('aria-hidden', 'true');
  variantState = null;
  if (wasOpen) variantTrigger?.focus();
}

/* ══════════════════════════════════
   CART
══════════════════════════════════ */
let cart = [];

function handleAdd(name, desc, price, variant) {
  if (!activeBranch) { changeBranch(); return; }
  addToCart(name, desc, price, variant);
}

function addToCart(name, desc, price, variant) {
  if (!activeBranch) { changeBranch(); return; }
  const key = name + '|' + variant;
  const existing = cart.find(i => i.key === key);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ key, name, desc, price, variant, qty: 1 });
  }
  renderCart();
  showToast('✓ ' + name + (variant ? ' (' + variant + ')' : '') + ' افزوده شد');
}

function removeFromCart(key) {
  const idx = cart.findIndex(i => i.key === key);
  if (idx === -1) return;
  if (cart[idx].qty > 1) cart[idx].qty--;
  else cart.splice(idx, 1);
  renderCart();
}

function renderCart() {
  const count = cart.reduce((s, i) => s + i.qty, 0);
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

  // update count badge
  const badge = document.getElementById('cartCount');
  if (count > 0) { badge.textContent = count; badge.classList.remove('hidden'); }
  else { badge.classList.add('hidden'); }

  const body = document.getElementById('cartBody');
  const footer = document.getElementById('cartFooter');

  if (cart.length === 0) {
    body.innerHTML = `<div class="cart-empty"><div class="cart-empty-icon">🛒</div><div class="cart-empty-text">سبد خرید خالی است</div></div>`;
    footer.style.display = 'none';
    return;
  }

  body.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        ${item.variant ? `<div class="cart-item-variant">${item.variant}</div>` : ''}
        <div class="cart-item-price">${item.price > 0 ? (item.price * item.qty).toLocaleString('fa') + ' ریال' : 'قیمت متغیر'}</div>
      </div>
      <div class="cart-item-controls">
        <button class="qty-btn" aria-label="کاهش تعداد ${item.name}" onclick="removeFromCart('${item.key.replace(/'/g,"\\'")}')">−</button>
        <span class="qty-num">${item.qty}</span>
        <button class="qty-btn" aria-label="افزودن یک عدد ${item.name}" onclick="addToCart('${item.name.replace(/'/g,"\\'")}','${item.desc.replace(/'/g,"\\'")}',${item.price},'${item.variant.replace(/'/g,"\\'")}')">+</button>
      </div>
    </div>`).join('');

  document.getElementById('cartTotal').textContent = total.toLocaleString('fa') + ' ریال';
  footer.style.display = 'block';
}

function openCart() {
  cartTrigger = document.activeElement;
  document.getElementById('cartDrawer').classList.add('open');
  document.getElementById('cartBackdrop').classList.add('open');
  document.getElementById('cartDrawer').setAttribute('aria-hidden', 'false');
  document.getElementById('cartDrawer').removeAttribute('inert');
  document.body.style.overflow = 'hidden';
  document.querySelector('.cart-close').focus();
}
function closeCart() {
  const wasOpen = document.getElementById('cartDrawer').classList.contains('open');
  document.getElementById('cartDrawer').classList.remove('open');
  document.getElementById('cartBackdrop').classList.remove('open');
  document.getElementById('cartDrawer').setAttribute('aria-hidden', 'true');
  document.getElementById('cartDrawer').setAttribute('inert', '');
  document.body.style.overflow = '';
  if (wasOpen) cartTrigger?.focus();
}

function sendOrder() {
  if (!activeBranch) {
    showToast('برای ادامه ابتدا یک شعبه انتخاب کنید');
    changeBranch();
    return;
  }
  if (cart.length === 0) {
    showToast('سبد خرید شما خالی است');
    return;
  }
  const b = BRANCHES[activeBranch];
  const whatsapp = String(b.whatsapp || '').replace(/\D/g, '');
  if (!/^\d{10,15}$/.test(whatsapp)) {
    showToast('ارسال سفارش فعال نیست؛ شماره رسمی واتساپ این شعبه ثبت نشده است');
    return;
  }
  const note = document.getElementById('cartNote').value.trim();
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

  let msg = `🛒 *سفارش جدید — کافه ژیپسوفیلا*\n`;
  msg += `📍 *شعبه:* ${b.name}\n`;
  msg += `──────────────────\n`;
  cart.forEach(item => {
    msg += `• ${item.name}`;
    if (item.variant) msg += ` (${item.variant})`;
    msg += ` × ${item.qty}`;
    if (item.price > 0) msg += ` — ${(item.price * item.qty).toLocaleString('fa')} ریال`;
    msg += '\n';
  });
  msg += `──────────────────\n`;
  if (total > 0) msg += `💰 *جمع کل:* ${total.toLocaleString('fa')} ریال\n`;
  if (note) msg += `📝 *توضیحات:* ${note}\n`;
  msg += `\nلطفاً سفارش را تأیید کنید 🙏`;

  const url = `https://wa.me/${whatsapp}?text=${encodeURIComponent(msg)}`;
  const orderWindow = window.open(url, '_blank');
  if (orderWindow) orderWindow.opener = null;
  else showToast('مرورگر پنجره سفارش را مسدود کرد؛ اجازه بازشدن پنجره را بررسی کنید');
}

/* ══════════════════════════════════
   MISC UI
══════════════════════════════════ */
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(showToast.timeout);
  showToast.timeout = setTimeout(() => t.classList.remove('show'), 3000);
}

// Batch scroll-driven UI updates to one per animation frame.
let scrollUpdatePending = false;
function updateScrollUI() {
  document.getElementById('backTop').classList.toggle('visible', window.scrollY > 300);
  scrollUpdatePending = false;
}
window.addEventListener('scroll', () => {
  if (scrollUpdatePending) return;
  scrollUpdatePending = true;
  requestAnimationFrame(updateScrollUI);
}, { passive:true });
updateScrollUI();

// Hamburger
document.getElementById('hamburger').addEventListener('click', () => {
  const menu = document.getElementById('mobileNav');
  const isOpen = menu.classList.toggle('open');
  document.getElementById('hamburger').setAttribute('aria-expanded', String(isOpen));
});
function closeMobileNav() {
  document.getElementById('mobileNav').classList.remove('open');
  document.getElementById('hamburger').setAttribute('aria-expanded', 'false');
}

// Lightbox
function openLightbox(el) {
  lightboxTrigger = el;
  const source = el.querySelector('img');
  const image = document.getElementById('lightboxImg');
  image.src = source.src;
  image.alt = source.alt;
  const lightbox = document.getElementById('lightbox');
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  document.querySelector('.lightbox-close').focus();
}
function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  const wasOpen = lightbox.classList.contains('open');
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  if (wasOpen) lightboxTrigger?.focus();
}
document.addEventListener('keydown', e => {
  if (e.key === 'Tab') {
    const dialog = document.querySelector('#branchOverlay:not(.hidden), #cartDrawer.open, #variantBackdrop.open, #lightbox.open');
    if (!dialog) return;
    const focusable = [...dialog.querySelectorAll('a[href],button:not([disabled]),input:not([disabled]),textarea:not([disabled])')]
      .filter(el => getComputedStyle(el).visibility !== 'hidden');
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && (document.activeElement === first || !dialog.contains(document.activeElement))) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && (document.activeElement === last || !dialog.contains(document.activeElement))) {
      e.preventDefault();
      first.focus();
    }
    return;
  }
  if (e.key === 'Escape') {
    const picker = document.getElementById('branchOverlay');
    if (!picker.classList.contains('hidden')) {
      picker.classList.add('hidden');
      picker.setAttribute('aria-hidden', 'true');
      branchPickerTrigger?.focus();
    }
    closeLightbox();
    closeCart();
    closeVariant();
    closeMobileNav();
  }
});

// Scroll reveal
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } });
}, { threshold: 0.08 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Contact form
// Init
document.getElementById('copyrightYear').textContent =
  new Intl.DateTimeFormat('fa-IR-u-ca-persian', { year: 'numeric' }).format(new Date());
renderMenu();
