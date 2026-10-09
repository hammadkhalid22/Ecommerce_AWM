/* AWM – All Wear Mode | storefront logic (front-end demo; connect to a backend/API for real orders) */
const U = id => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=600&q=80`;
const FALLBACK = 'https://placehold.co/600x800/eef1f8/1a2347?text=AWM';
const COLORS = {Black:'#111',White:'#f5f5f5',Navy:'#1a2347',Olive:'#6b7041',Beige:'#d8c6a5',Red:'#c8372d',Blue:'#3b6fd4',Grey:'#8d929b',Pink:'#f2a7b8'};
const S = ['S','M','L','XL'];

const PRODUCTS = [
 {id:1,name:'Essential Oversized Tee',gender:'Men',cat:'T-Shirts',price:1490,old:1990,tag:'New',colors:['White','Black','Olive'],sizes:S,img:U('1521572163474-6864f9cf17ab'),desc:'Heavy 220 GSM cotton with a relaxed drop-shoulder fit.'},
 {id:2,name:'Graphic Street Tee',gender:'Men',cat:'T-Shirts',price:1690,tag:'Trending',colors:['Black','Grey'],sizes:S,img:U('1583743814966-8936f5b7be1a'),desc:'Soft-wash print tee built for everyday streetwear looks.'},
 {id:3,name:'Classic Oxford Shirt',gender:'Men',cat:'Shirts',price:3290,old:3990,colors:['Blue','White'],sizes:S,img:U('1596755094514-f87e34085b2c'),desc:'Crisp button-down in breathable cotton Oxford weave.'},
 {id:4,name:'Linen Camp Collar Shirt',gender:'Men',cat:'Shirts',price:3490,tag:'New',colors:['Beige','Olive'],sizes:S,img:U('1594938298603-c8148c4dae35'),desc:'Lightweight linen blend with a relaxed resort collar.'},
 {id:5,name:'Slim Fit Denim Jeans',gender:'Men',cat:'Pants',price:4290,old:4990,tag:'Trending',colors:['Blue','Black'],sizes:['30','32','34','36'],img:U('1542272604-787c3835535d'),desc:'Stretch denim with a clean slim taper.'},
 {id:6,name:'Chino Trousers',gender:'Men',cat:'Pants',price:3790,colors:['Beige','Navy','Olive'],sizes:['30','32','34','36'],img:U('1624378439575-d8705ad7ae80'),desc:'Smart-casual chinos with a soft brushed finish.'},
 {id:7,name:'Street Fleece Hoodie',gender:'Men',cat:'Streetwear',price:4990,old:5990,tag:'Trending',colors:['Grey','Black'],sizes:S,img:U('1556821840-3a63f95609a7'),desc:'Midweight fleece hoodie with kangaroo pocket.'},
 {id:8,name:'Utility Bomber Jacket',gender:'Men',cat:'Streetwear',price:6490,tag:'New',colors:['Olive','Black'],sizes:S,img:U('1551028719-00167b16eac5'),desc:'Lightweight bomber with ribbed cuffs and zip pockets.'},
 {id:9,name:'Boxy Crop Tee',gender:'Women',cat:'T-Shirts',price:1390,tag:'New',colors:['White','Pink','Black'],sizes:['XS',...S],img:U('1503341504253-dff4815485f1'),desc:'Cropped boxy tee in smooth combed cotton.'},
 {id:10,name:'Relaxed Poplin Shirt',gender:'Women',cat:'Shirts',price:3190,old:3790,colors:['White','Blue'],sizes:['XS',...S],img:U('1602810318383-e386cc2a3ccf'),desc:'Easy oversized poplin shirt, wear it open or buttoned.'},
 {id:11,name:'High-Rise Wide Trousers',gender:'Women',cat:'Pants',price:3990,tag:'Trending',colors:['Beige','Black'],sizes:['XS',...S],img:U('1515886657613-9f3515b0c78f'),desc:'Flowy wide-leg trousers with a flattering high waist.'},
 {id:12,name:'Mom Fit Jeans',gender:'Women',cat:'Pants',price:4190,old:4790,colors:['Blue','Grey'],sizes:['XS',...S],img:U('1529139574466-a303027c1d8b'),desc:'Vintage-wash denim with a high rise and tapered leg.'},
 {id:13,name:'Everyday Midi Dress',gender:'Women',cat:'Casual',price:4590,tag:'New',colors:['Red','Navy'],sizes:['XS',...S],img:U('1572804013309-59a88b7e92f1'),desc:'Soft, drapey midi dress for work, weekends and everything between.'},
 {id:14,name:'Cozy Knit Co-ord',gender:'Women',cat:'Casual',price:5290,old:6290,tag:'Trending',colors:['Beige','Pink'],sizes:['XS',...S],img:U('1544441893-675973e31985'),desc:'Matching knit top and pants set in a soft, stretchy rib.'},
 {id:15,name:'Oversized Street Hoodie',gender:'Women',cat:'Streetwear',price:4790,colors:['Pink','Grey','Black'],sizes:['XS',...S],img:U('1434389677669-e08b4cac3105'),desc:'Boxy fleece hoodie with a dropped hem and roomy fit.'},
 {id:16,name:'Cargo Street Pants',gender:'Women',cat:'Streetwear',price:4390,tag:'New',colors:['Olive','Black'],sizes:['XS',...S],img:U('1483985988355-763728e1935b'),desc:'Relaxed cargo pants with multiple pockets and adjustable hems.'}
];

const $ = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => [...r.querySelectorAll(s)];
const rs = n => 'Rs. ' + n.toLocaleString('en-PK');
const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };

let cart = load('awm_cart', []), wish = load('awm_wish', []);
const F = {gender:'', cat:'', color:'', tag:'', max:10000, q:'', sort:'default'};

function toast(msg){ $('#toastMsg').textContent = msg; bootstrap.Toast.getOrCreateInstance($('#toast'),{delay:2200}).show(); }

/* ---------- Filters ---------- */
function filterHTML(){
  const cats = [...new Set(PRODUCTS.map(p => p.cat))];
  return `<h6>Gender</h6>${['','Men','Women'].map(g=>`<span class="chip ${F.gender===g?'active':''}" data-f="gender" data-v="${g}">${g||'All'}</span>`).join('')}
  <h6>Category</h6>${['',...cats].map(c=>`<span class="chip ${F.cat===c?'active':''}" data-f="cat" data-v="${c}">${c||'All'}</span>`).join('')}
  <h6>Collection</h6>${['','New','Trending'].map(t=>`<span class="chip ${F.tag===t?'active':''}" data-f="tag" data-v="${t}">${t||'All'}</span>`).join('')}
  <h6>Colour</h6>${Object.entries(COLORS).map(([n,h])=>`<span class="swatch ${F.color===n?'active':''}" style="background:${h}" title="${n}" data-f="color" data-v="${F.color===n?'':n}"></span>`).join('')}
  <h6>Max price: <span id="maxLbl">${rs(F.max)}</span></h6><input type="range" class="form-range" min="1000" max="10000" step="500" value="${F.max}" data-f="max">
  <button class="btn btn-outline-awm btn-sm mt-3 w-100" data-clear>Clear filters</button>`;
}
function renderFilters(){ $('#filtersDesktop').innerHTML = $('#filtersMobile').innerHTML = filterHTML(); }
document.addEventListener('click', e => {
  const f = e.target.closest('[data-f]');
  if (f && f.tagName !== 'INPUT'){ F[f.dataset.f] = f.dataset.v; renderFilters(); render(); }
  if (e.target.closest('[data-clear]')){ Object.assign(F,{gender:'',cat:'',color:'',tag:'',max:10000,q:''}); $('#searchInput').value=''; renderFilters(); render(); }
  const nav = e.target.closest('a[data-gender],a[data-tag]');
  if (nav){ Object.assign(F,{gender:nav.dataset.gender||'',tag:nav.dataset.tag||'',cat:'',color:'',q:''}); renderFilters(); render(); bootstrap.Collapse.getInstance($('#menu'))?.hide(); }
});
document.addEventListener('input', e => {
  if (e.target.matches('input[data-f="max"]')){ F.max = +e.target.value; $$('#maxLbl').forEach(l => l.textContent = rs(F.max)); render(); }
});
$('#sortSelect').addEventListener('change', e => { F.sort = e.target.value; render(); });
$('#searchForm').addEventListener('submit', e => { e.preventDefault(); F.q = $('#searchInput').value.trim().toLowerCase(); render(); $('#shop').scrollIntoView(); });
$('#searchInput').addEventListener('input', e => { F.q = e.target.value.trim().toLowerCase(); render(); });

/* ---------- Product grid ---------- */
function render(){
  let list = PRODUCTS.filter(p => (!F.gender||p.gender===F.gender) && (!F.cat||p.cat===F.cat) && (!F.tag||p.tag===F.tag) &&
    (!F.color||p.colors.includes(F.color)) && p.price<=F.max && (!F.q || (p.name+p.cat+p.gender).toLowerCase().includes(F.q)));
  if (F.sort==='low') list.sort((a,b)=>a.price-b.price);
  if (F.sort==='high') list.sort((a,b)=>b.price-a.price);
  if (F.sort==='new') list.sort((a,b)=>(b.tag==='New')-(a.tag==='New')||b.id-a.id);
  $('#shopTitle').textContent = F.tag ? (F.tag==='New'?'New Arrivals':'Trending Now') : F.gender ? `${F.gender}'s Collection` : 'All Products';
  $('#resultCount').textContent = list.length;
  $('#emptyMsg').classList.toggle('d-none', list.length>0);
  const prodSlider = $('#prodSlider');
  if(prodSlider) prodSlider.classList.toggle('d-none', list.length===0);
  $('#productGrid').innerHTML = list.map(p => `
  <article class="rcard"><div class="card-p" style="width:100%">
    <div class="img-wrap" data-open="${p.id}">
      <img src="${p.img}" alt="${p.name}" loading="lazy" onerror="this.onerror=null;this.src='${FALLBACK}'">
      ${p.tag?`<span class="tag ${p.tag==='New'?'t2':''}">${p.tag}</span>`:''}
      <button class="heart ${wish.includes(p.id)?'on':''}" data-wish="${p.id}" aria-label="Add to wishlist"><i class="bi bi-heart${wish.includes(p.id)?'-fill':''}"></i></button>
      <button class="quick">Quick view</button>
    </div>
    <h3>${p.name}</h3>
    <div class="price">${rs(p.price)}${p.old?`<s>${rs(p.old)}</s>`:''}</div>
    <div class="dots">${p.colors.map(c=>`<i style="background:${COLORS[c]}" title="${c}"></i>`).join('')}</div>
  </div></article>`).join('');
  if(typeof initProdSlider === 'function') initProdSlider();
}

let prodTimer, pTrackMark, pTrackResize;
function initProdSlider() {
  const track = $('#productGrid'), dots = $('#prodDots'), sl = $('#prodSlider');
  if(!track || !dots || !sl) return;
  const cards = $$('.rcard', track);
  if (!cards.length) { dots.innerHTML=''; return; }
  const per = () => Math.max(1, Math.round(track.clientWidth / cards[0].offsetWidth));
  const step = () => cards.length > 1 ? cards[1].offsetLeft - cards[0].offsetLeft : cards[0].offsetWidth;
  const pages = () => Math.ceil(cards.length / per());
  function buildDots(){ dots.innerHTML = Array.from({length:pages()},(_,i)=>`<button aria-label="Go to page ${i+1}" data-p="${i}"></button>`).join(''); mark(); }
  function mark(){ const p = Math.round(track.scrollLeft / (step()*per())); $$('button',dots).forEach((d,i)=>d.classList.toggle('on',i===Math.min(p,pages()-1))); }
  const goPage = p => track.scrollTo({left: p*per()*step(), behavior:'smooth'});
  const cur = () => Math.round(track.scrollLeft / (step()*per()));
  function next(){ const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4; goPage(atEnd ? 0 : cur()+1); }
  $('#prodNext').onclick = next;
  $('#prodPrev').onclick = () => goPage(cur() <= 0 ? pages()-1 : cur()-1);
  dots.onclick = e => { const b = e.target.closest('[data-p]'); if (b) goPage(+b.dataset.p); };
  
  if (pTrackMark) track.removeEventListener('scroll', pTrackMark);
  pTrackMark = () => requestAnimationFrame(mark);
  track.addEventListener('scroll', pTrackMark, {passive:true});
  
  if (pTrackResize) window.removeEventListener('resize', pTrackResize);
  pTrackResize = buildDots;
  window.addEventListener('resize', pTrackResize);
  
  buildDots();
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const start = () => { if (!reduce) { clearInterval(prodTimer); prodTimer = setInterval(next, 5000); } }, stop = () => clearInterval(prodTimer);
  
  if (!sl._eventsAdded) {
    ['mouseenter','touchstart','focusin'].forEach(ev => sl.addEventListener(ev, stop, {passive:true}));
    ['mouseleave','touchend','focusout'].forEach(ev => sl.addEventListener(ev, () => { stop(); start(); }, {passive:true}));
    sl._eventsAdded = true;
  }
  stop(); start();
}
$('#productGrid').addEventListener('click', e => {
  const w = e.target.closest('[data-wish]');
  if (w){ e.stopPropagation(); toggleWish(+w.dataset.wish); return; }
  const o = e.target.closest('[data-open]'); if (o) openProduct(+o.dataset.open);
});
function toggleWish(id){
  wish = wish.includes(id) ? wish.filter(x=>x!==id) : [...wish, id];
  save('awm_wish', wish); renderCart(); render();
  toast(wish.includes(id) ? 'Added to wishlist' : 'Removed from wishlist');
}
$('#wishBtn').addEventListener('click', () => {
  F.q=''; F.gender=''; F.cat=''; F.tag=''; F.color=''; F.max=10000; renderFilters();
  const saved = PRODUCTS.filter(p=>wish.includes(p.id)); if(!saved.length) return toast('Your wishlist is empty');
  const keep = PRODUCTS.slice(); PRODUCTS.length = 0; PRODUCTS.push(...saved); render(); $('#shopTitle').textContent='Your Wishlist';
  $('#shop').scrollIntoView(); PRODUCTS.length = 0; PRODUCTS.push(...keep);
});

/* ---------- Product modal ---------- */
let sel = {};
function openProduct(id){
  const p = PRODUCTS.find(x=>x.id===id); sel = {id, size:p.sizes[1]||p.sizes[0], color:p.colors[0]};
  $('#productBody').innerHTML = `<div class="row g-0"><div class="col-md-6"><img class="pm-img" src="${p.img}" alt="${p.name}" onerror="this.onerror=null;this.src='${FALLBACK}'"></div>
  <div class="col-md-6 pm-info"><small class="text-muted">${p.gender} / ${p.cat}</small><h3>${p.name}</h3>
  <div class="price fs-4 mb-2">${rs(p.price)}${p.old?`<s>${rs(p.old)}</s>`:''}</div><p>${p.desc}</p>
  <h6>Colour: <span id="selColor">${sel.color}</span></h6><div id="pmColors">${p.colors.map(c=>`<span class="swatch ${c===sel.color?'active':''}" style="background:${COLORS[c]}" data-c="${c}" title="${c}"></span>`).join('')}</div>
  <h6 class="mt-2">Size</h6><div id="pmSizes">${p.sizes.map(s=>`<button class="size-btn ${s===sel.size?'active':''}" data-s="${s}">${s}</button>`).join('')}</div>
  <div class="d-flex gap-2 mt-3"><button class="btn btn-awm flex-grow-1" id="addBag">Add to bag</button><button class="btn btn-outline-awm" id="pmWish" aria-label="Wishlist"><i class="bi bi-heart"></i></button></div>
  <ul class="small text-muted mt-3 ps-3 mb-0"><li>Cash on Delivery available</li><li>7-day easy exchange</li></ul></div></div>`;
  bootstrap.Modal.getOrCreateInstance($('#productModal')).show();
}
$('#productBody').addEventListener('click', e => {
  const c = e.target.closest('[data-c]'), s = e.target.closest('[data-s]');
  if (c){ sel.color=c.dataset.c; $('#selColor').textContent=sel.color; $$('#pmColors .swatch').forEach(x=>x.classList.toggle('active',x===c)); }
  if (s){ sel.size=s.dataset.s; $$('#pmSizes .size-btn').forEach(x=>x.classList.toggle('active',x===s)); }
  if (e.target.closest('#pmWish')) toggleWish(sel.id);
  if (e.target.closest('#addBag')){
    const k = `${sel.id}-${sel.size}-${sel.color}`, row = cart.find(r=>r.k===k);
    row ? row.qty++ : cart.push({k, id:sel.id, size:sel.size, color:sel.color, qty:1});
    saveCart(); bootstrap.Modal.getInstance($('#productModal')).hide(); toast('Added to bag');
    bootstrap.Offcanvas.getOrCreateInstance($('#cartCanvas')).show();
  }
});

/* ---------- Cart ---------- */
const saveCart = () => { save('awm_cart', cart); renderCart(); };
const subtotal = () => cart.reduce((t,r)=>t+PRODUCTS.find(p=>p.id===r.id).price*r.qty, 0);
function renderCart(){
  const cn = cart.reduce((t,r)=>t+r.qty,0); $('#cartCount').textContent = cn; $('#wishCount').textContent = wish.length;
  $('#cartCount').hidden = !cn; $('#wishCount').hidden = !wish.length;
  $('#cartSub').textContent = rs(subtotal());
  $('#cartItems').innerHTML = cart.length ? cart.map(r => { const p = PRODUCTS.find(x=>x.id===r.id); return `
   <div class="cart-row"><img src="${p.img}" alt="${p.name}" onerror="this.onerror=null;this.src='${FALLBACK}'">
   <div class="flex-grow-1"><div class="fw-semibold">${p.name}</div><small class="text-muted">${r.color} / ${r.size}</small>
   <div class="d-flex justify-content-between align-items-center mt-2"><div class="qty"><button data-q="-1" data-k="${r.k}">−</button><span class="px-2">${r.qty}</span><button data-q="1" data-k="${r.k}">+</button></div>
   <b>${rs(p.price*r.qty)}</b></div></div><button class="btn-close" data-rm="${r.k}" aria-label="Remove"></button></div>`; }).join('')
   : '<div class="text-center text-muted py-5"><i class="bi bi-bag fs-1"></i><p>Your bag is empty. Add something you like.</p></div>';
}
$('#cartItems').addEventListener('click', e => {
  const q = e.target.closest('[data-q]'), r = e.target.closest('[data-rm]');
  if (q){ const row = cart.find(x=>x.k===q.dataset.k); row.qty += +q.dataset.q; if(row.qty<1) cart = cart.filter(x=>x!==row); saveCart(); }
  if (r){ cart = cart.filter(x=>x.k!==r.dataset.rm); saveCart(); }
});

/* ---------- Checkout ---------- */
const shipping = sub => sub >= 4000 || !sub ? 0 : 250;
$('#checkoutBtn').addEventListener('click', () => {
  if (!cart.length) return toast('Your bag is empty');
  const sub = subtotal(), sh = shipping(sub);
  $('#orderSummary').innerHTML = `<h6>Order summary</h6>${cart.map(r=>{const p=PRODUCTS.find(x=>x.id===r.id);return `<div class="l"><span>${p.name} × ${r.qty}</span><span>${rs(p.price*r.qty)}</span></div>`}).join('')}
   <div class="l"><span>Shipping</span><span>${sh?rs(sh):'Free'}</span></div><div class="l tot"><span>Total</span><span>${rs(sub+sh)}</span></div>`;
  bootstrap.Offcanvas.getInstance($('#cartCanvas')).hide();
  bootstrap.Modal.getOrCreateInstance($('#checkoutModal')).show();
});
$('#checkoutForm').addEventListener('submit', e => {
  e.preventDefault();
  const d = Object.fromEntries(new FormData(e.target)), sub = subtotal(), total = sub + shipping(sub);
  const id = 'AWM-' + Math.floor(100000 + Math.random()*900000);
  const orders = load('awm_orders', {});
  orders[id] = {id, date:new Date().toLocaleDateString('en-GB'), total, pay:d.pay, name:d.name, city:d.city, step:0};
  save('awm_orders', orders); cart = []; saveCart(); e.target.reset();
  $('#checkoutModal .modal-body').innerHTML = `<div class="text-center py-4"><i class="bi bi-check-circle-fill text-success" style="font-size:3.5rem"></i><h4 class="mt-2">Thank you, ${d.name.split(' ')[0]}!</h4>
   <p>Your order <b>${id}</b> is confirmed.<br>${d.pay==='Cash on Delivery'?`Please keep ${rs(total)} ready at delivery.`:'We will send payment instructions to your email.'}</p>
   <button class="btn btn-awm" data-bs-dismiss="modal" onclick="location.reload()">Continue shopping</button></div>`;
  $('#checkoutModal .modal-footer').remove();
});

/* ---------- Order tracking ---------- */
$('#trackForm').addEventListener('submit', e => {
  e.preventDefault();
  const o = load('awm_orders', {})[$('#trackId').value.trim().toUpperCase()];
  const steps = ['Order placed','Processing','Shipped','Out for delivery','Delivered'];
  $('#trackResult').innerHTML = o ? `<p class="mb-2"><b>${o.id}</b> · ${o.date} · ${rs(o.total)} · ${o.pay}</p><ul class="track-steps">${steps.map((s,i)=>`<li class="${i<=o.step?'done':''}">${s}</li>`).join('')}</ul>`
   : '<div class="alert alert-warning mb-0">Order not found. Check the ID in your confirmation and try again.</div>';
});

/* ---------- Account (demo) ---------- */
function accountView(){
  const u = load('awm_user', null);
  if (u){ $('#accTitle').textContent = 'Hi, ' + u.name.split(' ')[0]; $('#accBody').innerHTML = `<p class="mb-1">${u.email}</p><p class="text-muted">Your orders are saved on this device. Use Track Order with your order ID.</p><button class="btn btn-outline-awm w-100" id="logout">Sign out</button>`; }
  else $('#accBody').innerHTML = `<form id="accForm" class="d-grid gap-2"><input class="form-control" name="name" placeholder="Full name" required><input class="form-control" type="email" name="email" placeholder="Email" required><input class="form-control" type="password" name="pw" placeholder="Password (min 6 characters)" minlength="6" required><button class="btn btn-awm">Create account / Sign in</button></form>`;
}
$('#accountModal').addEventListener('show.bs.modal', accountView);
$('#accBody').addEventListener('submit', e => { e.preventDefault(); const d = Object.fromEntries(new FormData(e.target)); save('awm_user',{name:d.name,email:d.email}); accountView(); toast('Signed in'); });
$('#accBody').addEventListener('click', e => { if(e.target.id==='logout'){ localStorage.removeItem('awm_user'); accountView(); } });
$('#newsForm').addEventListener('submit', e => { e.preventDefault(); e.target.reset(); toast('Subscribed. Check your inbox for 10% off.'); });

renderFilters(); render(); renderCart();

/* ---------- Upcoming drop countdown + notify ---------- */
(function(){
  const target = new Date(Date.now() + 12*24*3600*1000 + 5*3600*1000); // demo: next drop in ~12 days
  const box = $('#countdown');
  function tick(){
    let s = Math.max(0, Math.floor((target - Date.now())/1000));
    const v = [['Days',86400],['Hrs',3600],['Min',60],['Sec',1]].map(([l,n])=>{const x=Math.floor(s/n); s%=n; return `<div><b>${String(x).padStart(2,'0')}</b><small>${l}</small></div>`;});
    box.innerHTML = v.join('');
  }
  tick(); setInterval(tick, 1000);
  $$('.notify').forEach(b => b.addEventListener('click', () => { b.textContent = 'You are on the list'; b.disabled = true; toast('We will notify you at launch'); }));
})();

/* ---------- Reviews slider (responsive: 1 / 2 / 3 per view) ---------- */
(function(){
  const R = [
   ['Ahmed R.','Karachi',5,'The oversized tee is exactly as pictured. Thick fabric and the fit is perfect.'],
   ['Sana K.','Lahore',5,'Ordered with Cash on Delivery and it arrived in 2 days. Great quality for the price.'],
   ['Maryam T.','Islamabad',4,'Wide trousers look so good. I went one size down, so check the size guide.'],
   ['Hamza B.','Faisalabad',5,'The hoodie is warm, heavy and worth every rupee. Already ordered a second colour.'],
   ['Fatima A.','Karachi',5,'Easy exchange. I got the wrong size and they swapped it without any fuss.'],
   ['Usman Q.','Rawalpindi',5,'Smooth website, fast delivery, and the shirt fabric feels premium.'],
   ['Ayesha M.','Multan',4,'Loved the midi dress. Colour matches the photos and it washes well.'],
   ['Bilal S.','Hyderabad',5,'Chinos fit perfectly and the packaging was neat. Will order again.']
  ];
  const track = $('#revTrack'), dots = $('#revDots');
  track.innerHTML = R.map(r => `<article class="rcard"><div class="rev"><span class="stars" aria-label="${r[2]} out of 5">${'★'.repeat(r[2])}${'☆'.repeat(5-r[2])}</span><p>${r[3]}</p><div class="who"><i>${r[0][0]}</i><div><b>${r[0]}</b><small>${r[1]}</small></div></div></div></article>`).join('');
  const cards = $$('.rcard', track);
  const per = () => Math.max(1, Math.round(track.clientWidth / cards[0].offsetWidth));
  const step = () => cards[1].offsetLeft - cards[0].offsetLeft;
  const pages = () => Math.ceil(cards.length / per());
  function buildDots(){ dots.innerHTML = Array.from({length:pages()},(_,i)=>`<button aria-label="Go to page ${i+1}" data-p="${i}"></button>`).join(''); mark(); }
  function mark(){ const p = Math.round(track.scrollLeft / (step()*per())); $$('button',dots).forEach((d,i)=>d.classList.toggle('on',i===Math.min(p,pages()-1))); }
  const goPage = p => track.scrollTo({left: p*per()*step(), behavior:'smooth'});
  const cur = () => Math.round(track.scrollLeft / (step()*per()));
  function next(){ const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4; goPage(atEnd ? 0 : cur()+1); }
  $('#revNext').onclick = next;
  $('#revPrev').onclick = () => goPage(cur() <= 0 ? pages()-1 : cur()-1);
  dots.onclick = e => { const b = e.target.closest('[data-p]'); if (b) goPage(+b.dataset.p); };
  track.addEventListener('scroll', () => requestAnimationFrame(mark), {passive:true});
  window.addEventListener('resize', buildDots);
  buildDots();
  let timer; const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const start = () => { if (!reduce) timer = setInterval(next, 5000); }, stop = () => clearInterval(timer);
  const sl = $('#revSlider'); ['mouseenter','touchstart','focusin'].forEach(ev => sl.addEventListener(ev, stop, {passive:true}));
  ['mouseleave','touchend','focusout'].forEach(ev => sl.addEventListener(ev, () => { stop(); start(); }, {passive:true}));
  start();
})();
