// â”€â”€ PRODUCTS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const LOCAL_P=[
  {id:1,cat:'fishing',name:'Ð“Ñ€ÑƒÐ·Ð¸Ð»Ð° Ñ‡ÐµÐ±ÑƒÑ€Ð°ÑˆÐºÐ¸ Ñ€Ð°Ð·Ð±Ð¾Ñ€Ð½Ñ‹Ðµ (10 ÑˆÑ‚)',price:185,old:240,img:'https://catcherfish.ru/image/cache/catalog/gruzila_cheburashki_razbornye-300x300.jpg',stock:847,badge:'Ð¥Ð¸Ñ‚',bc:'or'},
  {id:2,cat:'fishing',name:'Ð“Ñ€ÑƒÐ·Ð¸Ð»Ð° Ð´Ð»Ñ Ð¾Ñ‚Ð²Ð¾Ð´Ð½Ð¾Ð³Ð¾ Ð¿Ð¾Ð²Ð¾Ð´ÐºÐ° (15 ÑˆÑ‚)',price:210,old:280,img:'https://catcherfish.ru/image/cache/catalog/gruzila_dlya_otvodnogo_povodka-300x300.jpg',stock:623,badge:'Ð¥Ð¸Ñ‚',bc:'or'},
  {id:3,cat:'lure',name:'Ð‘Ð»ÐµÑÐ½Ð° ÐºÐ¾Ð»ÐµÐ±Ð°Ð»ÐºÐ° Catcher 7Ð³ (5 ÑˆÑ‚)',price:320,old:450,img:'https://catcherfish.ru/image/cache/catalog/koleblyushiesya_blesny_Catcher-300x300.jpg',stock:312,badge:null},
  {id:4,cat:'fishing',name:'Ð¤ÑƒÑ€Ð½Ð¸Ñ‚ÑƒÑ€Ð°: Ð²ÐµÑ€Ñ‚Ð»ÑŽÐ³Ð¸ + ÐºÐ°Ñ€Ð°Ð±Ð¸Ð½Ñ‹ (50 ÑˆÑ‚)',price:140,old:190,img:'https://catcherfish.ru/image/cache/catalog/furnitura_Catcher-300x300.jpg',stock:1240,badge:null},
  {id:5,cat:'boat',name:'Ð›Ð¾Ð´ÐºÐ° Ð³Ñ€ÐµÐ±Ð½Ð°Ñ Ð›Ð“Ð-2 Ð´Ð²ÑƒÑ…Ð¼ÐµÑÑ‚Ð½Ð°Ñ',price:8900,old:12500,img:'https://catcherfish.ru/image/cache/catalog/grebnajalodka-300x300.jpg',stock:14,badge:'ÐœÐ°Ð»Ð¾',bc:'rd'},
  {id:6,cat:'gas',name:'Ð“Ð¾Ñ€ÐµÐ»ÐºÐ° Ð³Ð°Ð·Ð¾Ð²Ð°Ñ Ð¼Ð¸Ð½Ð¸ NS 509',price:280,old:520,img:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop',stock:490,badge:'Ð¡ÐºÐ»Ð°Ð´ Ð§Ð›Ð‘',bc:'bl'},
  {id:7,cat:'gas',name:'Ð“Ð¾Ñ€ÐµÐ»ÐºÐ° Ð³Ð°Ð·Ð¾Ð²Ð°Ñ NS 502',price:400,old:750,img:'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=300&h=300&fit=crop',stock:500,badge:'Ð¡ÐºÐ»Ð°Ð´ Ð§Ð›Ð‘',bc:'bl'},
  {id:8,cat:'gas',name:'ÐŸÐ»Ð¸Ñ‚ÐºÐ° Ð³Ð°Ð·Ð¾Ð²Ð°Ñ Ðœ-100 (Ð¾Ñ€Ð°Ð½Ð¶ÐµÐ²Ð°Ñ)',price:760,old:1400,img:'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=300&fit=crop',stock:298,badge:'Ð¡ÐºÐ»Ð°Ð´ Ð§Ð›Ð‘',bc:'bl'},
  {id:9,cat:'gas',name:'Ð“Ð¾Ñ€ÐµÐ»ÐºÐ° Ñ Ð´ÐµÑ€ÐµÐ². Ñ€ÑƒÑ‡ÐºÐ¾Ð¹ NS06',price:960,old:1700,img:'https://images.unsplash.com/photo-1510672981848-a1c4f1cb5ccf?w=300&h=300&fit=crop',stock:118,badge:'Ð¡ÐºÐ»Ð°Ð´ Ð§Ð›Ð‘',bc:'bl'},
  {id:10,cat:'gas',name:'Ð“Ð¾Ñ€ÐµÐ»ÐºÐ° Ð³Ð°Ð·Ð¾Ð²Ð°Ñ Ð¼Ð¸Ð½Ð¸ NS 100',price:280,old:480,img:'https://images.unsplash.com/photo-1561640289-53c6e11f4c83?w=300&h=300&fit=crop',stock:479,badge:'Ð¡ÐºÐ»Ð°Ð´ Ð§Ð›Ð‘',bc:'bl'},
  {id:11,cat:'tent',name:'ÐŸÐ°Ð»Ð°Ñ‚ÐºÐ° ÐºÐµÐ¼Ð¿Ð¸Ð½Ð³Ð¾Ð²Ð°Ñ Catcher 4P',price:8200,old:9800,img:'https://images.unsplash.com/photo-1423655156442-ccc11daa4e99?w=300&h=300&fit=crop',stock:38,badge:'ÐÐ¾Ð²Ð¸Ð½ÐºÐ°'},
  {id:12,cat:'tent',name:'Ð¢ÑƒÑ€Ð¸ÑÑ‚Ð¸Ñ‡ÐµÑÐºÐ°Ñ Ð¿Ð°Ð»Ð°Ñ‚ÐºÐ° Shelter Pro 2',price:4600,old:5600,img:'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=300&h=300&fit=crop&auto=format',stock:64,badge:'ÐÐ¾Ð²Ñ‹Ð¹'},
];
let P=[...LOCAL_P];

// â”€â”€ STATE â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
let cart=[],delCost=350,delMethod='Ð¡Ð”Ð­Ðš Ð´Ð¾ Ð´Ð²ÐµÑ€Ð¸',orderN=0,curCat='all',curSearch='',curSort='def';
// Pre-seeded data
let orders=[
  {id:'CF-0001',name:'ÐÐ½Ð°Ñ‚Ð¾Ð»Ð¸Ð¹ Ð¡.',phone:'+7 912 000-11-22',items:[{name:'Ð“Ð¾Ñ€ÐµÐ»ÐºÐ° NS 509',qty:10,price:280},{name:'ÐŸÐ»Ð¸Ñ‚ÐºÐ° Ðœ-100',qty:5,price:760}],sub:6600,del:0,total:6600,pay:'ÐŸÐ¾ ÑÑ‡Ñ‘Ñ‚Ñƒ (ÑŽÑ€Ð»Ð¸Ñ†Ð°Ð¼ / Ð˜ÐŸ)',status:'proc',date:'19.03 09:14',src:'Telegram'},
  {id:'CF-0002',name:'Ð˜Ð²Ð°Ð½ Ð Ñ‹Ð±Ð°ÐºÐ¾Ð²',phone:'+7 901 555-44-33',items:[{name:'Ð“Ñ€ÑƒÐ·Ð¸Ð»Ð° Ñ‡ÐµÐ±ÑƒÑ€Ð°ÑˆÐºÐ¸',qty:3,price:185}],sub:555,del:180,total:735,pay:'ÐšÐ°Ñ€Ñ‚Ð¾Ð¹ Ð¾Ð½Ð»Ð°Ð¹Ð½',status:'send',date:'18.03 16:42',src:'Ð’ÐºÐ»Ð°Ð´Ñ‹Ñˆ'},
  {id:'CF-0003',name:'ÐœÐ°Ñ€Ð¸Ð½Ð° Ðš.',phone:'+7 916 222-33-44',items:[{name:'Ð‘Ð»ÐµÑÐ½Ð° ÐºÐ¾Ð»ÐµÐ±Ð°Ð»ÐºÐ°',qty:2,price:320}],sub:640,del:350,total:990,pay:'ÐšÐ°Ñ€Ñ‚Ð¾Ð¹ Ð¾Ð½Ð»Ð°Ð¹Ð½',status:'done',date:'17.03 11:20',src:'SEO'},
];
let clients=[
  {name:'ÐÐ½Ð°Ñ‚Ð¾Ð»Ð¸Ð¹ Ð¡.',phone:'+7 912 000-11-22',orders:3,total:47800,last:'19.03',type:'whl'},
  {name:'Ð˜Ð²Ð°Ð½ Ð Ñ‹Ð±Ð°ÐºÐ¾Ð²',phone:'+7 901 555-44-33',orders:1,total:735,last:'18.03',type:'ret'},
  {name:'ÐœÐ°Ñ€Ð¸Ð½Ð° Ðš.',phone:'+7 916 222-33-44',orders:1,total:990,last:'17.03',type:'ret'},
];
let syncLog=[
  {time:'19.03 12:01',event:'ÐžÑÑ‚Ð°Ñ‚ÐºÐ¸ ÑÐ¸Ð½Ñ…Ñ€Ð¾Ð½Ð¸Ð·Ð¸Ñ€Ð¾Ð²Ð°Ð½Ñ‹',status:'ok'},
  {time:'19.03 11:31',event:'Ð¦ÐµÐ½Ñ‹ Ð¾Ð±Ð½Ð¾Ð²Ð»ÐµÐ½Ñ‹ (10 Ñ‚Ð¾Ð²Ð°Ñ€Ð¾Ð²)',status:'ok'},
  {time:'19.03 10:00',event:'Ð—Ð°ÐºÐ°Ð· CF-0001 Ð¿ÐµÑ€ÐµÐ´Ð°Ð½ Ð² ÑÐ¸ÑÑ‚ÐµÐ¼Ñƒ',status:'ok'},
  {time:'18.03 18:45',event:'ÐÐ¾Ð²Ñ‹Ð¹ ÐºÐ»Ð¸ÐµÐ½Ñ‚ Ð´Ð¾Ð±Ð°Ð²Ð»ÐµÐ½',status:'ok'},
];

const fmt=n=>n.toLocaleString('ru-RU')+' â‚½';
const escHtml=v=>String(v ?? '').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));

function inferCatFromProduct(p){
  const text=`${p.name||''} ${p.description||''} ${p.brand||''}`.toLowerCase();
  if (/(Ð³Ð¾Ñ€ÐµÐ»|Ð¿Ð»Ð¸Ñ‚Ðº|gas|ns 509|ns 502|ns100|ns06|m-100)/.test(text)) return 'gas';
  if (/(Ð¿Ð°Ð»Ð°Ñ‚|Ð¾Ð±Ð¾Ð³Ñ€ÐµÐ²|shelter|camp|Ñ‚ÑƒÑ€Ð¸ÑÑ‚)/.test(text)) return 'tent';
  if (/(Ð»Ð¾Ð´Ðº|boat)/.test(text)) return 'boat';
  if (/(Ð±Ð»ÐµÑÐ½|ÑÐ½Ð°ÑÑ‚|lure)/.test(text)) return 'lure';
  if (/(Ð³Ñ€ÑƒÐ·Ð¸Ð»|Ð²ÐµÑ€Ñ‚Ð»ÑŽÐ³|ÐºÐ°Ñ€Ð°Ð±Ð¸Ð½|Ð¾Ñ‚Ð²Ð¾Ð´Ð½|fishing)/.test(text)) return 'fishing';
  return 'fishing';
}

function resolvePhotoUrl(photos){
  if (!photos) return '';
  if (typeof photos === 'string') {
    const text = photos.trim();
    if (!text) return '';
    if ((text.startsWith('[') && text.endsWith(']')) || (text.startsWith('{') && text.endsWith('}'))) {
      try {
        return resolvePhotoUrl(JSON.parse(text));
      } catch (e) {
        return text;
      }
    }
    return text;
  }
  if (Array.isArray(photos)) {
    for (const photo of photos) {
      if (typeof photo === 'string' && photo) return photo;
      if (photo && typeof photo === 'object') {
        const candidate = photo.big || photo.c516x688 || photo.square || photo.tm || photo.url || photo.src;
        if (candidate) return candidate;
      }
    }
  }
  if (typeof photos === 'object') {
    return photos.big || photos.c516x688 || photos.square || photos.tm || photos.url || photos.src || '';
  }
  return '';
}

function localFallbackImageFor(product, idx){
  const byName = LOCAL_P.find(item => String(item.name || '').toLowerCase() === String(product?.name || '').toLowerCase());
  const byIndex = LOCAL_P[idx] || {};
  return (byName && byName.img) || byIndex.img || 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=300&h=300&fit=crop';
}

async function loadCatalogFromAPI() {
  try {
    const resp = await fetch(`${window.API_BASE}/products?limit=100`);
    const data = await resp.json();
    const items = (Array.isArray(data.items) ? data.items : [])
      .filter(p => Number(p.stock || p.quantity || 0) > 0)
      .slice(0, 60);
    if (!items.length) return;
    P = items.map((p, idx) => {
      const fallback = LOCAL_P.find(item => String(item.name || '').toLowerCase() === String(p.name || '').toLowerCase()) || LOCAL_P[idx] || {};
      const fallbackImg = localFallbackImageFor(p, idx);
      const stock = Number(p.stock || p.quantity || fallback.stock || 0);
      return {
        id: p.id ?? p.sku ?? p.wb_nm_id ?? fallback.id ?? idx + 1,
        sku: String(p.sku || p.wb_nm_id || fallback.sku || fallback.id || p.id || idx + 1),
        cat: p.category || 'construction',
        name: p.name || fallback.name || '',
        price: Number(p.price ?? fallback.price ?? 0),
        old: Number(p.price_old ?? p.price ?? fallback.old ?? fallback.price ?? 0),
        img: resolvePhotoUrl(p.photos) || fallback.img || 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=300&h=300&fit=crop',
        fallbackImg,
        stock,
        badge: fallback.badge ?? null,
        bc: fallback.bc || 'or'
      };
    });
    renderCatalog();
  } catch (e) {
    console.warn('API Ð½ÐµÐ´Ð¾ÑÑ‚ÑƒÐ¿ÐµÐ½, Ð¸ÑÐ¿Ð¾Ð»ÑŒÐ·ÑƒÐµÐ¼ Ð»Ð¾ÐºÐ°Ð»ÑŒÐ½Ñ‹Ðµ Ð´Ð°Ð½Ð½Ñ‹Ðµ');
    P = [...LOCAL_P];
  }
}

function normalizeAdminOrderFromAPI(order, idx){
  const items = Array.isArray(order?.items) ? order.items.map(item => ({
    name: item?.name || item?.title || 'Ð¢Ð¾Ð²Ð°Ñ€',
    qty: Number(item?.qty || item?.quantity || 1),
    price: Number(item?.price || 0),
    sku: String(item?.sku || item?.product_sku || item?.id || ''),
  })) : [];
  const deliveryCost = Number(order?.delivery_cost || order?.delivery?.cost || 0);
  const total = Number(order?.total || order?.total_amount || order?.amount || 0);
  return {
    id: String(order?.id || order?.order_id || idx + 1),
    name: String(order?.customer_name || order?.name || 'ÐšÐ»Ð¸ÐµÐ½Ñ‚'),
    phone: String(order?.customer_phone || order?.phone || ''),
    items,
    sub: Math.max(total - deliveryCost, 0),
    del: deliveryCost,
    total,
    pay: String(order?.payment_method || order?.pay || 'ÐÐµÑ‚'),
    status: String(order?.status || 'new').toLowerCase(),
    date: order?.created_at || order?.date || new Date().toISOString(),
    src: String(order?.marketplace || 'website'),
  };
}

function buildClientsFromOrders(sourceOrders){
  const map = new Map();
  for (const order of sourceOrders || []) {
    const phone = String(order?.phone || '').trim();
    const name = String(order?.name || 'ÐšÐ»Ð¸ÐµÐ½Ñ‚').trim();
    const key = phone || name.toLowerCase() || String(order?.id || '');
    if (!key) continue;
    const total = Number(order?.total || 0);
    const isWhl = total >= 10000 || /ООО|ИП|opt|whl/i.test(`${name} ${order?.comment || ''}`);
    const prev = map.get(key) || {
      name,
      phone,
      orders: 0,
      total: 0,
      last: '',
      type: isWhl ? 'whl' : 'ret',
    };
    prev.orders += 1;
    prev.total += total;
    prev.last = String(order?.date || order?.created_at || prev.last || '');
    prev.type = prev.type === 'whl' || isWhl ? 'whl' : 'ret';
    map.set(key, prev);
  }
  return Array.from(map.values());
}

async function loadAdminDataFromAPI(){
  try {
    const resp = await fetch(`${window.API_BASE}/orders?limit=200`);
    if (!resp.ok) throw new Error(`API ${resp.status}`);
    const data = await resp.json();
    const items = Array.isArray(data.items) ? data.items : [];
    if (!items.length) return;
    orders = items.map(normalizeAdminOrderFromAPI);
    clients = buildClientsFromOrders(orders);
  } catch (e) {
    console.warn('API заказов недоступен, используем локальные данные');
  }
}

const catalogSections=[
  {key:'construction',title:'ðŸ— Ð¡Ñ‚Ñ€Ð¾Ð¹ÐºÐ°',cats:['construction']},
  {key:'fish',title:'ðŸŽ£ Ð Ñ‹Ð±Ð°Ð»ÐºÐ°',cats:['fishing','lure']},
  {key:'tent',title:'â›º Ð¢ÑƒÑ€Ð¸Ð·Ð¼',cats:['tent']},
  {key:'gas',title:'â›½ Ð¡Ð½Ð°Ñ€ÑÐ¶ÐµÐ½Ð¸Ðµ',cats:['gas']},
  {key:'boat',title:'ðŸ§­ Ð¢Ñ€Ð°Ð½ÑÐ¿Ð¾Ñ€Ñ‚',cats:['boat']},
];
const catTitles={all:'Ð’ÑÐµ Ñ‚Ð¾Ð²Ð°Ñ€Ñ‹',construction:'Ð¡Ñ‚Ñ€Ð¾Ð¹ÐºÐ°',fishing:'Ð Ñ‹Ð±Ð°Ð»ÐºÐ°',lure:'ÐžÑÐ½Ð°ÑÑ‚ÐºÐ°',tent:'Ð¢ÑƒÑ€Ð¸Ð·Ð¼',gas:'Ð¡Ð½Ð°Ñ€ÑÐ¶ÐµÐ½Ð¸Ðµ',boat:'Ð¢Ñ€Ð°Ð½ÑÐ¿Ð¾Ñ€Ñ‚'};

// â”€â”€ PAGES â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function showPage(name){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.getElementById('page-'+name).classList.add('active');
  document.querySelectorAll('.mni').forEach(b=>b.classList.remove('act'));
  if(name==='catalog') document.getElementById('nav-cat')?.classList.add('act');
  if(name==='account' && safeParseBuyerProfile()) buyerRefreshAccount().catch(()=>{});
  if(name==='admin') renderAdmin('dashboard');
  window.scrollTo(0,0);
}
function setMobActive(el){document.querySelectorAll('.mob-nav-btn').forEach(b=>b.classList.remove('active'));el.classList.add('active');}

let lkTab='login';
function sanitizePhoneField(input){
  if(!input) return;
  const digits=String(input.value || '').replace(/\D/g,'').slice(0, 11);
  input.value = digits;
}
function setLKTab(tab){
  lkTab = tab === 'register' ? 'register' : 'login';
  const loginPane = document.getElementById('lk-login-pane');
  const registerPane = document.getElementById('lk-register-pane');
  const loginBtn = document.getElementById('lk-tab-login-btn');
  const registerBtn = document.getElementById('lk-tab-register-btn');
  if(loginPane) loginPane.classList.toggle('hidden', lkTab !== 'login');
  if(registerPane) registerPane.classList.toggle('hidden', lkTab !== 'register');
  if(loginBtn) loginBtn.classList.toggle('active', lkTab === 'login');
  if(registerBtn) registerBtn.classList.toggle('active', lkTab === 'register');
}
function toggleLKPanel(){
  const panel=document.getElementById('lk-panel');
  if(!panel) return;
  const willOpen = !panel.classList.contains('open');
  panel.classList.toggle('open');
  if(willOpen){
    setLKTab('login');
    const profile = safeParseBuyerProfile();
    if(profile){
      const regName = document.getElementById('lk-reg-name');
      const regPhone = document.getElementById('lk-reg-phone');
      const regEmail = document.getElementById('lk-reg-email');
      const loginIdentity = document.getElementById('lk-login-identity');
      if(regName && !regName.value) regName.value = profile.name || '';
      if(regPhone && !regPhone.value) regPhone.value = String(profile.phone || '').replace(/\D/g,'');
      if(regEmail && !regEmail.value) regEmail.value = profile.email || '';
      if(loginIdentity && !loginIdentity.value) loginIdentity.value = profile.email || profile.phone || '';
    }
  }
}
const BUYER_SESSION_KEY='cfBuyerProfile';
const GUEST_SESSION_KEY='cfGuestSessionToken';
function normalizeBuyerPhone(value){
  const digits=String(value||'').replace(/\D/g,'');
  if(!digits) return '';
  if(digits.length===10) return `+7${digits}`;
  if(digits.length===11 && digits.startsWith('8')) return `+7${digits.slice(1)}`;
  if(digits.length===11 && digits.startsWith('7')) return `+${digits}`;
  return digits.startsWith('+') ? digits : `+${digits}`;
}
function safeParseBuyerProfile(){
  try { return JSON.parse(localStorage.getItem(BUYER_SESSION_KEY)||'null'); } catch(e){ return null; }
}
function ensureGuestSessionToken(){
  let token = localStorage.getItem(GUEST_SESSION_KEY);
  if(!token){
    token = `gst_${Date.now().toString(36)}_${Math.random().toString(36).slice(2,8)}`;
    localStorage.setItem(GUEST_SESSION_KEY, token);
  }
  return token;
}
function saveBuyerProfile(profile){
  const payload = profile ? {
    name: profile.name || '',
    phone: profile.phone || '',
    email: profile.email || '',
    created_at: profile.created_at || '',
    orders_count: Number(profile.orders_count || 0),
  } : null;
  if(payload) localStorage.setItem(BUYER_SESSION_KEY, JSON.stringify(payload));
  else localStorage.removeItem(BUYER_SESSION_KEY);
  window.cfBuyerProfile = payload;
  return payload;
}
function buyerPhoneLabel(phone){
  const digits = String(phone||'').replace(/\D/g,'');
  if(digits.length===11 && digits.startsWith('7')) return `+7 (${digits.slice(1,4)}) ${digits.slice(4,7)}-${digits.slice(7,9)}-${digits.slice(9,11)}`;
  return String(phone||'');
}
function openAfterAuth(user, fallback = 'account'){
  const role = String(user?.role || '').toLowerCase();
  const isAdmin = Boolean(user?.is_admin) || role === 'admin';
  const isClient = !isAdmin && (role === 'customer' || role === 'client' || role === 'buyer' || role === '');
  if (isAdmin) {
    toggleLKPanel();
    showPage('admin');
    toast('Ð”Ð¾ÑÑ‚ÑƒÐ¿ Ð°Ð´Ð¼Ð¸Ð½Ð¸ÑÑ‚Ñ€Ð°Ñ‚Ð¾Ñ€Ð° Ð¿Ð¾Ð´Ñ‚Ð²ÐµÑ€Ð¶Ð´Ñ‘Ð½.');
    return 'admin';
  }
  if (isClient) {
    toggleLKPanel();
    showPage('account');
    return 'account';
  }
  toggleLKPanel();
  showPage(fallback);
  return fallback;
}
function buyerStatusLabel(status){
  const map={new:'ÐŸÑ€Ð¸Ð½ÑÑ‚',proc:'Ð¡Ð¾Ð±Ð¸Ñ€Ð°ÐµÑ‚ÑÑ',send:'ÐžÑ‚Ð¿Ñ€Ð°Ð²Ð»ÐµÐ½',done:'Ð”Ð¾ÑÑ‚Ð°Ð²Ð»ÐµÐ½',cancelled:'ÐžÑ‚Ð¼ÐµÐ½Ñ‘Ð½'};
  return map[String(status||'new').toLowerCase()] || String(status||'new');
}
function buyerOrderStage(status){
  const value=String(status||'new').toLowerCase();
  if(value==='done') return 100;
  if(value==='send') return 75;
  if(value==='proc') return 50;
  if(value==='new') return 20;
  if(value==='cancelled') return 0;
  return 10;
}
function buyerItemsLabel(items){
  if(!Array.isArray(items)) return 'â€”';
  return items.map(i=>`${i.name || 'Ð¢Ð¾Ð²Ð°Ñ€'} Ã—${i.qty || i.quantity || 1}`).join(', ');
}
function buyerRenderAccount(profile, rows){
  const accountPage = document.getElementById('page-account');
  const summary = document.getElementById('lk-profile-summary');
  const ordersBody = document.getElementById('lk-orders-body');
  if(!accountPage || !summary || !ordersBody) return;
  const safeProfile = profile || safeParseBuyerProfile();
  const safeRows = Array.isArray(rows) ? rows : [];
  const openCount = safeRows.filter(o => ['new','proc'].includes(String(o.status || '').toLowerCase())).length;
  const deliveryCount = safeRows.filter(o => ['send'].includes(String(o.status || '').toLowerCase())).length;
  document.getElementById('lk-orders-count').textContent = String(safeRows.length);
  document.getElementById('lk-open-count').textContent = String(openCount);
  document.getElementById('lk-delivery-count').textContent = String(deliveryCount);
  summary.innerHTML = safeProfile
    ? `<strong>${safeProfile.name || 'ÐŸÐ¾ÐºÑƒÐ¿Ð°Ñ‚ÐµÐ»ÑŒ'}</strong><br>${buyerPhoneLabel(safeProfile.phone)}<br>${safeProfile.email ? escHtml(safeProfile.email) + '<br>' : ''}Ð—Ð°ÐºÐ°Ð·Ð¾Ð²: ${safeRows.length}`
    : 'Ð’Ð¾Ð¹Ð´Ð¸Ñ‚Ðµ Ð¿Ð¾ Ñ‚ÐµÐ»ÐµÑ„Ð¾Ð½Ñƒ, email Ð¸Ð»Ð¸ Ð»Ð¾Ð³Ð¸Ð½Ñƒ admin Ñ Ð¿Ð°Ñ€Ð¾Ð»ÐµÐ¼, Ñ‡Ñ‚Ð¾Ð±Ñ‹ ÑƒÐ²Ð¸Ð´ÐµÑ‚ÑŒ Ð¸ÑÑ‚Ð¾Ñ€Ð¸ÑŽ Ð·Ð°ÐºÐ°Ð·Ð¾Ð² Ð¸ ÑÑ‚Ð°Ñ‚ÑƒÑ Ð´Ð¾ÑÑ‚Ð°Ð²ÐºÐ¸.';
  if(!safeRows.length){
    ordersBody.innerHTML = '<tr><td colspan="6" style="padding:28px;color:var(--muted);text-align:center">Ð—Ð°ÐºÐ°Ð·Ð¾Ð² Ð¿Ð¾ÐºÐ° Ð½ÐµÑ‚</td></tr>';
    return;
  }
  ordersBody.innerHTML = safeRows.map(order => {
    const stage = buyerOrderStage(order.status);
    return `<tr>
      <td class="mono">#${escHtml(order.id || order.order_id || 'â€”')}</td>
      <td style="font-size:12px;color:var(--muted);max-width:260px">${escHtml(buyerItemsLabel(order.items))}</td>
      <td class="bold" style="color:var(--orange2)">${fmt(Number(order.total || order.total_amount || 0))}</td>
      <td><span class="stbadge st-${escHtml(String(order.status || 'new').toLowerCase())}">${escHtml(buyerStatusLabel(order.status))}</span><div style="font-size:11px;color:var(--muted);margin-top:4px">Ð­Ñ‚Ð°Ð¿ ${stage}%</div></td>
      <td style="font-size:12px;color:var(--muted)">${escHtml(order.tracking_number || 'â€”')}</td>
      <td style="font-size:12px;color:var(--muted)">${escHtml(order.date || order.created_at || 'â€”')}</td>
    </tr>`;
  }).join('');
}
async function buyerRefreshAccount(){
  const profile = safeParseBuyerProfile();
  const phone = normalizeBuyerPhone(profile?.phone || '');
  const email = String(profile?.email || '').trim();
  if(!profile || (!phone && !email)){
    buyerRenderAccount(null, []);
    return;
  }
  try{
    const params = new URLSearchParams({limit:'50'});
    if(phone) params.set('phone', phone);
    if(email) params.set('email', email);
    const data = await fetch(`${window.API_BASE}/lk/orders?${params.toString()}`).then(r=>{
      if(!r.ok) throw new Error(`API ${r.status}`);
      return r.json();
    });
    buyerRenderAccount(profile, data.items || []);
  }catch(err){
    toast(`ÐÐµ ÑƒÐ´Ð°Ð»Ð¾ÑÑŒ Ð¾Ð±Ð½Ð¾Ð²Ð¸Ñ‚ÑŒ Ð›Ðš: ${err.message}`, false);
  }
}
function renderGuestOrderCard(order){
  if(!order) return '<div style="padding:24px;color:var(--muted);text-align:center">Ð—Ð°ÐºÐ°Ð· Ð½Ðµ Ð½Ð°Ð¹Ð´ÐµÐ½</div>';
  const items = Array.isArray(order.items) ? order.items : [];
  const delivery = order.delivery || {};
  return `<div class="ibox bl" style="margin-top:14px">
    <strong>Ð—Ð°ÐºÐ°Ð· #${escHtml(order.id || order.order_id || 'â€”')}</strong><br>
    Ð¡Ñ‚Ð°Ñ‚ÑƒÑ: <b>${escHtml(buyerStatusLabel(order.status))}</b><br>
    Ð¢Ñ€ÐµÐº: ${escHtml(order.tracking_number || order.tracking || 'â€”')}<br>
    ÐŸÐ¾Ð»ÑƒÑ‡Ð°Ñ‚ÐµÐ»ÑŒ: ${escHtml(order.customer_name || order.name || 'â€”')}<br>
    Ð¢ÐµÐ»ÐµÑ„Ð¾Ð½: ${escHtml(order.customer_phone || order.phone || 'â€”')}<br>
    Ð”Ð¾ÑÑ‚Ð°Ð²ÐºÐ°: ${escHtml(delivery.method || order.delivery_method || 'â€”')}<br>
    ÐÐ´Ñ€ÐµÑ: ${escHtml(delivery.address || order.delivery_address || 'â€”')}<br>
    Ð¡ÑƒÐ¼Ð¼Ð°: ${fmt(Number(order.total || order.total_amount || 0))}<br>
    Ð”Ð°Ñ‚Ð°: ${escHtml(order.date || order.created_at || 'â€”')}<br>
    Ð¢Ð¾Ð²Ð°Ñ€Ñ‹: ${escHtml(buyerItemsLabel(items))}
  </div>`;
}
async function guestTrackOrder(){
  const orderId = document.getElementById('track-order-id')?.value.trim() || '';
  const phone = document.getElementById('track-order-phone')?.value.trim() || '';
  const email = document.getElementById('track-order-email')?.value.trim() || '';
  if(!orderId){
    toast('Ð’Ð²ÐµÐ´Ð¸Ñ‚Ðµ Ð½Ð¾Ð¼ÐµÑ€ Ð·Ð°ÐºÐ°Ð·Ð°', false);
    return;
  }
  if(!phone && !email){
    toast('Ð’Ð²ÐµÐ´Ð¸Ñ‚Ðµ Ñ‚ÐµÐ»ÐµÑ„Ð¾Ð½ Ð¸Ð»Ð¸ email', false);
    return;
  }
  const params = new URLSearchParams({order_id: orderId});
  if(phone) params.set('phone', phone);
  if(email) params.set('email', email);
  try{
    const resp = await fetch(`${window.API_BASE}/track/order?${params.toString()}`);
    if(!resp.ok) throw new Error(`API ${resp.status}`);
    const data = await resp.json();
    document.getElementById('lk-profile-summary').innerHTML = `Ð“Ð¾ÑÑ‚ÐµÐ²Ð¾Ð¹ Ñ‚Ñ€ÐµÐºÐµÑ€: Ð·Ð°ÐºÐ°Ð· Ð½Ð°Ð¹Ð´ÐµÐ½`;
    document.getElementById('lk-orders-count').textContent = '1';
    document.getElementById('lk-open-count').textContent = ['new','proc'].includes(String(data.status || '').toLowerCase()) ? '1' : '0';
    document.getElementById('lk-delivery-count').textContent = String(String(data.status || '').toLowerCase() === 'send' ? 1 : 0);
    document.getElementById('lk-orders-body').innerHTML = `<tr><td colspan="6">${renderGuestOrderCard(data)}</td></tr>`;
    showPage('account');
  }catch(err){
    toast(`ÐÐµ ÑƒÐ´Ð°Ð»Ð¾ÑÑŒ Ð½Ð°Ð¹Ñ‚Ð¸ Ð·Ð°ÐºÐ°Ð·: ${err.message}`, false);
  }
}
async function buyerLoginOrRegister(mode='login'){
  const isRegister = mode === 'register' || lkTab === 'register';
  const name = document.getElementById('lk-reg-name')?.value.trim() || '';
  const regPhoneDigits = document.getElementById('lk-reg-phone')?.value.trim() || '';
  const regEmail = document.getElementById('lk-reg-email')?.value.trim() || '';
  const regPassword = document.getElementById('lk-reg-password')?.value || '';
  const loginIdentity = document.getElementById('lk-login-identity')?.value.trim() || '';
  const loginPassword = document.getElementById('lk-login-password')?.value || '';
  if(isRegister && !name){
    toast('Ð’Ð²ÐµÐ´Ð¸Ñ‚Ðµ Ð¸Ð¼Ñ Ð´Ð»Ñ Ñ€ÐµÐ³Ð¸ÑÑ‚Ñ€Ð°Ñ†Ð¸Ð¸', false);
    return;
  }
  if(isRegister && (!regPhoneDigits || !regEmail || !regPassword)){
    toast('Ð’Ð²ÐµÐ´Ð¸Ñ‚Ðµ email, Ñ‚ÐµÐ»ÐµÑ„Ð¾Ð½ Ð¸ Ð¿Ð°Ñ€Ð¾Ð»ÑŒ Ð´Ð»Ñ Ñ€ÐµÐ³Ð¸ÑÑ‚Ñ€Ð°Ñ†Ð¸Ð¸', false);
    return;
  }
  if(isRegister && regPassword.length < 4){
    toast('ÐŸÐ°Ñ€Ð¾Ð»ÑŒ Ð´Ð¾Ð»Ð¶ÐµÐ½ Ð±Ñ‹Ñ‚ÑŒ Ð½Ðµ ÐºÐ¾Ñ€Ð¾Ñ‡Ðµ 4 ÑÐ¸Ð¼Ð²Ð¾Ð»Ð¾Ð²', false);
    return;
  }
  if(!isRegister && (!loginIdentity || !loginPassword)){
    toast('Ð’Ð²ÐµÐ´Ð¸Ñ‚Ðµ Ð»Ð¾Ð³Ð¸Ð½ Ð¸ Ð¿Ð°Ñ€Ð¾Ð»ÑŒ', false);
    return;
  }
  const payload = isRegister
    ? {name, phone: normalizeBuyerPhone(regPhoneDigits), email: regEmail, password: regPassword}
    : {identity: loginIdentity, password: loginPassword};
  const endpoint = isRegister ? '/lk/register' : '/lk/login';
  try{
    const resp = await fetch(`${window.API_BASE}${endpoint}`, {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify(payload),
    });
    if(!resp.ok){
      if(mode==='login' && resp.status === 404){
        toast('ÐŸÐ¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ñ‚ÐµÐ»ÑŒ Ð½Ðµ Ð½Ð°Ð¹Ð´ÐµÐ½. Ð—Ð°Ñ€ÐµÐ³Ð¸ÑÑ‚Ñ€Ð¸Ñ€ÑƒÐ¹Ñ‚ÐµÑÑŒ.', false);
        return;
      }
      if(mode==='login' && resp.status === 401){
        toast('ÐÐµÐ²ÐµÑ€Ð½Ñ‹Ð¹ Ð¿Ð°Ñ€Ð¾Ð»ÑŒ', false);
        return;
      }
      throw new Error(`API ${resp.status}`);
    }
    const data = await resp.json();
    const route = openAfterAuth(data.user, 'account');
    if (route !== 'admin') {
      const user = saveBuyerProfile({
        name: data.user?.name || name || 'ÐŸÐ¾ÐºÑƒÐ¿Ð°Ñ‚ÐµÐ»ÑŒ',
        phone: data.user?.phone || normalizeBuyerPhone(regPhoneDigits),
        email: data.user?.email || regEmail || loginIdentity,
        created_at: data.user?.created_at || '',
        orders_count: data.orders_count || 0,
      });
      await buyerRefreshAccount();
      toast(isRegister ? 'ÐšÐ°Ð±Ð¸Ð½ÐµÑ‚ ÑÐ¾Ð·Ð´Ð°Ð½' : 'Ð’Ñ…Ð¾Ð´ Ð²Ñ‹Ð¿Ð¾Ð»Ð½ÐµÐ½');
      return user;
    }
    return data.user;
  }catch(err){
    toast(`ÐÐµ ÑƒÐ´Ð°Ð»Ð¾ÑÑŒ Ð²Ð¾Ð¹Ñ‚Ð¸ Ð² ÐºÐ°Ð±Ð¸Ð½ÐµÑ‚: ${err.message}`, false);
  }
}
function submitLK(){
  buyerLoginOrRegister('login');
}
function registerLK(){
  setLKTab('register');
  buyerLoginOrRegister('register');
}
document.addEventListener('click',e=>{
  const panel=document.getElementById('lk-panel');
  if(!panel||!panel.classList.contains('open')) return;
  if(panel.contains(e.target) || e.target.closest('.hadmin') || e.target.closest('.mni-admin') || e.target.closest('.mob-nav-btn')) return;
  panel.classList.remove('open');
});

// â”€â”€ CATALOG â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function filterCat(cat){
  curCat=cat;
  const lbl=catTitles[cat]||'Ð’ÑÐµ Ñ‚Ð¾Ð²Ð°Ñ€Ñ‹';
  document.getElementById('ct').textContent=lbl;
  document.getElementById('bc').textContent=lbl;
  renderCatalog();
}
function doSearch(v){curSearch=v;renderCatalog();}
function doSort(v){curSort=v;renderCatalog();}
function renderCatalog(){
  const container=document.getElementById('catalog-sections');
  if(!container) return;
  const q=curSearch.trim().toLowerCase();
  const sections=catalogSections.map(section=>{
    if(curCat!=='all' && !section.cats.includes(curCat)) return '';
    const items=P.filter(p=>section.cats.includes(p.cat) && (!q || p.name.toLowerCase().includes(q)));
    if(!items.length) return '';
    const sorted=sortProducts(items);
    return `<div class="sec-t"><h2>${section.title}</h2></div>${buildGridMarkup(sorted)}`;
  }).filter(Boolean);
  container.innerHTML=sections.length ? sections.join('') : '<div class="pgrid"><div style="grid-column:1/-1;padding:20px;color:var(--muted);text-align:center">ÐÐµÑ‚ Ñ‚Ð¾Ð²Ð°Ñ€Ð¾Ð²</div></div>';
}
function sortProducts(list){
  const arr=list.slice();
  if(curSort==='asc') arr.sort((a,b)=>a.price-b.price);
  else if(curSort==='desc') arr.sort((a,b)=>b.price-a.price);
  else if(curSort==='name') arr.sort((a,b)=>a.name.localeCompare(b.name,'ru'));
  return arr;
}
function buildGridMarkup(items){
  if(!items.length) return '<div class="pgrid"><div style="grid-column:1/-1;padding:20px;color:var(--muted);text-align:center">ÐÐµÑ‚ Ñ‚Ð¾Ð²Ð°Ñ€Ð¾Ð²</div></div>';
  return `<div class="pgrid">${items.map(buildProductCard).join('')}</div>`;
}
function buildProductCard(p){
  const ic=cart.find(c=>c.id===p.id);
  const disc=Math.round((1-p.price/p.old)*100);
  const stk=p.stock<20?`<div class="pstk-lo">âš  ÐžÑÑ‚Ð°Ð»Ð¾ÑÑŒ ${p.stock} ÑˆÑ‚</div>`:`<div class="pstk-ok">âœ“ Ð’ Ð½Ð°Ð»Ð¸Ñ‡Ð¸Ð¸: ${p.stock} ÑˆÑ‚</div>`;
  const fallbackImg = p.fallbackImg || localFallbackImageFor(p, 0);
  return `<div class="pcard">
      ${p.badge?`<div class="pbadge ${p.bc||'or'}">${p.badge}</div>`:''}
      <div class="pimg"><img src="${p.img}" alt="${p.name}" loading="lazy" data-fallback="${fallbackImg}" onerror="if(this.dataset.fallback && this.src!==this.dataset.fallback){this.onerror=()=>{this.style.display='none'};this.src=this.dataset.fallback}else{this.style.display='none'}"></div>
      <div class="pi">
        <div class="pn">${p.name}</div>
        <div class="pp-row"><span class="pp">${fmt(p.price)}</span><span class="pold">${fmt(p.old)}</span><span class="pdisc">âˆ’${disc}%</span></div>
        ${stk}
        <div class="pa">
          <button class="btn-buy${ic?' ic':''}" id="bb-${p.id}" onclick='addCart(${JSON.stringify(String(p.id))})'>${ic?'âœ“ Ð’ ÐºÐ¾Ñ€Ð·Ð¸Ð½Ðµ':'ðŸ›’ Ð’ ÐºÐ¾Ñ€Ð·Ð¸Ð½Ñƒ'}</button>
          <button class="btn-fav">â™¡</button>
        </div>
      </div>
    </div>`;
}

// â”€â”€ CART â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function addCart(id){
  const pid=String(id);
  const p=P.find(x=>String(x.id)===pid);
  if(!p){
    toast('Ð¢Ð¾Ð²Ð°Ñ€ Ð½Ðµ Ð½Ð°Ð¹Ð´ÐµÐ½');
    return;
  }
  const ex=cart.find(c=>String(c.id)===pid);
  if(ex) ex.qty++; else cart.push({...p,qty:1});
  updCart(); toast(`${p.name.slice(0,26)}â€¦ â†’ ÐºÐ¾Ñ€Ð·Ð¸Ð½Ð°`); renderCatalog();
}
function updCart(){
  const cnt=cart.reduce((s,c)=>s+c.qty,0), sum=cart.reduce((s,c)=>s+c.price*c.qty,0);
  document.getElementById('hcs').textContent=fmt(sum);
  ['nc','mnc'].forEach(id=>{const el=document.getElementById(id);if(el)el.textContent=cnt;});
  const bel=document.getElementById('b-orders');if(bel)bel.textContent=orders.length;
}
function openCart(){document.getElementById('cart-ov').classList.add('open');renderCart();}
function closeCart(){document.getElementById('cart-ov').classList.remove('open');}
function covClick(e){if(e.target===document.getElementById('cart-ov'))closeCart();}
function renderCart(){
  const body=document.getElementById('cpb'), foot=document.getElementById('cpf');
  if(!cart.length){
    body.innerHTML='<div class="cp-empty"><div style="font-size:48px;opacity:.2;margin-bottom:12px">ðŸ›’</div><p>ÐšÐ¾Ñ€Ð·Ð¸Ð½Ð° Ð¿ÑƒÑÑ‚Ð°</p></div>';
    foot.innerHTML='<div style="padding:14px 18px"><button class="btn-cont" onclick="closeCart()">ÐŸÐµÑ€ÐµÐ¹Ñ‚Ð¸ Ð² ÐºÐ°Ñ‚Ð°Ð»Ð¾Ð³</button></div>';return;
  }
  const sub=cart.reduce((s,c)=>s+c.price*c.qty,0);
  body.innerHTML=cart.map(c=>`<div class="ci">
    <img class="ci-img" src="${c.img}" data-fallback="${c.fallbackImg || c.img || ''}" onerror="if(this.dataset.fallback && this.src!==this.dataset.fallback){this.onerror=()=>{this.style.display='none'};this.src=this.dataset.fallback}else{this.style.display='none'}">
    <div class="ci-inf">
      <div class="ci-n">${c.name}</div>
      <div class="ci-qr"><button class="cqb" onclick="chQ(${c.id},-1)">âˆ’</button><span style="min-width:20px;text-align:center;font-weight:700">${c.qty}</span><button class="cqb" onclick="chQ(${c.id},1)">+</button><span class="ci-u">${fmt(c.price)}/ÑˆÑ‚</span></div>
      <button class="ci-d" onclick="remCart(${c.id})">âœ• Ð£Ð´Ð°Ð»Ð¸Ñ‚ÑŒ</button>
    </div>
    <div class="ci-tot">${fmt(c.price*c.qty)}</div>
  </div>`).join('');
  foot.innerHTML=`<div class="cp-f">
    <div class="cf-r"><span>Ð¢Ð¾Ð²Ð°Ñ€Ñ‹ (${cart.reduce((s,c)=>s+c.qty,0)} ÑˆÑ‚)</span><span>${fmt(sub)}</span></div>
    <div class="cf-tot"><span>Ð˜Ñ‚Ð¾Ð³Ð¾</span><span>${fmt(sub)}</span></div>
    <button class="btn-co" onclick="openOrder()">ÐžÑ„Ð¾Ñ€Ð¼Ð¸Ñ‚ÑŒ Ð·Ð°ÐºÐ°Ð· â†’</button>
    <button class="btn-cont" onclick="closeCart()">ÐŸÑ€Ð¾Ð´Ð¾Ð»Ð¶Ð¸Ñ‚ÑŒ Ð¿Ð¾ÐºÑƒÐ¿ÐºÐ¸</button>
  </div>`;
}
function chQ(id,d){const i=cart.find(c=>c.id===id);if(!i)return;i.qty+=d;if(i.qty<=0)cart=cart.filter(c=>c.id!==id);updCart();renderCart();renderCatalog();}
function remCart(id){cart=cart.filter(c=>c.id!==id);updCart();renderCart();renderCatalog();}

// â”€â”€ ORDER â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function openOrder(){
  closeCart();
  const profile = safeParseBuyerProfile();
  if(profile){
    const fn = document.getElementById('fn');
    const fph = document.getElementById('fph');
    const fem = document.getElementById('fem');
    if(fn && !fn.value) fn.value = profile.name || '';
    if(fph && !fph.value) fph.value = profile.phone || '';
    if(fem && !fem.value && profile.email) fem.value = profile.email;
  }
  updOrds();
  document.getElementById('mod-ov').classList.add('open');
}
function closeMod(){document.getElementById('mod-ov').classList.remove('open');}
function movClick(e){if(e.target===document.getElementById('mod-ov'))closeMod();}
function selD(el,cost){
  document.querySelectorAll('.dopt').forEach(o=>o.classList.remove('sel'));
  el.classList.add('sel');
  delCost=cost;
  delMethod=(el.textContent || 'Ð”Ð¾ÑÑ‚Ð°Ð²ÐºÐ°').replace(/\s+\d+\s*â‚½/g,'').replace(/\s+/g,' ').trim();
  updOrds();
}
function updOrds(){
  const sub=cart.reduce((s,c)=>s+c.price*c.qty,0);
  document.getElementById('ords').innerHTML=`<div class="ord-s">
    <div class="os-r"><span>Ð¢Ð¾Ð²Ð°Ñ€Ñ‹</span><span>${fmt(sub)}</span></div>
    <div class="os-r"><span>Ð”Ð¾ÑÑ‚Ð°Ð²ÐºÐ°</span><span>${delCost?fmt(delCost):'Ð‘ÐµÑÐ¿Ð»Ð°Ñ‚Ð½Ð¾'}</span></div>
    <div class="os-tot"><span>Ðš Ð¾Ð¿Ð»Ð°Ñ‚Ðµ</span><span>${fmt(sub+delCost)}</span></div>
  </div>`;
}
async function placeOrder(){
  const n=document.getElementById('fn').value.trim(), ph=document.getElementById('fph').value.trim();
  if(!n||!ph){toast('Ð’Ð²ÐµÐ´Ð¸Ñ‚Ðµ Ð¸Ð¼Ñ Ð¸ Ñ‚ÐµÐ»ÐµÑ„Ð¾Ð½',false);return;}
  if(!cart.length){toast('ÐšÐ¾Ñ€Ð·Ð¸Ð½Ð° Ð¿ÑƒÑÑ‚Ð°',false);return;}
  const sub=cart.reduce((s,c)=>s+c.price*c.qty,0);
  const pay = document.getElementById('fpay').value;
  const email = document.getElementById('fem').value.trim();
  const address = document.getElementById('fadr').value.trim();
  const comment = document.getElementById('fcmt').value.trim();
  const registerAfter = document.getElementById('freg')?.checked || false;
  const orderDate = new Date().toLocaleString('ru-RU',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'});
  const payload = {
    order_id: `CF-${Date.now().toString(36).toUpperCase()}`,
    marketplace: 'website',
    status: 'new',
    total_amount: sub + delCost,
    customer_name: n,
    customer_phone: ph,
    customer_email: email,
    payment_method: pay,
    payment_status: 'pending',
    delivery_cost: delCost,
    items: cart.map(c => ({
      sku: String(c.sku || c.id || ''),
      name: c.name,
      qty: c.qty,
      price: c.price,
    })),
    delivery_method: delMethod,
    delivery_address: address,
    comment,
    is_guest: true,
    registered_after_order: registerAfter,
    guest_session_token: ensureGuestSessionToken(),
  };

  const resp = await fetch(`${window.API_BASE}/api/guest-order`, {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify(payload),
  });
  if (!resp.ok) {
    const details = await resp.text().catch(()=> '');
    throw new Error(`API ${resp.status}${details ? `: ${details}` : ''}`);
  }
  const saved = await resp.json();
  const num = String(saved?.order_id || payload.order_id);
  const order = {
    id: num,
    name: n,
    phone: ph,
    items: cart.map(c=>({name:c.name, qty:c.qty, price:c.price, sku:String(c.sku || c.id || '')})),
    sub,
    del: delCost,
    total: sub + delCost,
    pay,
    status: saved?.status || 'new',
    date: saved?.created_at ? new Date(saved.created_at).toLocaleString('ru-RU',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'}) : orderDate,
    src: 'ÐŸÑ€ÑÐ¼Ð¾Ð¹',
  };

  if(registerAfter){
    saveBuyerProfile({
      name: n,
      phone: normalizeBuyerPhone(ph),
      email,
      created_at: new Date().toISOString(),
      orders_count: 1,
    });
  }

  orders.unshift(order);
  cart.forEach(c=>{
    const p=P.find(x=>String(x.id)===String(c.id) || String(x.sku||'')===String(c.sku||''));
    if(p)p.stock=Math.max(0,Number(p.stock||0)-Number(c.qty||0));
  });
  const exc=clients.find(c=>c.phone===ph);
  if(exc){exc.orders++;exc.total+=order.total;exc.last=order.date;}
  else clients.push({name:n,phone:ph,orders:1,total:order.total,last:order.date,type:'ret'});
  const existingBuyer = safeParseBuyerProfile();
  saveBuyerProfile({
    name: n,
    phone: normalizeBuyerPhone(ph),
    email,
    created_at: existingBuyer?.created_at || new Date().toISOString(),
    orders_count: Number(existingBuyer?.orders_count || 0) + 1,
  });
  syncLog.unshift({time:order.date,event:`Ð—Ð°ÐºÐ°Ð· ${num} ÑÐ¾Ð·Ð´Ð°Ð½ Ð¸ Ð¿ÐµÑ€ÐµÐ´Ð°Ð½ Ð² ÑÐ¸ÑÑ‚ÐµÐ¼Ñƒ`,status:'ok'});
  cart=[];updCart();renderCatalog();
  loadCatalogFromAPI().catch(()=>{});
  loadAdminDataFromAPI().catch(()=>{});
  buyerRefreshAccount().catch(()=>{});
  closeMod();
  document.getElementById('snum').textContent='#'+num;
  document.getElementById('succ-ov').classList.add('open');
  const postOrderHint = document.getElementById('succ-hint');
  if(postOrderHint){
    postOrderHint.textContent = registerAfter
      ? 'ÐšÐ°Ð±Ð¸Ð½ÐµÑ‚ ÑÐ¾Ð·Ð´Ð°Ð½. ÐžÑ‚ÐºÑ€Ð¾Ð¹Ñ‚Ðµ "Ð›Ð¸Ñ‡Ð½Ñ‹Ð¹ ÐºÐ°Ð±Ð¸Ð½ÐµÑ‚", Ñ‡Ñ‚Ð¾Ð±Ñ‹ ÑÐ¼Ð¾Ñ‚Ñ€ÐµÑ‚ÑŒ Ð¸ÑÑ‚Ð¾Ñ€Ð¸ÑŽ Ð¸ ÑÑ‚Ð°Ñ‚ÑƒÑ.'
      : 'ÐœÐ¾Ð¶ÐµÑ‚Ðµ Ð¾Ñ‚ÑÐ»ÐµÐ¶Ð¸Ð²Ð°Ñ‚ÑŒ Ð·Ð°ÐºÐ°Ð· Ð¿Ð¾ Ð½Ð¾Ð¼ÐµÑ€Ñƒ, Ñ‚ÐµÐ»ÐµÑ„Ð¾Ð½Ñƒ Ð¸Ð»Ð¸ ÑÐ¾Ð·Ð´Ð°Ñ‚ÑŒ ÐºÐ°Ð±Ð¸Ð½ÐµÑ‚ Ð¿Ð¾Ð·Ð¶Ðµ.';
  }
  const bel=document.getElementById('b-new');if(bel){const newc=orders.filter(o=>o.status==='new').length;bel.textContent=newc||'';bel.style.display=newc?'':'none';}
}

// â”€â”€ CONTACT FORM â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function sendCF(){
  if(!document.getElementById('cfn').value.trim()||!document.getElementById('cfc').value.trim()){toast('Ð—Ð°Ð¿Ð¾Ð»Ð½Ð¸Ñ‚Ðµ Ð¸Ð¼Ñ Ð¸ ÐºÐ¾Ð½Ñ‚Ð°ÐºÑ‚',false);return;}
  toast('Ð¡Ð¾Ð¾Ð±Ñ‰ÐµÐ½Ð¸Ðµ Ð¾Ñ‚Ð¿Ñ€Ð°Ð²Ð»ÐµÐ½Ð¾! ÐžÑ‚Ð²ÐµÑ‚Ð¸Ð¼ Ð² Ñ‚ÐµÑ‡ÐµÐ½Ð¸Ðµ 2 Ñ‡Ð°ÑÐ¾Ð².');
  ['cfn','cfc','cfm'].forEach(id=>document.getElementById(id).value='');
}
window.CF = sendCF;

// â”€â”€ TOAST â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function toast(msg,ok=true){
  const t=document.createElement('div');t.className='toast'+(ok?' ok':' er');t.textContent=msg;
  document.body.appendChild(t);setTimeout(()=>t.remove(),2700);
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
// ADMIN PANEL RENDERER
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
let admCur='dashboard';
async function admTab(tab,el){
  admCur=tab;
  document.querySelectorAll('.adm-nav a').forEach(a=>a.classList.remove('act'));
  if(el) el.classList.add('act');
  if(['dashboard','orders','clients','analytics'].includes(tab)){
    await loadAdminDataFromAPI().catch(()=>{});
  }
  renderAdmin(tab);
}
function renderAdmin(tab){
  admCur=tab||admCur;
  const el=document.getElementById('adm-content');
  const totalRev=orders.reduce((s,o)=>s+o.total,0);
  const totalOrds=orders.length;
  const newOrds=orders.filter(o=>o.status==='new').length;

  if(admCur==='dashboard'){
    const gasRev=orders.reduce((s,o)=>s+o.items.filter(i=>i.name.includes('Ð³Ð¾Ñ€ÐµÐ»')||i.name.includes('Ð¿Ð»Ð¸Ñ‚Ðº')||i.name.includes('Ð“Ð¾Ñ€ÐµÐ»')||i.name.includes('ÐŸÐ»Ð¸Ñ‚Ðº')).reduce((ss,i)=>ss+i.price*i.qty,0),0);
    el.innerHTML=`<h2>ðŸ“Š Ð”Ð°ÑˆÐ±Ð¾Ñ€Ð´ <span class="sub">catcherfish.ru Â· ÐœÐ°Ñ€Ñ‚ 2026</span></h2>
    <div class="metrics">
      <div class="metric"><div class="mv" style="color:var(--orange2)">${fmt(totalRev)}</div><div class="ml">Ð’Ñ‹Ñ€ÑƒÑ‡ÐºÐ° (Ð²ÑÐµ Ð·Ð°ÐºÐ°Ð·Ñ‹)</div><div class="md up">â†‘ +${totalOrds} Ð·Ð°ÐºÐ°Ð·Ð¾Ð²</div></div>
      <div class="metric"><div class="mv">${totalOrds}</div><div class="ml">Ð—Ð°ÐºÐ°Ð·Ð¾Ð² Ð²ÑÐµÐ³Ð¾</div><div class="md ${newOrds?'up':'nu'}">${newOrds} Ð½Ð¾Ð²Ñ‹Ñ…</div></div>
      <div class="metric"><div class="mv">${totalOrds?fmt(Math.round(totalRev/totalOrds)):0}</div><div class="ml">Ð¡Ñ€ÐµÐ´Ð½Ð¸Ð¹ Ñ‡ÐµÐº</div><div class="md nu">ÐžÐ¿ÐµÑ€Ð°Ñ†Ð¸Ð¾Ð½Ð½Ð°Ñ Ð¼ÐµÑ‚Ñ€Ð¸ÐºÐ°</div></div>
      <div class="metric"><div class="mv">${clients.length}</div><div class="ml">ÐšÐ»Ð¸ÐµÐ½Ñ‚Ð¾Ð² Ð² Ð±Ð°Ð·Ðµ</div><div class="md up">â†‘ +${clients.filter(c=>c.type==='whl').length} Ð¾Ð¿Ñ‚Ð¾Ð²Ñ‹Ñ…</div></div>
    </div>
    <div class="chart-area"><h3>ðŸ“ˆ Ð’Ñ‹Ñ€ÑƒÑ‡ÐºÐ° Ð¿Ð¾ ÐºÐ°Ð½Ð°Ð»Ð°Ð¼ (ÑÐ¸Ð¼ÑƒÐ»ÑÑ†Ð¸Ñ)</h3>
      <div class="channel-row">
        <div class="ch-pill"><div class="ch-name">ðŸŽ£ Telegram</div><div class="ch-val">${fmt(Math.round(totalRev*.40))}</div><div class="ch-sub">40% Â· ÐºÐ¾Ð½Ð². 3.2%</div></div>
        <div class="ch-pill"><div class="ch-name">ðŸ“¦ Ð’ÐºÐ»Ð°Ð´Ñ‹ÑˆÐ¸</div><div class="ch-val">${fmt(Math.round(totalRev*.30))}</div><div class="ch-sub">30% Â· ÐºÐ¾Ð½Ð². 2.8%</div></div>
        <div class="ch-pill"><div class="ch-name">ðŸ” SEO</div><div class="ch-val">${fmt(Math.round(totalRev*.20))}</div><div class="ch-sub">20% Â· ÐºÐ¾Ð½Ð². 1.9%</div></div>
        <div class="ch-pill"><div class="ch-name">ðŸ“¢ Click-out</div><div class="ch-val">${fmt(Math.round(totalRev*.10))}</div><div class="ch-sub">10% Â· ÐºÐ¾Ð½Ð². 1.1%</div></div>
      </div>
    </div>
    <div class="adm-table-wrap"><div class="adm-table-head"><h3>ÐŸÐ¾ÑÐ»ÐµÐ´Ð½Ð¸Ðµ Ð·Ð°ÐºÐ°Ð·Ñ‹</h3><button class="adm-btn sm" onclick="admTab('orders',null)">Ð’ÑÐµ Ð·Ð°ÐºÐ°Ð·Ñ‹ â†’</button></div>
    <table class="adm-tbl"><thead><tr><th>â„–</th><th>ÐšÐ»Ð¸ÐµÐ½Ñ‚</th><th>Ð¡ÑƒÐ¼Ð¼Ð°</th><th>Ð¡Ñ‚Ð°Ñ‚ÑƒÑ</th><th>ÐšÐ°Ð½Ð°Ð»</th><th>Ð”Ð°Ñ‚Ð°</th></tr></thead><tbody>
    ${orders.slice(0,5).map(o=>`<tr>
      <td class="mono">#${o.id}</td>
      <td><div class="bold">${o.name}</div><div style="font-size:11px;color:var(--muted)">${o.phone}</div></td>
      <td class="bold" style="color:var(--orange2)">${fmt(o.total)}</td>
      <td><span class="stbadge st-${o.status}">${{new:'ÐÐ¾Ð²Ñ‹Ð¹',proc:'Ð’ Ñ€Ð°Ð±Ð¾Ñ‚Ðµ',send:'ÐžÑ‚Ð¿Ñ€Ð°Ð²Ð»ÐµÐ½',done:'Ð’Ñ‹Ð¿Ð¾Ð»Ð½ÐµÐ½'}[o.status]}</span></td>
      <td style="font-size:12px;color:var(--muted)">${o.src||'â€”'}</td>
      <td style="font-size:12px;color:var(--muted)">${o.date}</td>
    </tr>`).join('')}
    </tbody></table></div>`;
  }

  else if(admCur==='orders'){
    el.innerHTML=`<h2>ðŸ“‹ Ð—Ð°ÐºÐ°Ð·Ñ‹</h2>
    <div style="display:flex;gap:8px;margin-bottom:14px;flex-wrap:wrap">
      <button class="adm-btn" onclick="toast('Ð­ÐºÑÐ¿Ð¾Ñ€Ñ‚ Ð² Excel Ð·Ð°Ð¿ÑƒÑ‰ÐµÐ½')">â¬‡ Ð­ÐºÑÐ¿Ð¾Ñ€Ñ‚ Excel</button>
      <button class="adm-btn" onclick="toast('Ð”Ð°Ð½Ð½Ñ‹Ðµ Ð¾Ð±Ð½Ð¾Ð²Ð»ÐµÐ½Ñ‹')">ðŸ”„ ÐžÐ±Ð½Ð¾Ð²Ð¸Ñ‚ÑŒ</button>
    </div>
    ${!orders.length?'<div style="padding:40px;text-align:center;color:var(--muted)">Ð—Ð°ÐºÐ°Ð·Ð¾Ð² Ð¿Ð¾ÐºÐ° Ð½ÐµÑ‚ â€” Ð¾Ñ„Ð¾Ñ€Ð¼Ð¸Ñ‚Ðµ Ð¿ÐµÑ€Ð²Ñ‹Ð¹ Ð² ÐºÐ°Ñ‚Ð°Ð»Ð¾Ð³Ðµ</div>':
    `<div class="adm-table-wrap"><table class="adm-tbl"><thead><tr><th>â„–</th><th>ÐšÐ»Ð¸ÐµÐ½Ñ‚</th><th>Ð¢Ð¾Ð²Ð°Ñ€Ñ‹</th><th>Ð˜Ñ‚Ð¾Ð³Ð¾</th><th>ÐžÐ¿Ð»Ð°Ñ‚Ð°</th><th>Ð¡Ñ‚Ð°Ñ‚ÑƒÑ</th><th>Ð”Ð°Ñ‚Ð°</th><th>Ð”ÐµÐ¹ÑÑ‚Ð²Ð¸Ðµ</th></tr></thead><tbody>
    ${orders.map(o=>`<tr>
      <td class="mono">#${o.id}</td>
      <td><div class="bold">${o.name}</div><div style="font-size:11px;color:var(--muted)">${o.phone}</div></td>
      <td style="font-size:12px;color:var(--muted);max-width:180px">${o.items.map(i=>`${i.name} Ã—${i.qty}`).join(', ')}</td>
      <td class="bold" style="color:var(--orange2)">${fmt(o.total)}</td>
      <td style="font-size:12px">${o.pay.split(' ')[0]}</td>
      <td><span class="stbadge st-${o.status}">${{new:'ÐÐ¾Ð²Ñ‹Ð¹',proc:'Ð’ Ñ€Ð°Ð±Ð¾Ñ‚Ðµ',send:'ÐžÑ‚Ð¿Ñ€Ð°Ð²Ð»ÐµÐ½',done:'Ð’Ñ‹Ð¿Ð¾Ð»Ð½ÐµÐ½'}[o.status]}</span></td>
      <td style="font-size:12px;color:var(--muted)">${o.date}</td>
      <td><select style="font-size:11px;border:1px solid var(--border);border-radius:3px;padding:2px" onchange="updStatus('${o.id}',this.value)">
        <option value="new" ${o.status==='new'?'selected':''}>ÐÐ¾Ð²Ñ‹Ð¹</option>
        <option value="proc" ${o.status==='proc'?'selected':''}>Ð’ Ñ€Ð°Ð±Ð¾Ñ‚Ðµ</option>
        <option value="send" ${o.status==='send'?'selected':''}>ÐžÑ‚Ð¿Ñ€Ð°Ð²Ð»ÐµÐ½</option>
        <option value="done" ${o.status==='done'?'selected':''}>Ð’Ñ‹Ð¿Ð¾Ð»Ð½ÐµÐ½</option>
      </select></td>
    </tr>`).join('')}
    </tbody></table></div>`}`;
  }

  else if(admCur==='stock'){
    const lowCount=P.filter(p=>p.stock<20).length;
    el.innerHTML=`<h2>ðŸ“¦ ÐžÑÑ‚Ð°Ñ‚ÐºÐ¸ Ð½Ð° ÑÐºÐ»Ð°Ð´Ðµ</h2>
    <div class="metrics" style="grid-template-columns:repeat(3,1fr);margin-bottom:14px">
      <div class="metric"><div class="mv">${P.reduce((s,p)=>s+p.stock,0).toLocaleString()}</div><div class="ml">Ð’ÑÐµÐ³Ð¾ ÐµÐ´Ð¸Ð½Ð¸Ñ†</div></div>
      <div class="metric"><div class="mv" style="color:var(--red)">${lowCount}</div><div class="ml">ÐŸÐ¾Ð·Ð¸Ñ†Ð¸Ð¹ Ñ Ð½Ð¸Ð·ÐºÐ¸Ð¼ Ð¾ÑÑ‚Ð°Ñ‚ÐºÐ¾Ð¼</div><div class="md dn">Ð¢Ñ€ÐµÐ±ÑƒÑŽÑ‚ Ð²Ð½Ð¸Ð¼Ð°Ð½Ð¸Ñ</div></div>
      <div class="metric"><div class="mv">${P.length}</div><div class="ml">SKU Ð² ÐºÐ°Ñ‚Ð°Ð»Ð¾Ð³Ðµ</div></div>
    </div>
    <div style="display:flex;gap:8px;margin-bottom:14px;align-items:center;flex-wrap:wrap">
      <button class="adm-btn" onclick="syncStockNow()">ðŸ”„ ÐžÐ±Ð½Ð¾Ð²Ð¸Ñ‚ÑŒ Ð¾ÑÑ‚Ð°Ñ‚ÐºÐ¸</button>
      <div class="sync-status"><span class="sync-dot"></span>Ð¡Ð¸ÑÑ‚ÐµÐ¼Ð° Ð¿Ð¾Ð´ÐºÐ»ÑŽÑ‡ÐµÐ½Ð° Â· Ð°Ð²Ñ‚Ð¾-ÑÐ¸Ð½Ñ…Ñ€. ÐºÐ°Ð¶Ð´Ñ‹Ðµ 15 Ð¼Ð¸Ð½</div>
    </div>
    <div class="adm-table-wrap"><table class="adm-tbl"><thead><tr><th>Ð¢Ð¾Ð²Ð°Ñ€</th><th>Ð¡ÐºÐ»Ð°Ð´</th><th>ÐžÑÑ‚Ð°Ñ‚Ð¾Ðº</th><th>ÐžÑÑ‚Ð°Ñ‚Ð¾Ðº</th><th>Ð¦ÐµÐ½Ð° Ð¾Ð¿Ñ‚.</th><th>ÐœÐ°Ñ€Ð¶Ð°</th><th>Ð¡Ð¸Ð½Ñ…Ñ€.</th></tr></thead><tbody>
    ${P.map(p=>{
      const pct=Math.min(100,Math.round(p.stock/10));
      const cls=p.stock<20?'low':p.stock<100?'mid':'';
      const margin=Math.round((1-p.price/p.old)*100);
      return`<tr>
        <td><div class="bold" style="font-size:13px">${p.name}</div></td>
        <td style="font-size:12px">${p.cat==='gas'?'ðŸ­ Ð§ÐµÐ»ÑÐ±Ð¸Ð½ÑÐº':'ðŸ“¦ ÐšÑ€Ð°ÑÐ½Ð¾Ð³Ð¾Ñ€ÑÐº'}</td>
        <td><span style="font-weight:700;color:${p.stock<20?'var(--red)':p.stock<100?'var(--yellow)':'var(--green)'}">${p.stock} ÑˆÑ‚</span></td>
        <td style="min-width:80px"><div class="stock-bar"><div class="stock-fill ${cls}" style="width:${Math.min(100,p.stock/10)}%"></div></div></td>
        <td>${fmt(p.price)}</td>
        <td style="color:var(--green);font-weight:700">âˆ’${margin}%</td>
        <td><span class="stbadge st-send" style="font-size:10px">âœ“ Ð¡Ð¸Ð½Ñ…Ñ€.</span></td>
      </tr>`;
    }).join('')}
    </tbody></table></div>`;
  }

  else if(admCur==='clients'){
    const totalClientRev=clients.reduce((s,c)=>s+c.total,0);
    el.innerHTML=`<h2>ðŸ‘¥ ÐšÐ»Ð¸ÐµÐ½Ñ‚Ñ‹</h2>
    <div class="metrics" style="grid-template-columns:repeat(3,1fr);margin-bottom:14px">
      <div class="metric"><div class="mv">${clients.length}</div><div class="ml">ÐšÐ»Ð¸ÐµÐ½Ñ‚Ð¾Ð² Ð² Ð±Ð°Ð·Ðµ</div></div>
      <div class="metric"><div class="mv">${clients.filter(c=>c.type==='whl').length}</div><div class="ml">ÐžÐ¿Ñ‚Ð¾Ð²Ñ‹Ñ…</div></div>
      <div class="metric"><div class="mv">${fmt(totalClientRev)}</div><div class="ml">ÐžÐ±Ñ‰Ð°Ñ Ð²Ñ‹Ñ€ÑƒÑ‡ÐºÐ°</div></div>
    </div>
    ${!clients.length?'<div style="padding:40px;text-align:center;color:var(--muted)">ÐšÐ»Ð¸ÐµÐ½Ñ‚Ð¾Ð² Ð¿Ð¾ÐºÐ° Ð½ÐµÑ‚</div>':
    `<div class="adm-table-wrap"><table class="adm-tbl"><thead><tr><th>ÐšÐ»Ð¸ÐµÐ½Ñ‚</th><th>Ð¢Ð¸Ð¿</th><th>Ð—Ð°ÐºÐ°Ð·Ð¾Ð²</th><th>Ð¡ÑƒÐ¼Ð¼Ð°</th><th>ÐŸÐ¾ÑÐ»ÐµÐ´Ð½Ð¸Ð¹</th><th>ÐŸÑ€Ð¾Ð¼Ð¾ÐºÐ¾Ð´</th></tr></thead><tbody>
    ${clients.map(c=>`<tr>
      <td><div class="bold">${c.name}</div><div style="font-size:11px;color:var(--muted)">${c.phone}</div></td>
      <td><span class="client-t ct-${c.type}">${c.type==='whl'?'ÐžÐ¿Ñ‚Ð¾Ð²Ñ‹Ð¹':'Ð Ð¾Ð·Ð½Ð¸Ñ†Ð°'}</span></td>
      <td class="bold">${c.orders}</td>
      <td class="bold" style="color:var(--orange2)">${fmt(c.total)}</td>
      <td style="font-size:12px;color:var(--muted)">${c.last}</td>
      <td style="font-size:12px;color:var(--green)">${c.type==='whl'?'ÐžÐŸÐ¢10':'Ð Ð«Ð‘ÐÐš5'}</td>
    </tr>`).join('')}
    </tbody></table></div>`}`;
  }

  else if(admCur==='sync'){
    el.innerHTML=`<h2>ðŸ”„ Ð¡Ð¸Ð½Ñ…Ñ€Ð¾Ð½Ð¸Ð·Ð°Ñ†Ð¸Ñ</h2>
    <div class="integration-row">
      <div class="intg-card">
        <h3><div class="intg-logo ins">IS</div>Ð’Ð¸Ñ‚Ñ€Ð¸Ð½Ð°</h3>
        <div class="intg-stat"><strong>Ð¡Ñ‚Ð°Ñ‚ÑƒÑ:</strong> ÐŸÐ¾Ð´ÐºÐ»ÑŽÑ‡Ñ‘Ð½ âœ…<br><strong>Ð¢Ð°Ñ€Ð¸Ñ„:</strong> Ð‘Ð¸Ð·Ð½ÐµÑ (API Ð°ÐºÑ‚Ð¸Ð²ÐµÐ½)<br><strong>ÐœÐ°Ð³Ð°Ð·Ð¸Ð½:</strong> catcherfish.ru<br><strong>Ð¢Ð¾Ð²Ð°Ñ€Ð¾Ð² Ð²Ñ‹Ð³Ñ€ÑƒÐ¶ÐµÐ½Ð¾:</strong> ${P.length}</div>
        <div class="sync-row"><div class="sync-status"><span class="sync-dot"></span>ÐžÐ½Ð»Ð°Ð¹Ð½</div><button class="adm-btn sm" onclick="syncNow('Ð’Ð¸Ñ‚Ñ€Ð¸Ð½Ð°')">Ð¡Ð¸Ð½Ñ…Ñ€Ð¾Ð½Ð¸Ð·Ð¸Ñ€Ð¾Ð²Ð°Ñ‚ÑŒ</button></div>
      </div>
      <div class="intg-card">
        <h3><div class="intg-logo ms">ÐœÐ¡</div>Ð¡ÐºÐ»Ð°Ð´</h3>
        <div class="intg-stat"><strong>Ð¡Ñ‚Ð°Ñ‚ÑƒÑ:</strong> ÐŸÐ¾Ð´ÐºÐ»ÑŽÑ‡Ñ‘Ð½ âœ…<br><strong>Ð¢Ð°Ñ€Ð¸Ñ„:</strong> Ð‘Ð°Ð·Ð¾Ð²Ñ‹Ð¹ (API Ð°ÐºÑ‚Ð¸Ð²ÐµÐ½)<br><strong>Ð¡ÐºÐ»Ð°Ð´:</strong> Ð§ÐµÐ»ÑÐ±Ð¸Ð½ÑÐº + ÐšÑ€Ð°ÑÐ½Ð¾Ð³Ð¾Ñ€ÑÐº<br><strong>Ð¡Ð¸Ð½Ñ…Ñ€. ÐºÐ°Ð¶Ð´Ñ‹Ðµ:</strong> 15 Ð¼Ð¸Ð½</div>
        <div class="sync-row"><div class="sync-status"><span class="sync-dot"></span>ÐžÐ½Ð»Ð°Ð¹Ð½</div><button class="adm-btn sm" onclick="syncNow('Ð¡ÐºÐ»Ð°Ð´')">ÐŸÑ€Ð¸Ð½ÑƒÐ´Ð¸Ñ‚ÐµÐ»ÑŒÐ½Ð¾</button></div>
      </div>
    </div>
    <div class="adm-table-wrap"><div class="adm-table-head"><h3>Ð›Ð¾Ð³ ÑÐ¸Ð½Ñ…Ñ€Ð¾Ð½Ð¸Ð·Ð°Ñ†Ð¸Ð¸</h3><button class="adm-btn sm" onclick="syncNow('Ð²ÑÐµ ÑÐ¸ÑÑ‚ÐµÐ¼Ñ‹')">ðŸ”„ Ð—Ð°Ð¿ÑƒÑÑ‚Ð¸Ñ‚ÑŒ Ð²ÑÑ‘</button></div>
    <table class="adm-tbl"><thead><tr><th>Ð’Ñ€ÐµÐ¼Ñ</th><th>Ð¡Ð¾Ð±Ñ‹Ñ‚Ð¸Ðµ</th><th>Ð¡Ñ‚Ð°Ñ‚ÑƒÑ</th></tr></thead><tbody>
    ${syncLog.map(l=>`<tr>
      <td style="font-size:12px;color:var(--muted);font-family:monospace">${l.time}</td>
      <td style="font-size:13px">${l.event}</td>
      <td><span class="stbadge st-${l.status==='ok'?'send':'new'}">${l.status==='ok'?'âœ“ Ð£ÑÐ¿ÐµÑˆÐ½Ð¾':'âš  ÐžÑˆÐ¸Ð±ÐºÐ°'}</span></td>
    </tr>`).join('')}
    </tbody></table></div>`;
  }

  else if(admCur==='analytics'){
    el.innerHTML=`<h2>ðŸ“ˆ ÐÐ½Ð°Ð»Ð¸Ñ‚Ð¸ÐºÐ°</h2>
    <div class="metrics">
      <div class="metric"><div class="mv" style="color:var(--orange2)">${fmt(totalRev)}</div><div class="ml">Ð’Ñ‹Ñ€ÑƒÑ‡ÐºÐ°</div></div>
      <div class="metric"><div class="mv">${totalOrds}</div><div class="ml">Ð—Ð°ÐºÐ°Ð·Ð¾Ð²</div></div>
      <div class="metric"><div class="mv">${fmt(Math.round(totalRev/(totalOrds||1)))}</div><div class="ml">Ð¡Ñ€ÐµÐ´Ð½Ð¸Ð¹ Ñ‡ÐµÐº</div></div>
      <div class="metric"><div class="mv">${clients.filter(c=>c.type==='whl').length}</div><div class="ml">ÐžÐ¿Ñ‚Ð¾Ð²Ñ‹Ñ… ÐºÐ»Ð¸ÐµÐ½Ñ‚Ð¾Ð²</div></div>
    </div>
    <div class="chart-area"><h3>Ð’Ñ‹Ñ€ÑƒÑ‡ÐºÐ° Ð¿Ð¾ Ð´Ð½ÑÐ¼ (ÑÐ¸Ð¼ÑƒÐ»ÑÑ†Ð¸Ñ)</h3>
      <div class="bar-chart" id="bar-chart"></div>
    </div>
    <div class="chart-area"><h3>ÐšÐ°Ð½Ð°Ð»Ñ‹ Ñ‚Ñ€Ð°Ñ„Ð¸ÐºÐ°</h3>
      <div class="channel-row">
        <div class="ch-pill"><div class="ch-name">ðŸŽ£ Telegram</div><div class="ch-val" style="color:var(--blue)">${Math.ceil(totalOrds*.4)} Ð·Ð°Ðº.</div><div class="ch-sub">${fmt(Math.round(totalRev*.4))}</div></div>
        <div class="ch-pill"><div class="ch-name">ðŸ“¦ Ð’ÐºÐ»Ð°Ð´Ñ‹ÑˆÐ¸</div><div class="ch-val" style="color:var(--green)">${Math.ceil(totalOrds*.3)} Ð·Ð°Ðº.</div><div class="ch-sub">${fmt(Math.round(totalRev*.3))}</div></div>
        <div class="ch-pill"><div class="ch-name">ðŸ” SEO Ð¯Ð½Ð´ÐµÐºÑ</div><div class="ch-val" style="color:var(--orange)">${Math.ceil(totalOrds*.2)} Ð·Ð°Ðº.</div><div class="ch-sub">${fmt(Math.round(totalRev*.2))}</div></div>
        <div class="ch-pill"><div class="ch-name">ðŸ“¢ Click-out</div><div class="ch-val" style="color:var(--purple)">${Math.ceil(totalOrds*.1)} Ð·Ð°Ðº.</div><div class="ch-sub">${fmt(Math.round(totalRev*.1))}</div></div>
      </div>
    </div>`;
    setTimeout(()=>{
      const days=['13.03','14.03','15.03','16.03','17.03','18.03','19.03'];
      const vals=[2400,5800,3200,8900,4100,7200,totalRev||1200];
      const max=Math.max(...vals);
      const bc=document.getElementById('bar-chart');
      if(bc) bc.innerHTML=days.map((d,i)=>`<div class="bar-col"><div class="bar" style="height:${Math.round(vals[i]/max*100)}px"><div class="bar-val">${Math.round(vals[i]/1000)}Ðº</div></div><div class="bar-lbl">${d}</div></div>`).join('');
    },50);
  }

  else if(admCur==='integrations'){
    el.innerHTML=`<h2>ðŸ”— Ð˜Ð½Ñ‚ÐµÐ³Ñ€Ð°Ñ†Ð¸Ð¸</h2>
    <div class="integration-row">
      <div class="intg-card"><h3><div class="intg-logo ins">IS</div>Ð’Ð¸Ñ‚Ñ€Ð¸Ð½Ð°</h3><div class="intg-stat"><strong>ÐšÐ°Ñ‚Ð°Ð»Ð¾Ð³:</strong> ${P.length} Ñ‚Ð¾Ð²Ð°Ñ€Ð¾Ð²<br><strong>ÐžÑÑ‚Ð°Ñ‚ÐºÐ¸:</strong> ÑÐ¸Ð½Ñ…Ñ€. ÐºÐ°Ð¶Ð´Ñ‹Ðµ 15 Ð¼Ð¸Ð½<br><strong>Ð—Ð°ÐºÐ°Ð·Ñ‹:</strong> Ð¿ÐµÑ€ÐµÐ´Ð°ÑŽÑ‚ÑÑ Ð² ÑÐ¸ÑÑ‚ÐµÐ¼Ñƒ<br><strong>Ð¡Ñ‚Ð°Ñ‚ÑƒÑ:</strong> âœ… ÐÐºÑ‚Ð¸Ð²ÐµÐ½</div><button class="adm-btn sm" onclick="toast('ÐÐ°ÑÑ‚Ñ€Ð¾Ð¹ÐºÐ¸ Ð²Ð¸Ñ‚Ñ€Ð¸Ð½Ñ‹ Ð¾Ñ‚ÐºÑ€Ñ‹Ñ‚Ñ‹')">ÐÐ°ÑÑ‚Ñ€Ð¾Ð¸Ñ‚ÑŒ</button></div>
      <div class="intg-card"><h3><div class="intg-logo ms">ÐœÐ¡</div>Ð¡ÐºÐ»Ð°Ð´</h3><div class="intg-stat"><strong>Ð¡ÐºÐ»Ð°Ð´Ñ‹:</strong> Ð§ÐµÐ»ÑÐ±Ð¸Ð½ÑÐº, ÐšÑ€Ð°ÑÐ½Ð¾Ð³Ð¾Ñ€ÑÐº<br><strong>API ÐºÐ»ÑŽÑ‡:</strong> â—â—â—â—â—â—â—â—1a2b<br><strong>Ð—Ð°ÐºÐ°Ð·Ð¾Ð² Ð¿ÐµÑ€ÐµÐ´Ð°Ð½Ð¾:</strong> ${orders.length}<br><strong>Ð¡Ñ‚Ð°Ñ‚ÑƒÑ:</strong> âœ… ÐÐºÑ‚Ð¸Ð²ÐµÐ½</div><button class="adm-btn sm" onclick="toast('ÐÐ°ÑÑ‚Ñ€Ð¾Ð¹ÐºÐ¸ ÑÐºÐ»Ð°Ð´Ð° Ð¾Ñ‚ÐºÑ€Ñ‹Ñ‚Ñ‹')">ÐÐ°ÑÑ‚Ñ€Ð¾Ð¸Ñ‚ÑŒ</button></div>
    </div>
    <div class="integration-row">
      <div class="intg-card"><h3><div class="intg-logo yk">Ð®Ðš</div>Ð®Kassa</h3><div class="intg-stat"><strong>Ð¡Ñ‚Ð°Ñ‚ÑƒÑ:</strong> ðŸŸ¡ Ð¢ÐµÑÑ‚Ð¾Ð²Ñ‹Ð¹ Ñ€ÐµÐ¶Ð¸Ð¼<br><strong>ÐœÐµÑ‚Ð¾Ð´Ñ‹:</strong> ÐšÐ°Ñ€Ñ‚Ñ‹, Ð¯ÐŸÑÐ¹, SberPay<br><strong>54-Ð¤Ð—:</strong> ÐÐ²Ñ‚Ð¾Ð¼Ð°Ñ‚Ð¸Ñ‡ÐµÑÐºÐ¸Ðµ Ñ‡ÐµÐºÐ¸<br><strong>Ð¢Ñ€Ð°Ð½Ð·Ð°ÐºÑ†Ð¸Ð¹:</strong> ${orders.filter(o=>o.pay.includes('ÐšÐ°Ñ€Ñ‚Ð¾Ð¹')).length}</div><button class="adm-btn sm" onclick="toast('Ð’ÐµÑ€Ð¸Ñ„Ð¸ÐºÐ°Ñ†Ð¸Ñ Ð˜ÐŸ â€” 1-3 Ð´Ð½Ñ Ð¿Ð¾ÑÐ»Ðµ Ð¿Ð¾Ð´Ð°Ñ‡Ð¸ Ð´Ð¾ÐºÑƒÐ¼ÐµÐ½Ñ‚Ð¾Ð²')">Ð’ÐµÑ€Ð¸Ñ„Ð¸Ñ†Ð¸Ñ€Ð¾Ð²Ð°Ñ‚ÑŒ</button></div>
      <div class="intg-card"><h3>âœˆ Telegram-ÐºÐ°Ð½Ð°Ð»</h3><div class="intg-stat"><strong>ÐšÐ°Ð½Ð°Ð»:</strong> @catcherfish<br><strong>ÐŸÐ¾Ð´Ð¿Ð¸ÑÑ‡Ð¸ÐºÐ¾Ð²:</strong> 0 (Ð½Ðµ ÑÐ¾Ð·Ð´Ð°Ð½)<br><strong>Ð—Ð°ÐºÐ°Ð·Ð¾Ð² Ñ Telegram:</strong> ${Math.ceil(orders.length*.4)}<br><strong>Ð¡Ð»ÐµÐ´ÑƒÑŽÑ‰Ð¸Ð¹ ÑˆÐ°Ð³:</strong> Ð¡Ð¾Ð·Ð´Ð°Ñ‚ÑŒ ÐºÐ°Ð½Ð°Ð»</div><button class="adm-btn sm" onclick="toast('Ð¡Ð¾Ð·Ð´Ð°Ð¹Ñ‚Ðµ ÐºÐ°Ð½Ð°Ð» @catcherfish Ð² Telegram')">Ð¡Ð¾Ð·Ð´Ð°Ñ‚ÑŒ ÐºÐ°Ð½Ð°Ð»</button></div>
    </div>`;
  }

  else if(admCur==='ykassa'){
    el.innerHTML=`<h2>ðŸ’³ Ð®Kassa <span class="sub">ÐŸÐ»Ð°Ñ‚Ñ‘Ð¶Ð½Ð°Ñ Ð¸Ð½Ñ‚ÐµÐ³Ñ€Ð°Ñ†Ð¸Ñ</span></h2>
    <div class="ibox or"><strong>âš  Ð¢ÐµÑÑ‚Ð¾Ð²Ñ‹Ð¹ Ñ€ÐµÐ¶Ð¸Ð¼.</strong> Ð ÐµÐ°Ð»ÑŒÐ½Ñ‹Ðµ Ð¿Ð»Ð°Ñ‚ÐµÐ¶Ð¸ Ð°ÐºÑ‚Ð¸Ð²Ð¸Ñ€ÑƒÑŽÑ‚ÑÑ Ð¿Ð¾ÑÐ»Ðµ Ð²ÐµÑ€Ð¸Ñ„Ð¸ÐºÐ°Ñ†Ð¸Ð¸ Ð˜ÐŸ ÐÐ½Ð°Ñ‚Ð¾Ð»Ð¸Ñ (1â€“3 Ñ€Ð°Ð±Ð¾Ñ‡Ð¸Ñ… Ð´Ð½Ñ). ÐŸÐ¾Ð´Ð°Ñ‚ÑŒ Ð´Ð¾ÐºÑƒÐ¼ÐµÐ½Ñ‚Ñ‹: <a href="https://yookassa.ru" target="_blank">yookassa.ru</a></div>
    <div class="integration-row">
      <div class="intg-card"><h3>Ð¡Ñ‚Ð°Ñ‚Ð¸ÑÑ‚Ð¸ÐºÐ° Ð¿Ð»Ð°Ñ‚ÐµÐ¶ÐµÐ¹</h3><div class="intg-stat"><strong>Ð’ÑÐµÐ³Ð¾ Ñ‚Ñ€Ð°Ð½Ð·Ð°ÐºÑ†Ð¸Ð¹:</strong> ${orders.length}<br><strong>ÐšÐ°Ñ€Ñ‚Ð¾Ð¹ Ð¾Ð½Ð»Ð°Ð¹Ð½:</strong> ${orders.filter(o=>o.pay.includes('ÐšÐ°Ñ€Ñ‚Ð¾Ð¹')).length}<br><strong>ÐÐ°Ð»Ð¸Ñ‡Ð½Ñ‹Ð¼Ð¸:</strong> ${orders.filter(o=>o.pay.includes('ÐÐ°Ð»Ð¸Ñ‡')).length}<br><strong>ÐŸÐ¾ ÑÑ‡Ñ‘Ñ‚Ñƒ:</strong> ${orders.filter(o=>o.pay.includes('ÑÑ‡Ñ‘Ñ‚')).length}</div></div>
      <div class="intg-card"><h3>Ð”Ð¾ÐºÑƒÐ¼ÐµÐ½Ñ‚Ñ‹ Ð´Ð»Ñ Ð²ÐµÑ€Ð¸Ñ„Ð¸ÐºÐ°Ñ†Ð¸Ð¸</h3><div class="intg-stat">â˜ ÐŸÐ°ÑÐ¿Ð¾Ñ€Ñ‚ Ð˜ÐŸ (Ñ€Ð°Ð·Ð²Ð¾Ñ€Ð¾Ñ‚ + Ð¿Ñ€Ð¾Ð¿Ð¸ÑÐºÐ°)<br>â˜ Ð˜ÐÐ<br>â˜ ÐžÐ“Ð ÐÐ˜ÐŸ<br>â˜ Ð Ð°ÑÑ‡Ñ‘Ñ‚Ð½Ñ‹Ð¹ ÑÑ‡Ñ‘Ñ‚<br>â˜ Ð¡Ð°Ð¹Ñ‚ Ñ Ð¿ÑƒÐ±Ð»Ð¸Ñ‡Ð½Ð¾Ð¹ Ð¾Ñ„ÐµÑ€Ñ‚Ð¾Ð¹</div><button class="adm-btn sm or" onclick="toast('ÐžÑ‚ÐºÑ€Ð¾Ð¹Ñ‚Ðµ yookassa.ru Ð¸ Ð·Ð°Ð³Ñ€ÑƒÐ·Ð¸Ñ‚Ðµ Ð´Ð¾ÐºÑƒÐ¼ÐµÐ½Ñ‚Ñ‹')">ÐŸÐ¾Ð´Ð°Ñ‚ÑŒ Ð´Ð¾ÐºÑƒÐ¼ÐµÐ½Ñ‚Ñ‹ â†’</button></div>
    </div>`;
  }

  else if(admCur==='telegram'){
    el.innerHTML=`<h2>âœˆ Telegram-ÐºÐ°Ð½Ð°Ð» <span class="sub">@catcherfish</span></h2>
    <div class="ibox bl"><strong>ÐšÐ°Ð½Ð°Ð» ÐµÑ‰Ñ‘ Ð½Ðµ ÑÐ¾Ð·Ð´Ð°Ð½.</strong> Ð­Ñ‚Ð¾ ÐºÐ»ÑŽÑ‡ÐµÐ²Ð¾Ð¹ ÐºÐ°Ð½Ð°Ð» Ð¿Ñ€Ð¸Ð²Ð»ÐµÑ‡ÐµÐ½Ð¸Ñ â€” Ð¿Ð¾ Ð¿Ð»Ð°Ð½Ñƒ 40% Ð·Ð°ÐºÐ°Ð·Ð¾Ð². Ð¡Ð¾Ð·Ð´Ð°Ð¹Ñ‚Ðµ ÐºÐ°Ð½Ð°Ð» ÑÐµÐ³Ð¾Ð´Ð½Ñ.</div>
    <div class="metrics" style="grid-template-columns:repeat(3,1fr)">
      <div class="metric"><div class="mv">0</div><div class="ml">ÐŸÐ¾Ð´Ð¿Ð¸ÑÑ‡Ð¸ÐºÐ¾Ð²</div><div class="md rd">ÐÑƒÐ¶Ð½Ð¾ ÑÐ¾Ð·Ð´Ð°Ñ‚ÑŒ</div></div>
      <div class="metric"><div class="mv">${Math.ceil(orders.length*.4)}</div><div class="ml">Ð—Ð°ÐºÐ°Ð·Ð¾Ð² Ð¾Ð¶Ð¸Ð´Ð°ÐµÑ‚ÑÑ</div><div class="md up">40% Ð¾Ñ‚ Ð¾Ð±Ñ‰ÐµÐ³Ð¾</div></div>
      <div class="metric"><div class="mv">5â€“7</div><div class="ml">ÐŸÐ¾ÑÑ‚Ð¾Ð² Ð² Ð½ÐµÐ´ÐµÐ»ÑŽ</div><div class="md nu">Ð ÐµÐºÐ¾Ð¼ÐµÐ½Ð´ÑƒÐµÑ‚ÑÑ</div></div>
    </div>
    <div class="adm-table-wrap"><div class="adm-table-head"><h3>ÐšÐ¾Ð½Ñ‚ÐµÐ½Ñ‚-Ð¿Ð»Ð°Ð½ â€” ÑÐ»ÐµÐ´ÑƒÑŽÑ‰Ð¸Ðµ 7 Ð´Ð½ÐµÐ¹</h3></div>
    <table class="adm-tbl"><thead><tr><th>Ð”ÐµÐ½ÑŒ</th><th>Ð¢Ð¸Ð¿ Ð¿Ð¾ÑÑ‚Ð°</th><th>Ð¢ÐµÐ¼Ð°</th><th>Ð¡Ñ‚Ð°Ñ‚ÑƒÑ</th></tr></thead><tbody>
      <tr><td>ÐŸÐ½ 20.03</td><td><span class="stbadge st-new">Ð˜ÑÑ‚Ð¾Ñ€Ð¸Ñ</span></td><td>ÐžÑ‚ÐºÑ€Ñ‹Ñ‚Ð¸Ðµ ÐºÐ°Ð½Ð°Ð»Ð°. ÐšÑ‚Ð¾ Ð¼Ñ‹, Ð¿Ð¾Ñ‡ÐµÐ¼Ñƒ Ð´ÐµÑˆÐµÐ²Ð»Ðµ Ñ€Ñ‹Ð½ÐºÐ°.</td><td><button class="adm-btn sm" onclick="toast('ÐŸÐ¾ÑÑ‚ ÑÐºÐ¾Ð¿Ð¸Ñ€Ð¾Ð²Ð°Ð½ Ð² Ð±ÑƒÑ„ÐµÑ€')">Ð¡ÐºÐ¾Ð¿Ð¸Ñ€Ð¾Ð²Ð°Ñ‚ÑŒ</button></td></tr>
      <tr><td>Ð’Ñ‚ 21.03</td><td><span class="stbadge st-proc">ÐŸÐ¾Ð»ÑŒÐ·Ð°</span></td><td>Ð¢Ð¾Ð¿-5 Ð³Ð¾Ñ€ÐµÐ»Ð¾Ðº Ð´Ð»Ñ Ð·Ð¸Ð¼Ð½ÐµÐ¹ Ñ€Ñ‹Ð±Ð°Ð»ÐºÐ¸</td><td><button class="adm-btn sm" onclick="toast('ÐŸÐ¾ÑÑ‚ ÑÐºÐ¾Ð¿Ð¸Ñ€Ð¾Ð²Ð°Ð½')">Ð¡ÐºÐ¾Ð¿Ð¸Ñ€Ð¾Ð²Ð°Ñ‚ÑŒ</button></td></tr>
      <tr><td>Ð¡Ñ€ 22.03</td><td><span class="stbadge st-send">ÐÐºÑ†Ð¸Ñ</span></td><td>Ð“Ð¾Ñ€ÐµÐ»ÐºÐ° NS 509 â€” 280 â‚½. ÐŸÑ€Ð¾Ð¼Ð¾ÐºÐ¾Ð´ Ð Ð«Ð‘ÐÐš7.</td><td><button class="adm-btn sm" onclick="toast('ÐŸÐ¾ÑÑ‚ ÑÐºÐ¾Ð¿Ð¸Ñ€Ð¾Ð²Ð°Ð½')">Ð¡ÐºÐ¾Ð¿Ð¸Ñ€Ð¾Ð²Ð°Ñ‚ÑŒ</button></td></tr>
      <tr><td>Ð§Ñ‚ 23.03</td><td><span class="stbadge st-done">ÐžÐ¿Ñ€Ð¾Ñ</span></td><td>ÐšÐ°ÐºÑƒÑŽ Ñ€Ñ‹Ð±Ñƒ Ð»Ð¾Ð²Ð¸ÑˆÑŒ Ñ‡Ð°Ñ‰Ðµ?</td><td><button class="adm-btn sm" onclick="toast('ÐŸÐ¾ÑÑ‚ ÑÐºÐ¾Ð¿Ð¸Ñ€Ð¾Ð²Ð°Ð½')">Ð¡ÐºÐ¾Ð¿Ð¸Ñ€Ð¾Ð²Ð°Ñ‚ÑŒ</button></td></tr>
      <tr><td>ÐŸÑ‚ 24.03</td><td><span class="stbadge st-proc">Ð¢Ð¾Ð²Ð°Ñ€</span></td><td>ÐŸÐ»Ð¸Ñ‚ÐºÐ° Ðœ-100 â€” 760 â‚½. ÐžÑÑ‚Ð°Ñ‚Ð¾Ðº 298 ÑˆÑ‚.</td><td><button class="adm-btn sm" onclick="toast('ÐŸÐ¾ÑÑ‚ ÑÐºÐ¾Ð¿Ð¸Ñ€Ð¾Ð²Ð°Ð½')">Ð¡ÐºÐ¾Ð¿Ð¸Ñ€Ð¾Ð²Ð°Ñ‚ÑŒ</button></td></tr>
      <tr><td>Ð¡Ð± 25.03</td><td><span class="stbadge st-send">ÐŸÐ¾Ð»ÑŒÐ·Ð°</span></td><td>Ð“Ð´Ðµ ÐºÐ»ÑŽÑ‘Ñ‚ Ð² Ð§ÐµÐ»ÑÐ±Ð¸Ð½ÑÐºÐ¾Ð¹ Ð¾Ð±Ð»Ð°ÑÑ‚Ð¸ â€” Ð¼Ð°Ñ€Ñ‚</td><td><button class="adm-btn sm" onclick="toast('ÐŸÐ¾ÑÑ‚ ÑÐºÐ¾Ð¿Ð¸Ñ€Ð¾Ð²Ð°Ð½')">Ð¡ÐºÐ¾Ð¿Ð¸Ñ€Ð¾Ð²Ð°Ñ‚ÑŒ</button></td></tr>
    </tbody></table></div>`;
  }

  else if(admCur==='catalog_adm'){
    el.innerHTML=`<h2>ðŸ› ÐšÐ°Ñ‚Ð°Ð»Ð¾Ð³</h2>
    <div style="display:flex;gap:8px;margin-bottom:14px;flex-wrap:wrap">
      <button class="adm-btn" onclick="toast('ÐžÐ±Ð½Ð¾Ð²Ð»ÐµÐ½Ð¸Ðµ ÐºÐ°Ñ‚Ð°Ð»Ð¾Ð³Ð° Ð·Ð°Ð¿ÑƒÑ‰ÐµÐ½Ð¾')">â¬† Ð˜Ð¼Ð¿Ð¾Ñ€Ñ‚ ÐºÐ°Ñ‚Ð°Ð»Ð¾Ð³Ð°</button>
      <button class="adm-btn" onclick="toast('Ð­ÐºÑÐ¿Ð¾Ñ€Ñ‚ Ð² CSV Ð³Ð¾Ñ‚Ð¾Ð²')">â¬‡ Ð­ÐºÑÐ¿Ð¾Ñ€Ñ‚ CSV</button>
    </div>
    <div class="adm-table-wrap"><table class="adm-tbl"><thead><tr><th>Ð¤Ð¾Ñ‚Ð¾</th><th>ÐÐ°Ð·Ð²Ð°Ð½Ð¸Ðµ</th><th>ÐšÐ°Ñ‚ÐµÐ³Ð¾Ñ€Ð¸Ñ</th><th>Ð¦ÐµÐ½Ð°</th><th>ÐžÑÑ‚Ð°Ñ‚Ð¾Ðº</th><th>Ð¡Ñ‚Ð°Ñ‚ÑƒÑ</th></tr></thead><tbody>
    ${P.map(p=>`<tr>
      <td><img src="${p.img}" style="width:44px;height:44px;object-fit:contain;border:1px solid var(--border);border-radius:3px" onerror="this.style.display='none'"></td>
      <td><div class="bold" style="font-size:13px">${p.name}</div></td>
      <td style="font-size:12px;color:var(--muted)">${{fishing:'Ð Ñ‹Ð±Ð°Ð»ÐºÐ°',gas:'Ð¡Ð½Ð°Ñ€ÑÐ¶ÐµÐ½Ð¸Ðµ',lure:'ÐžÑÐ½Ð°ÑÑ‚ÐºÐ°',boat:'Ð¢Ñ€Ð°Ð½ÑÐ¿Ð¾Ñ€Ñ‚',tent:'Ð¢ÑƒÑ€Ð¸Ð·Ð¼'}[p.cat]}</td>
      <td class="bold">${fmt(p.price)}</td>
      <td style="font-weight:700;color:${p.stock<20?'var(--red)':p.stock<100?'var(--yellow)':'var(--green)'}">${p.stock}</td>
      <td><span class="stbadge st-send">âœ“ ÐžÐ¿ÑƒÐ±Ð»Ð¸ÐºÐ¾Ð²Ð°Ð½</span></td>
    </tr>`).join('')}
    </tbody></table></div>`;
  }
}

function updStatus(id,status){
  const o=orders.find(x=>x.id===id);if(!o)return;
  o.status=status;
  syncLog.unshift({time:new Date().toLocaleString('ru-RU',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'}),event:`Ð¡Ñ‚Ð°Ñ‚ÑƒÑ Ð·Ð°ÐºÐ°Ð·Ð° #${id} Ð¸Ð·Ð¼ÐµÐ½Ñ‘Ð½ Ð½Ð° Â«${{new:'ÐÐ¾Ð²Ñ‹Ð¹',proc:'Ð’ Ñ€Ð°Ð±Ð¾Ñ‚Ðµ',send:'ÐžÑ‚Ð¿Ñ€Ð°Ð²Ð»ÐµÐ½',done:'Ð’Ñ‹Ð¿Ð¾Ð»Ð½ÐµÐ½'}[status]}Â»`,status:'ok'});
  toast(`Ð—Ð°ÐºÐ°Ð· #${id} â†’ ${{new:'ÐÐ¾Ð²Ñ‹Ð¹',proc:'Ð’ Ñ€Ð°Ð±Ð¾Ñ‚Ðµ',send:'ÐžÑ‚Ð¿Ñ€Ð°Ð²Ð»ÐµÐ½',done:'Ð’Ñ‹Ð¿Ð¾Ð»Ð½ÐµÐ½'}[status]}`);
}
function syncNow(name){
  const t=new Date().toLocaleString('ru-RU',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'});
  syncLog.unshift({time:t,event:`ÐŸÑ€Ð¸Ð½ÑƒÐ´Ð¸Ñ‚ÐµÐ»ÑŒÐ½Ð°Ñ ÑÐ¸Ð½Ñ…Ñ€Ð¾Ð½Ð¸Ð·Ð°Ñ†Ð¸Ñ: ${name}`,status:'ok'});
  toast(`${name} â€” ÑÐ¸Ð½Ñ…Ñ€Ð¾Ð½Ð¸Ð·Ð°Ñ†Ð¸Ñ Ð²Ñ‹Ð¿Ð¾Ð»Ð½ÐµÐ½Ð°`);
  renderAdmin();
}
function syncStockNow(){
  syncLog.unshift({time:new Date().toLocaleString('ru-RU',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'}),event:'ÐžÑÑ‚Ð°Ñ‚ÐºÐ¸ Ð¾Ð±Ð½Ð¾Ð²Ð»ÐµÐ½Ñ‹ (10 Ñ‚Ð¾Ð²Ð°Ñ€Ð¾Ð²)',status:'ok'});
  toast('ÐžÑÑ‚Ð°Ñ‚ÐºÐ¸ ÑÐ¸Ð½Ñ…Ñ€Ð¾Ð½Ð¸Ð·Ð¸Ñ€Ð¾Ð²Ð°Ð½Ñ‹');
  renderAdmin();
}

// â”€â”€ INIT â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
renderCatalog();
updCart();
loadCatalogFromAPI();
loadAdminDataFromAPI().catch(()=>{});

