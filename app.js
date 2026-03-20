// ── PRODUCTS ──────────────────────────────────────────────────────────────
const P=[
  {id:1,cat:'fishing',name:'Грузила чебурашки разборные (10 шт)',price:185,old:240,img:'https://catcherfish.ru/image/cache/catalog/gruzila_cheburashki_razbornye-300x300.jpg',stock:847,badge:'Хит',bc:'or'},
  {id:2,cat:'fishing',name:'Грузила для отводного поводка (15 шт)',price:210,old:280,img:'https://catcherfish.ru/image/cache/catalog/gruzila_dlya_otvodnogo_povodka-300x300.jpg',stock:623,badge:'Хит',bc:'or'},
  {id:3,cat:'lure',name:'Блесна колебалка Catcher 7г (5 шт)',price:320,old:450,img:'https://catcherfish.ru/image/cache/catalog/koleblyushiesya_blesny_Catcher-300x300.jpg',stock:312,badge:null},
  {id:4,cat:'fishing',name:'Фурнитура: вертлюги + карабины (50 шт)',price:140,old:190,img:'https://catcherfish.ru/image/cache/catalog/furnitura_Catcher-300x300.jpg',stock:1240,badge:null},
  {id:5,cat:'boat',name:'Лодка гребная ЛГН-2 двухместная',price:8900,old:12500,img:'https://catcherfish.ru/image/cache/catalog/grebnajalodka-300x300.jpg',stock:14,badge:'Мало',bc:'rd'},
  {id:6,cat:'gas',name:'Горелка газовая мини NS 509',price:280,old:520,img:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop',stock:490,badge:'Склад ЧЛБ',bc:'bl'},
  {id:7,cat:'gas',name:'Горелка газовая NS 502',price:400,old:750,img:'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=300&h=300&fit=crop',stock:500,badge:'Склад ЧЛБ',bc:'bl'},
  {id:8,cat:'gas',name:'Плитка газовая М-100 (оранжевая)',price:760,old:1400,img:'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=300&fit=crop',stock:298,badge:'Склад ЧЛБ',bc:'bl'},
  {id:9,cat:'gas',name:'Горелка с дерев. ручкой NS06',price:960,old:1700,img:'https://images.unsplash.com/photo-1510672981848-a1c4f1cb5ccf?w=300&h=300&fit=crop',stock:118,badge:'Склад ЧЛБ',bc:'bl'},
  {id:10,cat:'gas',name:'Горелка газовая мини NS 100',price:280,old:480,img:'https://images.unsplash.com/photo-1561640289-53c6e11f4c83?w=300&h=300&fit=crop',stock:479,badge:'Склад ЧЛБ',bc:'bl'},
];

// ── STATE ─────────────────────────────────────────────────────────────────
let cart=[],delCost=350,orderN=0,curCat='all',curSearch='',curSort='def';
// Pre-seeded data
let orders=[
  {id:'CF-0001',name:'Анатолий С.',phone:'+7 912 000-11-22',items:[{name:'Горелка NS 509',qty:10,price:280},{name:'Плитка М-100',qty:5,price:760}],sub:6600,del:0,total:6600,pay:'По счёту (юрлицам / ИП)',status:'proc',date:'19.03 09:14',src:'Telegram'},
  {id:'CF-0002',name:'Иван Рыбаков',phone:'+7 901 555-44-33',items:[{name:'Грузила чебурашки',qty:3,price:185}],sub:555,del:180,total:735,pay:'Картой онлайн',status:'send',date:'18.03 16:42',src:'Вкладыш'},
  {id:'CF-0003',name:'Марина К.',phone:'+7 916 222-33-44',items:[{name:'Блесна колебалка',qty:2,price:320}],sub:640,del:350,total:990,pay:'Картой онлайн',status:'done',date:'17.03 11:20',src:'SEO'},
];
let clients=[
  {name:'Анатолий С.',phone:'+7 912 000-11-22',orders:3,total:47800,last:'19.03',type:'whl'},
  {name:'Иван Рыбаков',phone:'+7 901 555-44-33',orders:1,total:735,last:'18.03',type:'ret'},
  {name:'Марина К.',phone:'+7 916 222-33-44',orders:1,total:990,last:'17.03',type:'ret'},
];
let syncLog=[
  {time:'19.03 12:01',event:'Остатки синхронизированы',status:'ok'},
  {time:'19.03 11:31',event:'Цены обновлены (10 товаров)',status:'ok'},
  {time:'19.03 10:00',event:'Заказ CF-0001 передан в МойСклад',status:'ok'},
  {time:'18.03 18:45',event:'Новый клиент добавлен',status:'ok'},
];

const fmt=n=>n.toLocaleString('ru-RU')+' ₽';

// ── PAGES ─────────────────────────────────────────────────────────────────
function showPage(name){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.getElementById('page-'+name).classList.add('active');
  document.querySelectorAll('.mni').forEach(b=>b.classList.remove('act'));
  if(name==='catalog') document.getElementById('nav-cat')?.classList.add('act');
  if(name==='admin') renderAdmin('dashboard');
  window.scrollTo(0,0);
}
function setMobActive(el){document.querySelectorAll('.mob-nav-btn').forEach(b=>b.classList.remove('active'));el.classList.add('active');}

function toggleLKPanel(){
  const panel=document.getElementById('lk-panel');
  if(!panel) return;
  panel.classList.toggle('open');
}
function submitLK(){
  const pass=document.getElementById('lk-pass');
  if(!pass) return;
  const value=pass.value.trim().toLowerCase();
  if(!value){toast('Введите пароль',false);return;}
  if(value==='admin'){
    toast('Доступ администратора подтверждён.');
    pass.value='';
    document.getElementById('lk-user').value='';
    toggleLKPanel();
    showPage('admin');
  } else {
    toast('Неверный пароль',false);
  }
}
function registerLK(){
  toast('Регистрация временно недоступна. Обратитесь к менеджеру.');
}
document.addEventListener('click',e=>{
  const panel=document.getElementById('lk-panel');
  if(!panel||!panel.classList.contains('open')) return;
  if(panel.contains(e.target) || e.target.closest('.hadmin') || e.target.closest('.mni-admin') || e.target.closest('.mob-nav-btn')) return;
  panel.classList.remove('open');
});

// ── CATALOG ───────────────────────────────────────────────────────────────
function filterCat(cat){
  curCat=cat;
  const lbl={all:'Все товары',fishing:'Рыболовные',gas:'Газовое снаряжение',lure:'Блёсны и снасти',boat:'Лодки'};
  document.getElementById('ct').textContent=lbl[cat]||'Все товары';
  document.getElementById('bc').textContent=lbl[cat]||'Все товары';
  renderCatalog();
}
function doSearch(v){curSearch=v;renderCatalog();}
function doSort(v){curSort=v;renderCatalog();}
function renderCatalog(){
  let list=P.filter(p=>{
    const cok=curCat==='all'||p.cat===curCat;
    const sok=!curSearch||p.name.toLowerCase().includes(curSearch.toLowerCase());
    return cok&&sok;
  });
  if(curSort==='asc') list.sort((a,b)=>a.price-b.price);
  else if(curSort==='desc') list.sort((a,b)=>b.price-a.price);
  else if(curSort==='name') list.sort((a,b)=>a.name.localeCompare(b.name,'ru'));
  const fish=list.filter(p=>p.cat!=='gas'), gas=list.filter(p=>p.cat==='gas');
  renderGrid('gf',fish); renderGrid('gg',gas);
  document.getElementById('sf').style.display=fish.length?'':'none';
  document.getElementById('sg').style.display=gas.length?'':'none';
}
function renderGrid(id,items){
  const g=document.getElementById(id);
  if(!items.length){g.innerHTML='<div style="grid-column:1/-1;padding:20px;color:var(--muted);text-align:center">Нет товаров</div>';return;}
  g.innerHTML=items.map(p=>{
    const ic=cart.find(c=>c.id===p.id);
    const disc=Math.round((1-p.price/p.old)*100);
    const stk=p.stock<20?`<div class="pstk-lo">⚠ Осталось ${p.stock} шт</div>`:`<div class="pstk-ok">✓ В наличии: ${p.stock} шт</div>`;
    return`<div class="pcard">
      ${p.badge?`<div class="pbadge ${p.bc||'or'}">${p.badge}</div>`:''}
      <div class="pimg"><img src="${p.img}" alt="${p.name}" loading="lazy" onerror="this.src='https://catcherfish.ru/image/cache/catalog/gruzila_cheburashki_razbornye-300x300.jpg'"></div>
      <div class="pi">
        <div class="pn">${p.name}</div>
        <div class="pp-row"><span class="pp">${fmt(p.price)}</span><span class="pold">${fmt(p.old)}</span><span class="pdisc">−${disc}%</span></div>
        ${stk}
        <div class="pa">
          <button class="btn-buy${ic?' ic':''}" id="bb-${p.id}" onclick="addCart(${p.id})">${ic?'✓ В корзине':'🛒 В корзину'}</button>
          <button class="btn-fav">♡</button>
        </div>
      </div>
    </div>`;
  }).join('');
}

// ── CART ──────────────────────────────────────────────────────────────────
function addCart(id){
  const p=P.find(x=>x.id===id); const ex=cart.find(c=>c.id===id);
  if(ex) ex.qty++; else cart.push({...p,qty:1});
  updCart(); toast(`${p.name.slice(0,26)}… → корзина`); renderCatalog();
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
    body.innerHTML='<div class="cp-empty"><div style="font-size:48px;opacity:.2;margin-bottom:12px">🛒</div><p>Корзина пуста</p></div>';
    foot.innerHTML='<div style="padding:14px 18px"><button class="btn-cont" onclick="closeCart()">Перейти в каталог</button></div>';return;
  }
  const sub=cart.reduce((s,c)=>s+c.price*c.qty,0);
  body.innerHTML=cart.map(c=>`<div class="ci">
    <img class="ci-img" src="${c.img}" onerror="this.src='https://catcherfish.ru/image/cache/catalog/gruzila_cheburashki_razbornye-300x300.jpg'">
    <div class="ci-inf">
      <div class="ci-n">${c.name}</div>
      <div class="ci-qr"><button class="cqb" onclick="chQ(${c.id},-1)">−</button><span style="min-width:20px;text-align:center;font-weight:700">${c.qty}</span><button class="cqb" onclick="chQ(${c.id},1)">+</button><span class="ci-u">${fmt(c.price)}/шт</span></div>
      <button class="ci-d" onclick="remCart(${c.id})">✕ Удалить</button>
    </div>
    <div class="ci-tot">${fmt(c.price*c.qty)}</div>
  </div>`).join('');
  foot.innerHTML=`<div class="cp-f">
    <div class="cf-r"><span>Товары (${cart.reduce((s,c)=>s+c.qty,0)} шт)</span><span>${fmt(sub)}</span></div>
    <div class="cf-tot"><span>Итого</span><span>${fmt(sub)}</span></div>
    <button class="btn-co" onclick="openOrder()">Оформить заказ →</button>
    <button class="btn-cont" onclick="closeCart()">Продолжить покупки</button>
  </div>`;
}
function chQ(id,d){const i=cart.find(c=>c.id===id);if(!i)return;i.qty+=d;if(i.qty<=0)cart=cart.filter(c=>c.id!==id);updCart();renderCart();renderCatalog();}
function remCart(id){cart=cart.filter(c=>c.id!==id);updCart();renderCart();renderCatalog();}

// ── ORDER ─────────────────────────────────────────────────────────────────
function openOrder(){closeCart();updOrds();document.getElementById('mod-ov').classList.add('open');}
function closeMod(){document.getElementById('mod-ov').classList.remove('open');}
function movClick(e){if(e.target===document.getElementById('mod-ov'))closeMod();}
function selD(el,cost){document.querySelectorAll('.dopt').forEach(o=>o.classList.remove('sel'));el.classList.add('sel');delCost=cost;updOrds();}
function updOrds(){
  const sub=cart.reduce((s,c)=>s+c.price*c.qty,0);
  document.getElementById('ords').innerHTML=`<div class="ord-s">
    <div class="os-r"><span>Товары</span><span>${fmt(sub)}</span></div>
    <div class="os-r"><span>Доставка</span><span>${delCost?fmt(delCost):'Бесплатно'}</span></div>
    <div class="os-tot"><span>К оплате</span><span>${fmt(sub+delCost)}</span></div>
  </div>`;
}
function placeOrder(){
  const n=document.getElementById('fn').value.trim(), ph=document.getElementById('fph').value.trim();
  if(!n||!ph){toast('Введите имя и телефон',false);return;}
  if(!cart.length){toast('Корзина пуста',false);return;}
  orderN++;
  const sub=cart.reduce((s,c)=>s+c.price*c.qty,0);
  const num='CF-'+String(orderN+3).padStart(4,'0');
  const order={id:num,name:n,phone:ph,items:cart.map(c=>({name:c.name,qty:c.qty,price:c.price})),sub,del:delCost,total:sub+delCost,pay:document.getElementById('fpay').value,status:'new',date:new Date().toLocaleString('ru-RU',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'}),src:'Прямой'};
  orders.unshift(order);
  cart.forEach(c=>{const p=P.find(x=>x.id===c.id);if(p)p.stock=Math.max(0,p.stock-c.qty);});
  // add client
  const exc=clients.find(c=>c.phone===ph);
  if(exc){exc.orders++;exc.total+=order.total;exc.last=order.date;}
  else clients.push({name:n,phone:ph,orders:1,total:order.total,last:order.date,type:'ret'});
  syncLog.unshift({time:order.date,event:`Заказ ${num} создан и передан в МойСклад`,status:'ok'});
  cart=[];updCart();renderCatalog();closeMod();
  document.getElementById('snum').textContent='#'+num;
  document.getElementById('succ-ov').classList.add('open');
  const bel=document.getElementById('b-new');if(bel){const newc=orders.filter(o=>o.status==='new').length;bel.textContent=newc||'';bel.style.display=newc?'':'none';}
}

// ── CONTACT FORM ──────────────────────────────────────────────────────────
function sendCF(){
  if(!document.getElementById('cfn').value.trim()||!document.getElementById('cfc').value.trim()){toast('Заполните имя и контакт',false);return;}
  toast('Сообщение отправлено! Ответим в течение 2 часов.');
  ['cfn','cfc','cfm'].forEach(id=>document.getElementById(id).value='');
}

// ── TOAST ─────────────────────────────────────────────────────────────────
function toast(msg,ok=true){
  const t=document.createElement('div');t.className='toast'+(ok?' ok':' er');t.textContent=msg;
  document.body.appendChild(t);setTimeout(()=>t.remove(),2700);
}

// ══════════════════════════════════════════════════════════════════════════
// ADMIN PANEL RENDERER
// ══════════════════════════════════════════════════════════════════════════
let admCur='dashboard';
function admTab(tab,el){
  admCur=tab;
  document.querySelectorAll('.adm-nav a').forEach(a=>a.classList.remove('act'));
  if(el) el.classList.add('act');
  renderAdmin(tab);
}
function renderAdmin(tab){
  admCur=tab||admCur;
  const el=document.getElementById('adm-content');
  const totalRev=orders.reduce((s,o)=>s+o.total,0);
  const totalOrds=orders.length;
  const newOrds=orders.filter(o=>o.status==='new').length;

  if(admCur==='dashboard'){
    const gasRev=orders.reduce((s,o)=>s+o.items.filter(i=>i.name.includes('горел')||i.name.includes('плитк')||i.name.includes('Горел')||i.name.includes('Плитк')).reduce((ss,i)=>ss+i.price*i.qty,0),0);
    el.innerHTML=`<h2>📊 Дашборд <span class="sub">catcherfish.ru · Март 2026</span></h2>
    <div class="metrics">
      <div class="metric"><div class="mv" style="color:var(--orange2)">${fmt(totalRev)}</div><div class="ml">Выручка (все заказы)</div><div class="md up">↑ +${totalOrds} заказов</div></div>
      <div class="metric"><div class="mv">${totalOrds}</div><div class="ml">Заказов всего</div><div class="md ${newOrds?'up':'nu'}">${newOrds} новых</div></div>
      <div class="metric"><div class="mv">${totalOrds?fmt(Math.round(totalRev/totalOrds)):0}</div><div class="ml">Средний чек</div><div class="md nu">InSales метрика</div></div>
      <div class="metric"><div class="mv">${clients.length}</div><div class="ml">Клиентов в базе</div><div class="md up">↑ +${clients.filter(c=>c.type==='whl').length} оптовых</div></div>
    </div>
    <div class="chart-area"><h3>📈 Выручка по каналам (симуляция)</h3>
      <div class="channel-row">
        <div class="ch-pill"><div class="ch-name">🎣 Telegram</div><div class="ch-val">${fmt(Math.round(totalRev*.40))}</div><div class="ch-sub">40% · конв. 3.2%</div></div>
        <div class="ch-pill"><div class="ch-name">📦 Вкладыши</div><div class="ch-val">${fmt(Math.round(totalRev*.30))}</div><div class="ch-sub">30% · конв. 2.8%</div></div>
        <div class="ch-pill"><div class="ch-name">🔍 SEO</div><div class="ch-val">${fmt(Math.round(totalRev*.20))}</div><div class="ch-sub">20% · конв. 1.9%</div></div>
        <div class="ch-pill"><div class="ch-name">📢 Click-out</div><div class="ch-val">${fmt(Math.round(totalRev*.10))}</div><div class="ch-sub">10% · конв. 1.1%</div></div>
      </div>
    </div>
    <div class="adm-table-wrap"><div class="adm-table-head"><h3>Последние заказы</h3><button class="adm-btn sm" onclick="admTab('orders',null)">Все заказы →</button></div>
    <table class="adm-tbl"><thead><tr><th>№</th><th>Клиент</th><th>Сумма</th><th>Статус</th><th>Канал</th><th>Дата</th></tr></thead><tbody>
    ${orders.slice(0,5).map(o=>`<tr>
      <td class="mono">#${o.id}</td>
      <td><div class="bold">${o.name}</div><div style="font-size:11px;color:var(--muted)">${o.phone}</div></td>
      <td class="bold" style="color:var(--orange2)">${fmt(o.total)}</td>
      <td><span class="stbadge st-${o.status}">${{new:'Новый',proc:'В работе',send:'Отправлен',done:'Выполнен'}[o.status]}</span></td>
      <td style="font-size:12px;color:var(--muted)">${o.src||'—'}</td>
      <td style="font-size:12px;color:var(--muted)">${o.date}</td>
    </tr>`).join('')}
    </tbody></table></div>`;
  }

  else if(admCur==='orders'){
    el.innerHTML=`<h2>📋 Заказы (InSales)</h2>
    <div style="display:flex;gap:8px;margin-bottom:14px;flex-wrap:wrap">
      <button class="adm-btn" onclick="toast('Экспорт в Excel запущен')">⬇ Экспорт Excel</button>
      <button class="adm-btn" onclick="toast('Данные обновлены из InSales')">🔄 Обновить</button>
    </div>
    ${!orders.length?'<div style="padding:40px;text-align:center;color:var(--muted)">Заказов пока нет — оформите первый в каталоге</div>':
    `<div class="adm-table-wrap"><table class="adm-tbl"><thead><tr><th>№</th><th>Клиент</th><th>Товары</th><th>Итого</th><th>Оплата</th><th>Статус</th><th>Дата</th><th>Действие</th></tr></thead><tbody>
    ${orders.map(o=>`<tr>
      <td class="mono">#${o.id}</td>
      <td><div class="bold">${o.name}</div><div style="font-size:11px;color:var(--muted)">${o.phone}</div></td>
      <td style="font-size:12px;color:var(--muted);max-width:180px">${o.items.map(i=>`${i.name} ×${i.qty}`).join(', ')}</td>
      <td class="bold" style="color:var(--orange2)">${fmt(o.total)}</td>
      <td style="font-size:12px">${o.pay.split(' ')[0]}</td>
      <td><span class="stbadge st-${o.status}">${{new:'Новый',proc:'В работе',send:'Отправлен',done:'Выполнен'}[o.status]}</span></td>
      <td style="font-size:12px;color:var(--muted)">${o.date}</td>
      <td><select style="font-size:11px;border:1px solid var(--border);border-radius:3px;padding:2px" onchange="updStatus('${o.id}',this.value)">
        <option value="new" ${o.status==='new'?'selected':''}>Новый</option>
        <option value="proc" ${o.status==='proc'?'selected':''}>В работе</option>
        <option value="send" ${o.status==='send'?'selected':''}>Отправлен</option>
        <option value="done" ${o.status==='done'?'selected':''}>Выполнен</option>
      </select></td>
    </tr>`).join('')}
    </tbody></table></div>`}`;
  }

  else if(admCur==='stock'){
    const lowCount=P.filter(p=>p.stock<20).length;
    el.innerHTML=`<h2>📦 Остатки на складе (МойСклад)</h2>
    <div class="metrics" style="grid-template-columns:repeat(3,1fr);margin-bottom:14px">
      <div class="metric"><div class="mv">${P.reduce((s,p)=>s+p.stock,0).toLocaleString()}</div><div class="ml">Всего единиц</div></div>
      <div class="metric"><div class="mv" style="color:var(--red)">${lowCount}</div><div class="ml">Позиций с низким остатком</div><div class="md dn">Требуют внимания</div></div>
      <div class="metric"><div class="mv">${P.length}</div><div class="ml">SKU в каталоге</div></div>
    </div>
    <div style="display:flex;gap:8px;margin-bottom:14px;align-items:center;flex-wrap:wrap">
      <button class="adm-btn" onclick="syncStockNow()">🔄 Синхронизировать с InSales</button>
      <div class="sync-status"><span class="sync-dot"></span>МойСклад подключён · авто-синхр. каждые 15 мин</div>
    </div>
    <div class="adm-table-wrap"><table class="adm-tbl"><thead><tr><th>Товар</th><th>Склад</th><th>Остаток</th><th>Остаток</th><th>Цена опт.</th><th>Маржа</th><th>Синхр.</th></tr></thead><tbody>
    ${P.map(p=>{
      const pct=Math.min(100,Math.round(p.stock/10));
      const cls=p.stock<20?'low':p.stock<100?'mid':'';
      const margin=Math.round((1-p.price/p.old)*100);
      return`<tr>
        <td><div class="bold" style="font-size:13px">${p.name}</div></td>
        <td style="font-size:12px">${p.cat==='gas'?'🏭 Челябинск':'📦 Красногорск'}</td>
        <td><span style="font-weight:700;color:${p.stock<20?'var(--red)':p.stock<100?'var(--yellow)':'var(--green)'}">${p.stock} шт</span></td>
        <td style="min-width:80px"><div class="stock-bar"><div class="stock-fill ${cls}" style="width:${Math.min(100,p.stock/10)}%"></div></div></td>
        <td>${fmt(p.price)}</td>
        <td style="color:var(--green);font-weight:700">−${margin}%</td>
        <td><span class="stbadge st-send" style="font-size:10px">✓ Синхр.</span></td>
      </tr>`;
    }).join('')}
    </tbody></table></div>`;
  }

  else if(admCur==='clients'){
    const totalClientRev=clients.reduce((s,c)=>s+c.total,0);
    el.innerHTML=`<h2>👥 Клиенты (InSales CRM)</h2>
    <div class="metrics" style="grid-template-columns:repeat(3,1fr);margin-bottom:14px">
      <div class="metric"><div class="mv">${clients.length}</div><div class="ml">Клиентов в базе</div></div>
      <div class="metric"><div class="mv">${clients.filter(c=>c.type==='whl').length}</div><div class="ml">Оптовых</div></div>
      <div class="metric"><div class="mv">${fmt(totalClientRev)}</div><div class="ml">Общая выручка</div></div>
    </div>
    ${!clients.length?'<div style="padding:40px;text-align:center;color:var(--muted)">Клиентов пока нет</div>':
    `<div class="adm-table-wrap"><table class="adm-tbl"><thead><tr><th>Клиент</th><th>Тип</th><th>Заказов</th><th>Сумма</th><th>Последний</th><th>Промокод</th></tr></thead><tbody>
    ${clients.map(c=>`<tr>
      <td><div class="bold">${c.name}</div><div style="font-size:11px;color:var(--muted)">${c.phone}</div></td>
      <td><span class="client-t ct-${c.type}">${c.type==='whl'?'Оптовый':'Розница'}</span></td>
      <td class="bold">${c.orders}</td>
      <td class="bold" style="color:var(--orange2)">${fmt(c.total)}</td>
      <td style="font-size:12px;color:var(--muted)">${c.last}</td>
      <td style="font-size:12px;color:var(--green)">${c.type==='whl'?'ОПТ10':'РЫБАК5'}</td>
    </tr>`).join('')}
    </tbody></table></div>`}`;
  }

  else if(admCur==='sync'){
    el.innerHTML=`<h2>🔄 Синхронизация (МойСклад ↔ InSales)</h2>
    <div class="integration-row">
      <div class="intg-card">
        <h3><div class="intg-logo ins">IS</div>InSales</h3>
        <div class="intg-stat"><strong>Статус:</strong> Подключён ✅<br><strong>Тариф:</strong> Бизнес (API активен)<br><strong>Магазин:</strong> catcherfish.ru<br><strong>Товаров выгружено:</strong> ${P.length}</div>
        <div class="sync-row"><div class="sync-status"><span class="sync-dot"></span>Онлайн</div><button class="adm-btn sm" onclick="syncNow('InSales')">Синхронизировать</button></div>
      </div>
      <div class="intg-card">
        <h3><div class="intg-logo ms">МС</div>МойСклад</h3>
        <div class="intg-stat"><strong>Статус:</strong> Подключён ✅<br><strong>Тариф:</strong> Базовый (API активен)<br><strong>Склад:</strong> Челябинск + Красногорск<br><strong>Синхр. каждые:</strong> 15 мин</div>
        <div class="sync-row"><div class="sync-status"><span class="sync-dot"></span>Онлайн</div><button class="adm-btn sm" onclick="syncNow('МойСклад')">Принудительно</button></div>
      </div>
    </div>
    <div class="adm-table-wrap"><div class="adm-table-head"><h3>Лог синхронизации</h3><button class="adm-btn sm" onclick="syncNow('все системы')">🔄 Запустить всё</button></div>
    <table class="adm-tbl"><thead><tr><th>Время</th><th>Событие</th><th>Статус</th></tr></thead><tbody>
    ${syncLog.map(l=>`<tr>
      <td style="font-size:12px;color:var(--muted);font-family:monospace">${l.time}</td>
      <td style="font-size:13px">${l.event}</td>
      <td><span class="stbadge st-${l.status==='ok'?'send':'new'}">${l.status==='ok'?'✓ Успешно':'⚠ Ошибка'}</span></td>
    </tr>`).join('')}
    </tbody></table></div>`;
  }

  else if(admCur==='analytics'){
    el.innerHTML=`<h2>📈 Аналитика</h2>
    <div class="metrics">
      <div class="metric"><div class="mv" style="color:var(--orange2)">${fmt(totalRev)}</div><div class="ml">Выручка</div></div>
      <div class="metric"><div class="mv">${totalOrds}</div><div class="ml">Заказов</div></div>
      <div class="metric"><div class="mv">${fmt(Math.round(totalRev/(totalOrds||1)))}</div><div class="ml">Средний чек</div></div>
      <div class="metric"><div class="mv">${clients.filter(c=>c.type==='whl').length}</div><div class="ml">Оптовых клиентов</div></div>
    </div>
    <div class="chart-area"><h3>Выручка по дням (симуляция)</h3>
      <div class="bar-chart" id="bar-chart"></div>
    </div>
    <div class="chart-area"><h3>Каналы трафика</h3>
      <div class="channel-row">
        <div class="ch-pill"><div class="ch-name">🎣 Telegram</div><div class="ch-val" style="color:var(--blue)">${Math.ceil(totalOrds*.4)} зак.</div><div class="ch-sub">${fmt(Math.round(totalRev*.4))}</div></div>
        <div class="ch-pill"><div class="ch-name">📦 Вкладыши</div><div class="ch-val" style="color:var(--green)">${Math.ceil(totalOrds*.3)} зак.</div><div class="ch-sub">${fmt(Math.round(totalRev*.3))}</div></div>
        <div class="ch-pill"><div class="ch-name">🔍 SEO Яндекс</div><div class="ch-val" style="color:var(--orange)">${Math.ceil(totalOrds*.2)} зак.</div><div class="ch-sub">${fmt(Math.round(totalRev*.2))}</div></div>
        <div class="ch-pill"><div class="ch-name">📢 Click-out</div><div class="ch-val" style="color:var(--purple)">${Math.ceil(totalOrds*.1)} зак.</div><div class="ch-sub">${fmt(Math.round(totalRev*.1))}</div></div>
      </div>
    </div>`;
    setTimeout(()=>{
      const days=['13.03','14.03','15.03','16.03','17.03','18.03','19.03'];
      const vals=[2400,5800,3200,8900,4100,7200,totalRev||1200];
      const max=Math.max(...vals);
      const bc=document.getElementById('bar-chart');
      if(bc) bc.innerHTML=days.map((d,i)=>`<div class="bar-col"><div class="bar" style="height:${Math.round(vals[i]/max*100)}px"><div class="bar-val">${Math.round(vals[i]/1000)}к</div></div><div class="bar-lbl">${d}</div></div>`).join('');
    },50);
  }

  else if(admCur==='integrations'){
    el.innerHTML=`<h2>🔗 Интеграции</h2>
    <div class="integration-row">
      <div class="intg-card"><h3><div class="intg-logo ins">IS</div>InSales</h3><div class="intg-stat"><strong>Каталог:</strong> ${P.length} товаров<br><strong>Остатки:</strong> синхр. каждые 15 мин<br><strong>Заказы:</strong> передаются в МойСклад<br><strong>Статус:</strong> ✅ Активен</div><button class="adm-btn sm" onclick="toast('Настройки InSales открыты')">Настроить</button></div>
      <div class="intg-card"><h3><div class="intg-logo ms">МС</div>МойСклад</h3><div class="intg-stat"><strong>Склады:</strong> Челябинск, Красногорск<br><strong>API ключ:</strong> ●●●●●●●●1a2b<br><strong>Заказов передано:</strong> ${orders.length}<br><strong>Статус:</strong> ✅ Активен</div><button class="adm-btn sm" onclick="toast('Настройки МойСклад открыты')">Настроить</button></div>
    </div>
    <div class="integration-row">
      <div class="intg-card"><h3><div class="intg-logo yk">ЮК</div>ЮKassa</h3><div class="intg-stat"><strong>Статус:</strong> 🟡 Тестовый режим<br><strong>Методы:</strong> Карты, ЯПэй, SberPay<br><strong>54-ФЗ:</strong> Автоматические чеки<br><strong>Транзакций:</strong> ${orders.filter(o=>o.pay.includes('Картой')).length}</div><button class="adm-btn sm" onclick="toast('Верификация ИП — 1-3 дня после подачи документов')">Верифицировать</button></div>
      <div class="intg-card"><h3>✈ Telegram-канал</h3><div class="intg-stat"><strong>Канал:</strong> @catcherfish<br><strong>Подписчиков:</strong> 0 (не создан)<br><strong>Заказов с Telegram:</strong> ${Math.ceil(orders.length*.4)}<br><strong>Следующий шаг:</strong> Создать канал</div><button class="adm-btn sm" onclick="toast('Создайте канал @catcherfish в Telegram')">Создать канал</button></div>
    </div>`;
  }

  else if(admCur==='ykassa'){
    el.innerHTML=`<h2>💳 ЮKassa <span class="sub">Платёжная интеграция</span></h2>
    <div class="ibox or"><strong>⚠ Тестовый режим.</strong> Реальные платежи активируются после верификации ИП Анатолия (1–3 рабочих дня). Подать документы: <a href="https://yookassa.ru" target="_blank">yookassa.ru</a></div>
    <div class="integration-row">
      <div class="intg-card"><h3>Статистика платежей</h3><div class="intg-stat"><strong>Всего транзакций:</strong> ${orders.length}<br><strong>Картой онлайн:</strong> ${orders.filter(o=>o.pay.includes('Картой')).length}<br><strong>Наличными:</strong> ${orders.filter(o=>o.pay.includes('Налич')).length}<br><strong>По счёту:</strong> ${orders.filter(o=>o.pay.includes('счёт')).length}</div></div>
      <div class="intg-card"><h3>Документы для верификации</h3><div class="intg-stat">☐ Паспорт ИП (разворот + прописка)<br>☐ ИНН<br>☐ ОГРНИП<br>☐ Расчётный счёт<br>☐ Сайт с публичной офертой</div><button class="adm-btn sm or" onclick="toast('Откройте yookassa.ru и загрузите документы')">Подать документы →</button></div>
    </div>`;
  }

  else if(admCur==='telegram'){
    el.innerHTML=`<h2>✈ Telegram-канал <span class="sub">@catcherfish</span></h2>
    <div class="ibox bl"><strong>Канал ещё не создан.</strong> Это ключевой канал привлечения — по плану 40% заказов. Создайте канал сегодня.</div>
    <div class="metrics" style="grid-template-columns:repeat(3,1fr)">
      <div class="metric"><div class="mv">0</div><div class="ml">Подписчиков</div><div class="md rd">Нужно создать</div></div>
      <div class="metric"><div class="mv">${Math.ceil(orders.length*.4)}</div><div class="ml">Заказов ожидается</div><div class="md up">40% от общего</div></div>
      <div class="metric"><div class="mv">5–7</div><div class="ml">Постов в неделю</div><div class="md nu">Рекомендуется</div></div>
    </div>
    <div class="adm-table-wrap"><div class="adm-table-head"><h3>Контент-план — следующие 7 дней</h3></div>
    <table class="adm-tbl"><thead><tr><th>День</th><th>Тип поста</th><th>Тема</th><th>Статус</th></tr></thead><tbody>
      <tr><td>Пн 20.03</td><td><span class="stbadge st-new">История</span></td><td>Открытие канала. Кто мы, почему дешевле Ozon.</td><td><button class="adm-btn sm" onclick="toast('Пост скопирован в буфер')">Скопировать</button></td></tr>
      <tr><td>Вт 21.03</td><td><span class="stbadge st-proc">Польза</span></td><td>Топ-5 горелок для зимней рыбалки</td><td><button class="adm-btn sm" onclick="toast('Пост скопирован')">Скопировать</button></td></tr>
      <tr><td>Ср 22.03</td><td><span class="stbadge st-send">Акция</span></td><td>Горелка NS 509 — 280 ₽. Промокод РЫБАК7.</td><td><button class="adm-btn sm" onclick="toast('Пост скопирован')">Скопировать</button></td></tr>
      <tr><td>Чт 23.03</td><td><span class="stbadge st-done">Опрос</span></td><td>Какую рыбу ловишь чаще?</td><td><button class="adm-btn sm" onclick="toast('Пост скопирован')">Скопировать</button></td></tr>
      <tr><td>Пт 24.03</td><td><span class="stbadge st-proc">Товар</span></td><td>Плитка М-100 — 760 ₽. Остаток 298 шт.</td><td><button class="adm-btn sm" onclick="toast('Пост скопирован')">Скопировать</button></td></tr>
      <tr><td>Сб 25.03</td><td><span class="stbadge st-send">Польза</span></td><td>Где клюёт в Челябинской области — март</td><td><button class="adm-btn sm" onclick="toast('Пост скопирован')">Скопировать</button></td></tr>
    </tbody></table></div>`;
  }

  else if(admCur==='catalog_adm'){
    el.innerHTML=`<h2>🛍 Каталог (InSales)</h2>
    <div style="display:flex;gap:8px;margin-bottom:14px;flex-wrap:wrap">
      <button class="adm-btn" onclick="toast('Импорт из МойСклад запущен')">⬆ Импорт из МойСклад</button>
      <button class="adm-btn" onclick="toast('Экспорт в CSV готов')">⬇ Экспорт CSV</button>
    </div>
    <div class="adm-table-wrap"><table class="adm-tbl"><thead><tr><th>Фото</th><th>Название</th><th>Категория</th><th>Цена</th><th>Остаток</th><th>Статус InSales</th></tr></thead><tbody>
    ${P.map(p=>`<tr>
      <td><img src="${p.img}" style="width:44px;height:44px;object-fit:contain;border:1px solid var(--border);border-radius:3px" onerror="this.style.display='none'"></td>
      <td><div class="bold" style="font-size:13px">${p.name}</div></td>
      <td style="font-size:12px;color:var(--muted)">${{fishing:'Рыболовные',gas:'Газовое',lure:'Снасти',boat:'Лодки'}[p.cat]}</td>
      <td class="bold">${fmt(p.price)}</td>
      <td style="font-weight:700;color:${p.stock<20?'var(--red)':p.stock<100?'var(--yellow)':'var(--green)'}">${p.stock}</td>
      <td><span class="stbadge st-send">✓ Опубликован</span></td>
    </tr>`).join('')}
    </tbody></table></div>`;
  }
}

function updStatus(id,status){
  const o=orders.find(x=>x.id===id);if(!o)return;
  o.status=status;
  syncLog.unshift({time:new Date().toLocaleString('ru-RU',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'}),event:`Статус заказа #${id} изменён на «${{new:'Новый',proc:'В работе',send:'Отправлен',done:'Выполнен'}[status]}»`,status:'ok'});
  toast(`Заказ #${id} → ${{new:'Новый',proc:'В работе',send:'Отправлен',done:'Выполнен'}[status]}`);
}
function syncNow(name){
  const t=new Date().toLocaleString('ru-RU',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'});
  syncLog.unshift({time:t,event:`Принудительная синхронизация: ${name}`,status:'ok'});
  toast(`${name} — синхронизация выполнена`);
  renderAdmin();
}
function syncStockNow(){
  syncLog.unshift({time:new Date().toLocaleString('ru-RU',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'}),event:'Остатки обновлены в InSales (10 товаров)',status:'ok'});
  toast('Остатки синхронизированы с InSales');
  renderAdmin();
}

// ── INIT ──────────────────────────────────────────────────────────────────
renderCatalog();
updCart();
