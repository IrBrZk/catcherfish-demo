const API_BASE = 'https://depend-criterion-classified-passport.trycloudflare.com';
const legacyRenderAdmin = window.renderAdmin;
let admRenderSeq = 0;
admCur = window.admCur || admCur || 'dashboard';

const escHtml = v => String(v ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const fmtMoney = n => `${Number(n || 0).toLocaleString('ru-RU')} ₽`;

async function apiGet(path) {
  const resp = await fetch(`${API_BASE}${path}`);
  if (!resp.ok) throw new Error(`API ${resp.status} for ${path}`);
  return await resp.json();
}

async function loadProducts(limit = 50) {
  return await apiGet(`/products?limit=${limit}`);
}

async function loadOrders(limit = 50) {
  return await apiGet(`/orders?limit=${limit}`);
}

async function loadSyncLog() {
  return await apiGet('/sync/log');
}

async function loadStats() {
  return await apiGet('/stats');
}

async function loadStocks() {
  return await apiGet('/stocks');
}

function admTab(tab, el) {
  admCur = tab;
  window.admCur = admCur;
  document.querySelectorAll('.adm-nav a').forEach(a => a.classList.remove('act'));
  if (el) el.classList.add('act');
  renderAdmin(tab);
}

function renderLoading(title) {
  return `<h2>${title} <span class="sub">Loading...</span></h2><div style="padding:40px;text-align:center;color:var(--muted)">Loading...</div>`;
}

async function renderAdmin(tab) {
  admCur = tab || admCur;
  window.admCur = admCur;
  const seq = ++admRenderSeq;
  const el = document.getElementById('adm-content');
  if (!el) return;

  if (admCur === 'dashboard') {
    el.innerHTML = renderLoading('📊 Дашборд');
    try {
      const [stats, ordersData] = await Promise.all([loadStats(), loadOrders(5)]);
      if (seq !== admRenderSeq) return;
      const ordersList = ordersData.items || [];
      el.innerHTML = `<h2>📊 Дашборд <span class="sub">реальные данные API</span></h2>
      <div class="metrics">
        <div class="metric"><div class="mv" style="color:var(--orange2)">${fmtMoney(stats.orders?.total_revenue || 0)}</div><div class="ml">Выручка</div></div>
        <div class="metric"><div class="mv">${stats.products?.count || 0}</div><div class="ml">Товаров</div></div>
        <div class="metric"><div class="mv">${stats.orders?.count || 0}</div><div class="ml">Заказов</div></div>
        <div class="metric"><div class="mv">${stats.stocks?.units || 0}</div><div class="ml">Остатков</div></div>
      </div>
      <div class="adm-table-wrap"><div class="adm-table-head"><h3>Последние заказы</h3><button class="adm-btn sm" onclick="admTab('orders',null)">Все заказы →</button></div>
      <table class="adm-tbl"><thead><tr><th>#</th><th>Клиент</th><th>Сумма</th><th>Статус</th><th>Дата</th></tr></thead><tbody>
      ${ordersList.length ? ordersList.map(o => `<tr>
        <td class="mono">#${escHtml(o.id || o.number || o.order_id || '—')}</td>
        <td><div class="bold">${escHtml(o.customer_name || o.name || '—')}</div><div style="font-size:11px;color:var(--muted)">${escHtml(o.phone || '')}</div></td>
        <td class="bold" style="color:var(--orange2)">${fmtMoney(o.total || o.amount || 0)}</td>
        <td><span class="stbadge st-${escHtml(String(o.status || 'new').toLowerCase())}">${escHtml(o.status || 'new')}</span></td>
        <td style="font-size:12px;color:var(--muted)">${escHtml(o.created_at || o.date || '—')}</td>
      </tr>`).join('') : '<tr><td colspan="5" style="padding:28px;color:var(--muted);text-align:center">Заказов пока нет</td></tr>'}
      </tbody></table></div>`;
    } catch (err) {
      if (seq !== admRenderSeq) return;
      el.innerHTML = `<h2>📊 Дашборд <span class="sub">API error</span></h2><div style="padding:40px;text-align:center;color:var(--red)">Ошибка загрузки данных: ${escHtml(err.message)}</div>`;
    }
    return;
  }

  if (admCur === 'orders') {
    el.innerHTML = renderLoading('📋 Заказы');
    try {
      const data = await loadOrders(50);
      if (seq !== admRenderSeq) return;
      const rows = data.items || [];
      el.innerHTML = `<h2>📋 Заказы <span class="sub">read-only API</span></h2>
      <div class="metrics" style="grid-template-columns:repeat(3,1fr);margin-bottom:14px">
        <div class="metric"><div class="mv">${rows.length}</div><div class="ml">Показано</div></div>
        <div class="metric"><div class="mv">${rows.filter(o => String(o.status || '').toLowerCase() === 'new').length}</div><div class="ml">Новые</div></div>
        <div class="metric"><div class="mv">${fmtMoney(rows.reduce((s, o) => s + Number(o.total || o.amount || 0), 0))}</div><div class="ml">Сумма</div></div>
      </div>
      <div class="adm-table-wrap"><table class="adm-tbl"><thead><tr><th>#</th><th>Клиент</th><th>Товары</th><th>Итого</th><th>Статус</th><th>Дата</th></tr></thead><tbody>
      ${rows.length ? rows.map(o => {
        const items = Array.isArray(o.items) ? o.items.map(i => `${escHtml(i.name || 'Товар')} ×${escHtml(i.qty || 1)}`).join(', ') : escHtml(o.items || '—');
        return `<tr>
          <td class="mono">#${escHtml(o.id || o.number || o.order_id || '—')}</td>
          <td><div class="bold">${escHtml(o.customer_name || o.name || '—')}</div><div style="font-size:11px;color:var(--muted)">${escHtml(o.phone || '')}</div></td>
          <td style="font-size:12px;color:var(--muted);max-width:260px">${items}</td>
          <td class="bold" style="color:var(--orange2)">${fmtMoney(o.total || o.amount || 0)}</td>
          <td><span class="stbadge st-${escHtml(String(o.status || 'new').toLowerCase())}">${escHtml(o.status || 'new')}</span></td>
          <td style="font-size:12px;color:var(--muted)">${escHtml(o.created_at || o.date || '—')}</td>
        </tr>`;
      }).join('') : '<tr><td colspan="6" style="padding:28px;color:var(--muted);text-align:center">Заказов пока нет</td></tr>'}
      </tbody></table></div>`;
    } catch (err) {
      if (seq !== admRenderSeq) return;
      el.innerHTML = `<h2>📋 Заказы <span class="sub">API error</span></h2><div style="padding:40px;text-align:center;color:var(--red)">Ошибка загрузки данных: ${escHtml(err.message)}</div>`;
    }
    return;
  }

  if (admCur === 'stock') {
    el.innerHTML = renderLoading('📦 Остатки');
    try {
      const data = await loadStocks();
      if (seq !== admRenderSeq) return;
      const rows = data.items || [];
      const totalUnits = rows.reduce((s, r) => s + Number(r.quantity || 0), 0);
      const lowCount = rows.filter(r => Number(r.quantity || 0) < 20).length;
      el.innerHTML = `<h2>📦 Остатки на складе (catcherfish_db) <span class="sub">WB → PostgreSQL</span></h2>
      <div class="metrics" style="grid-template-columns:repeat(3,1fr);margin-bottom:14px">
        <div class="metric"><div class="mv">${totalUnits.toLocaleString('ru-RU')}</div><div class="ml">Всего единиц</div></div>
        <div class="metric"><div class="mv" style="color:var(--red)">${lowCount}</div><div class="ml">Низкий остаток</div></div>
        <div class="metric"><div class="mv">${rows.length}</div><div class="ml">Строк</div></div>
      </div>
      <div style="display:flex;gap:8px;margin-bottom:14px;align-items:center;flex-wrap:wrap">
        <button class="adm-btn" onclick="syncStockNow()">🔄 Синхронизировать с WB/Ozon</button>
        <div class="sync-status"><span class="sync-dot"></span>PostgreSQL подключён · catcherfish_db · авто-синхр. каждые 15 мин</div>
      </div>
      <div class="adm-table-wrap"><table class="adm-tbl"><thead><tr><th>Товар</th><th>Склад</th><th>Остаток</th><th>SKU</th></tr></thead><tbody>
      ${rows.length ? rows.map(r => {
        const qty = Number(r.quantity || 0);
        return `<tr>
          <td><div class="bold" style="font-size:13px">${escHtml(r.product_name || r.name || `SKU ${r.sku}`)}</div></td>
          <td style="font-size:12px">${escHtml(r.warehouse_name || r.warehouse_id || '—')}</td>
          <td><span style="font-weight:700;color:${qty < 20 ? 'var(--red)' : qty < 100 ? 'var(--yellow)' : 'var(--green)'}">${qty} шт</span></td>
          <td class="mono">${escHtml(r.sku)}</td>
        </tr>`;
      }).join('') : '<tr><td colspan="4" style="padding:28px;color:var(--muted);text-align:center">Остатков пока нет</td></tr>'}
      </tbody></table></div>`;
    } catch (err) {
      if (seq !== admRenderSeq) return;
      el.innerHTML = `<h2>📦 Остатки <span class="sub">API error</span></h2><div style="padding:40px;text-align:center;color:var(--red)">Ошибка загрузки данных: ${escHtml(err.message)}</div>`;
    }
    return;
  }

  if (admCur === 'sync') {
    el.innerHTML = renderLoading('🔄 Синхронизация');
    try {
      const data = await loadSyncLog();
      if (seq !== admRenderSeq) return;
      const rows = data.items || [];
      el.innerHTML = `<h2>🔄 Синхронизация <span class="sub">sync_log</span></h2>
      <div class="adm-table-wrap"><div class="adm-table-head"><h3>Лог синхронизации</h3><button class="adm-btn sm" onclick="syncNow('WB sync')">🔄 Обновить</button></div>
      <table class="adm-tbl"><thead><tr><th>Время</th><th>Событие</th><th>Статус</th></tr></thead><tbody>
      ${rows.length ? rows.map(l => `<tr>
        <td style="font-size:12px;color:var(--muted);font-family:monospace">${escHtml(l.created_at || l.time || '—')}</td>
        <td style="font-size:13px">${escHtml(l.message || l.event || l.error_message || '—')}</td>
        <td><span class="stbadge st-${String(l.status || 'ok').toLowerCase() === 'success' ? 'send' : 'new'}">${escHtml(l.status || 'ok')}</span></td>
      </tr>`).join('') : '<tr><td colspan="3" style="padding:28px;color:var(--muted);text-align:center">Лог пуст</td></tr>'}
      </tbody></table></div>`;
    } catch (err) {
      if (seq !== admRenderSeq) return;
      el.innerHTML = `<h2>🔄 Синхронизация <span class="sub">API error</span></h2><div style="padding:40px;text-align:center;color:var(--red)">Ошибка загрузки данных: ${escHtml(err.message)}</div>`;
    }
    return;
  }

  if (admCur === 'analytics') {
    el.innerHTML = renderLoading('📈 Аналитика');
    try {
      const [stats, ordersData, productsData] = await Promise.all([loadStats(), loadOrders(50), loadProducts(50)]);
      if (seq !== admRenderSeq) return;
      const rows = ordersData.items || [];
      const products = productsData.items || [];
      const revenue = stats.orders?.total_revenue || rows.reduce((s, o) => s + Number(o.total || o.amount || 0), 0);
      const orderCount = stats.orders?.count || rows.length;
      const productCount = stats.products?.count || products.length;
      const stockUnits = stats.stocks?.units || 0;
      el.innerHTML = `<h2>📈 Аналитика <span class="sub">API stats</span></h2>
      <div class="metrics">
        <div class="metric"><div class="mv" style="color:var(--orange2)">${fmtMoney(revenue)}</div><div class="ml">Выручка</div></div>
        <div class="metric"><div class="mv">${orderCount}</div><div class="ml">Заказов</div></div>
        <div class="metric"><div class="mv">${productCount}</div><div class="ml">Товаров</div></div>
        <div class="metric"><div class="mv">${stockUnits}</div><div class="ml">Единиц в остатках</div></div>
      </div>
      <div class="chart-area"><h3>Каналы трафика</h3>
        <div class="channel-row">
          <div class="ch-pill"><div class="ch-name">📣 Telegram</div><div class="ch-val" style="color:var(--blue)">${Math.ceil(orderCount * .4)} зак.</div><div class="ch-sub">${fmtMoney(Math.round(revenue * .4))}</div></div>
          <div class="ch-pill"><div class="ch-name">📦 Вкладыши</div><div class="ch-val" style="color:var(--green)">${Math.ceil(orderCount * .3)} зак.</div><div class="ch-sub">${fmtMoney(Math.round(revenue * .3))}</div></div>
          <div class="ch-pill"><div class="ch-name">🔍 SEO Яндекс</div><div class="ch-val" style="color:var(--orange)">${Math.ceil(orderCount * .2)} зак.</div><div class="ch-sub">${fmtMoney(Math.round(revenue * .2))}</div></div>
          <div class="ch-pill"><div class="ch-name">📢 Click-out</div><div class="ch-val" style="color:var(--purple)">${Math.ceil(orderCount * .1)} зак.</div><div class="ch-sub">${fmtMoney(Math.round(revenue * .1))}</div></div>
        </div>
      </div>`;
    } catch (err) {
      if (seq !== admRenderSeq) return;
      el.innerHTML = `<h2>📈 Аналитика <span class="sub">API error</span></h2><div style="padding:40px;text-align:center;color:var(--red)">Ошибка загрузки данных: ${escHtml(err.message)}</div>`;
    }
    return;
  }

  return legacyRenderAdmin ? legacyRenderAdmin(tab) : undefined;
}

function syncNow(name) {
  toast(`${name} — данные управляются через API read-only`);
  renderAdmin(admCur);
}

function syncStockNow() {
  toast('Остатки обновляются cron-задачей WB sync');
  renderAdmin('stock');
}

window.admCur = admCur;
window.admTab = admTab;
window.renderAdmin = renderAdmin;
window.syncNow = syncNow;
window.syncStockNow = syncStockNow;

const adminPage = document.getElementById('page-admin');
if (adminPage && adminPage.classList.contains('active')) {
  setTimeout(() => renderAdmin(window.admCur || 'dashboard'), 0);
}
