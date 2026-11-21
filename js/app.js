/* =========================================================
   APP CONTROLLER — HUB, CLIENT MODE, AUTO STOCK, WHATSAPP,
   EDITABLE PRICES & CUSTOM PRODUCTS
   ========================================================= */

(function () {
  const STOCK_STORAGE_KEY = 'mi_centro_stock_v1';
  const SALES_STORAGE_KEY = 'mi_centro_sales_v1';
  const PRICES_STORAGE_KEY = 'mi_centro_prices_v1';
  const CUSTOM_ITEMS_KEY = 'mi_centro_custom_items_v1';

  const PAYMENT_METHODS = [
    'Mercado Pago',
    'Tarjeta de Crédito / Débito',
    'Transferencia Bancaria',
    'Efectivo',
    'Modo / QR'
  ];

  function loadJson(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return fallback;
      return JSON.parse(raw);
    } catch {
      return fallback;
    }
  }

  function saveJson(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Ignore storage errors
    }
  }

  function buildDefaultStock(customItemsBySection) {
    const map = {};
    window.HUB_SECTIONS.forEach((s) => {
      s.items.forEach((item) => {
        map[item.id] = typeof item.stock === 'number' ? item.stock : 10;
      });
      ((customItemsBySection && customItemsBySection[s.id]) || []).forEach((item) => {
        map[item.id] = typeof item.stock === 'number' ? item.stock : 10;
      });
    });
    return map;
  }

  function loadCustomItems() {
    const parsed = loadJson(CUSTOM_ITEMS_KEY, {});
    return parsed && typeof parsed === 'object' ? parsed : {};
  }

  function loadPrices() {
    const parsed = loadJson(PRICES_STORAGE_KEY, {});
    return parsed && typeof parsed === 'object' ? parsed : {};
  }

  function loadStock(customItemsBySection) {
    const defaults = buildDefaultStock(customItemsBySection);
    const parsed = loadJson(STOCK_STORAGE_KEY, null);
    if (!parsed || typeof parsed !== 'object') return defaults;
    const merged = { ...defaults };
    Object.keys(defaults).forEach((id) => {
      if (typeof parsed[id] === 'number' && parsed[id] >= 0) {
        merged[id] = Math.floor(parsed[id]);
      }
    });
    return merged;
  }

  function loadSales() {
    const parsed = loadJson(SALES_STORAGE_KEY, []);
    return Array.isArray(parsed) ? parsed : [];
  }

  const initialCustomItems = loadCustomItems();

  const state = {
    view: 'hub', // 'hub' | 'stock' | 'mujer' | 'hombre' | 'impresion3d' | 'comida' | 'objetos'
    viewport: 'desktop',
    clientMode: false,
    hubSearch: '',
    hubFilter: 'Todos',
    stockStoreFilter: 'Todas',
    stockStatusFilter: 'Todos',
    stockSearch: '',
    activeCategory: {},
    sortBy: {},
    onlyInStock: {},
    comidaDiet: 'Todos',
    selectedColors: {},
    favorites: {},
    customItems: initialCustomItems,
    priceOverrides: loadPrices(),
    stock: loadStock(initialCustomItems),
    sales: loadSales(),
    carts: {
      mujer: [],
      hombre: [],
      impresion3d: [],
      comida: [],
      objetos: []
    },
    quote3d: {
      material: 'PLA+ Mate',
      sizeCm: 14,
      infill: 25
    },
    drawerSectionId: null,
    lastSaleReceipt: null,
    activeProductId: null,
    pdpOptionIdx: 0,
    pdpQty: 1,
    pdpPayment: PAYMENT_METHODS[0],
    modalItem: null,
    modalOptionIdx: 0
  };

  const rootEl = document.getElementById('app-root');
  const navEl = document.getElementById('hub-nav');
  const navStockAlert = document.getElementById('nav-stock-alert');
  const vpSwitcherEl = document.getElementById('viewport-switcher');
  const btnClientMode = document.getElementById('btn-client-mode');
  const clientModeDock = document.getElementById('client-mode-dock');
  const clientVpSwitcher = document.getElementById('client-vp-switcher');
  const btnExitClientMode = document.getElementById('btn-exit-client-mode');
  const btnBackHub = document.getElementById('btn-back-hub');
  const btnGoHub = document.getElementById('btn-go-hub');

  const drawerBackdrop = document.getElementById('drawer-backdrop');
  const cartDrawer = document.getElementById('cart-drawer');
  const drawerTitle = document.getElementById('drawer-title');
  const drawerSubtitle = document.getElementById('drawer-subtitle');
  const drawerBody = document.getElementById('drawer-body');
  const drawerFooter = document.getElementById('drawer-footer');
  const drawerClose = document.getElementById('drawer-close');

  const modalBackdrop = document.getElementById('modal-backdrop');
  const modalContent = document.getElementById('modal-content');
  const modalClose = document.getElementById('modal-close');

  const toastContainer = document.getElementById('toast-container');

  function getSection(id) {
    return window.HUB_SECTIONS.find((s) => s.id === id);
  }

  function applyOverrides(item) {
    const override = state.priceOverrides[item.id];
    if (typeof override === 'number' && override >= 0) {
      return { ...item, price: override };
    }
    return item;
  }

  function getSectionItems(sectionId) {
    const section = getSection(sectionId);
    if (!section) return [];
    const custom = state.customItems[sectionId] || [];
    return [...section.items, ...custom].map(applyOverrides);
  }

  function findItem(sectionId, itemId) {
    return getSectionItems(sectionId).find((i) => i.id === itemId) || null;
  }

  /* ---------- Stock Helpers ---------- */
  function isTrackedItem(itemId) {
    return Object.prototype.hasOwnProperty.call(state.stock, itemId);
  }

  function getStock(itemId) {
    return isTrackedItem(itemId) ? state.stock[itemId] : 999;
  }

  function getInCart(itemId) {
    let qty = 0;
    Object.values(state.carts).forEach((list) => {
      list.forEach((entry) => {
        if (entry.id === itemId) qty += entry.qty;
      });
    });
    return qty;
  }

  function getAvailable(itemId) {
    if (!isTrackedItem(itemId)) return 999;
    return Math.max(0, state.stock[itemId] - getInCart(itemId));
  }

  function getSectionStockSummary(sectionId) {
    let totalUnits = 0;
    let lowCount = 0;
    let outCount = 0;
    getSectionItems(sectionId).forEach((item) => {
      const st = getStock(item.id);
      totalUnits += st;
      if (st === 0) outCount += 1;
      else if (st <= 3) lowCount += 1;
    });
    return { totalUnits, lowCount, outCount };
  }

  function getGlobalStockSummary() {
    let totalItems = 0;
    let totalUnits = 0;
    let lowCount = 0;
    let outCount = 0;
    window.HUB_SECTIONS.forEach((section) => {
      getSectionItems(section.id).forEach((item) => {
        totalItems += 1;
        const st = getStock(item.id);
        totalUnits += st;
        if (st === 0) outCount += 1;
        else if (st <= 3) lowCount += 1;
      });
    });
    return { totalItems, totalUnits, lowCount, outCount };
  }

  function clampCartsToStock(itemId) {
    const maxStock = getStock(itemId);
    let remaining = maxStock;
    Object.keys(state.carts).forEach((secId) => {
      const next = [];
      state.carts[secId].forEach((entry) => {
        if (entry.id !== itemId) {
          next.push(entry);
        } else if (remaining > 0) {
          const allowed = Math.min(entry.qty, remaining);
          remaining -= allowed;
          next.push({ ...entry, qty: allowed });
        }
      });
      state.carts[secId] = next;
    });
  }

  function setItemStock(itemId, newQty) {
    if (!isTrackedItem(itemId)) return;
    const clamped = Math.max(0, Math.min(999, Math.floor(Number(newQty) || 0)));
    state.stock[itemId] = clamped;
    clampCartsToStock(itemId);
    saveJson(STOCK_STORAGE_KEY, state.stock);
    updateShellControls();
    render();
  }

  function setItemPrice(itemId, newPrice) {
    const price = Math.max(0, Math.round(Number(newPrice) || 0));
    state.priceOverrides[itemId] = price;
    // Also update any matching items sitting in carts
    Object.values(state.carts).forEach((list) => {
      list.forEach((entry) => {
        if (entry.id === itemId) entry.price = price;
      });
    });
    saveJson(PRICES_STORAGE_KEY, state.priceOverrides);
    render();
  }

  function buildWhatsAppOrderUrl(sectionId, saleRecord) {
    const section = getSection(sectionId);
    if (!section || !section.about) return '#';
    const waDigits = section.about.phone.replace(/\D/g, '');
    const lines = [
      `Hola *${section.brand}*! Te paso mi pedido (#${saleRecord.code}):`,
      '',
      ...saleRecord.items.map(
        (it) => `• ${it.qty}x ${it.name}${it.meta ? ' (' + it.meta + ')' : ''} — ${window.formatPrice(it.lineTotal)}`
      ),
      '',
      `*Total:* ${window.formatPrice(saleRecord.total)}`,
      `*Forma de pago:* ${saleRecord.payment}`,
      `*Cliente / Mesa:* ${saleRecord.customer}`
    ];
    return `https://wa.me/${waDigits}?text=${encodeURIComponent(lines.join('\n'))}`;
  }

  /* ---------- Core Automatic Sale & Stock Deduction Engine ---------- */
  function completeSale(sectionId, lineItems, customerLabel, paymentLabel) {
    const section = getSection(sectionId);
    if (!section || !lineItems || lineItems.length === 0) return null;

    const neededById = {};
    for (const line of lineItems) {
      if (isTrackedItem(line.id)) {
        neededById[line.id] = (neededById[line.id] || 0) + line.qty;
      }
    }
    for (const [id, needed] of Object.entries(neededById)) {
      if (getStock(id) < needed) {
        showToast('No hay stock suficiente para completar la venta');
        return null;
      }
    }

    const soldDetails = [];
    let total = 0;

    lineItems.forEach((line) => {
      const lineTotal = line.price * line.qty;
      total += lineTotal;

      let prevStock = null;
      let newStock = null;
      if (isTrackedItem(line.id)) {
        prevStock = state.stock[line.id];
        newStock = Math.max(0, prevStock - line.qty);
        state.stock[line.id] = newStock;
      }

      soldDetails.push({
        id: line.id,
        name: line.name,
        meta: line.meta || '',
        qty: line.qty,
        unitPrice: line.price,
        lineTotal,
        prevStock,
        newStock
      });
    });

    Object.keys(neededById).forEach(clampCartsToStock);

    const now = new Date();
    const dateLabel = now.toLocaleTimeString('es-AR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    const saleRecord = {
      id: 'sale_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
      code: String(1000 + state.sales.length + 1),
      timestamp: now.toISOString(),
      dateLabel,
      sectionId: section.id,
      brand: section.brand,
      customer: (customerLabel || '').trim() || (sectionId === 'comida' ? 'Mesa Salón' : 'Cliente Mostrador'),
      payment: paymentLabel || PAYMENT_METHODS[0],
      total,
      items: soldDetails
    };

    state.sales.unshift(saleRecord);
    saveJson(STOCK_STORAGE_KEY, state.stock);
    saveJson(SALES_STORAGE_KEY, state.sales.slice(0, 60));
    updateShellControls();
    return saleRecord;
  }

  function refundSale(saleId) {
    const idx = state.sales.findIndex((s) => s.id === saleId);
    if (idx === -1) return;
    const sale = state.sales[idx];
    let restored = 0;
    sale.items.forEach((it) => {
      if (isTrackedItem(it.id)) {
        state.stock[it.id] = Math.min(999, state.stock[it.id] + it.qty);
        restored += it.qty;
      }
    });
    state.sales.splice(idx, 1);
    saveJson(STOCK_STORAGE_KEY, state.stock);
    saveJson(SALES_STORAGE_KEY, state.sales.slice(0, 60));
    updateShellControls();
    render();
    showToast(`Venta #${sale.code} anulada · Se devolvieron ${restored} u. al stock`);
  }

  const stockHelpers = {
    getSectionItems,
    getStock,
    getInCart,
    getAvailable,
    getSectionStockSummary,
    getGlobalStockSummary
  };

  function showToast(message) {
    const el = document.createElement('div');
    el.className = 'toast';
    el.textContent = message;
    toastContainer.appendChild(el);
    setTimeout(() => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(8px)';
      el.style.transition = 'all 0.2s ease';
      setTimeout(() => el.remove(), 220);
    }, 2600);
  }

  function setClientMode(enabled) {
    state.clientMode = !!enabled && state.view !== 'hub' && state.view !== 'stock';
    document.body.classList.toggle('is-client-mode', state.clientMode);
    clientModeDock.hidden = !state.clientMode;
    updateShellControls();
    render();
  }

  function navigateTo(sectionId, viewportOverride, productId) {
    const valid = sectionId === 'hub' || sectionId === 'stock' || !!getSection(sectionId);
    state.view = valid ? sectionId : 'hub';
    state.activeProductId = productId && getSection(state.view) ? productId : null;
    state.pdpOptionIdx = 0;
    state.pdpQty = 1;
    if (state.view === 'hub' || state.view === 'stock') {
      state.clientMode = false;
      document.body.classList.remove('is-client-mode');
      clientModeDock.hidden = true;
    }
    if (viewportOverride) {
      state.viewport = viewportOverride;
    } else if (state.view === 'hub' || state.view === 'stock') {
      state.viewport = 'desktop';
    }
    const targetHash = state.activeProductId
      ? `#${state.view}/${state.activeProductId}`
      : `#${state.view}`;
    if (window.location.hash !== targetHash) {
      history.pushState(null, '', targetHash);
    }
    updateShellControls();
    render();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function openProductPage(sectionId, itemId) {
    const item = findItem(sectionId, itemId);
    if (!item) return;
    navigateTo(sectionId, state.viewport, item.id);
  }

  function openStockForStore(storeId) {
    state.stockStoreFilter = storeId || 'Todas';
    state.stockStatusFilter = 'Todos';
    navigateTo('stock');
  }

  function updateShellControls() {
    navEl.querySelectorAll('.hub-nav-pill').forEach((btn) => {
      btn.classList.toggle('is-active', btn.dataset.section === state.view);
    });

    const summary = getGlobalStockSummary();
    const alerts = summary.lowCount + summary.outCount;
    if (navStockAlert) {
      navStockAlert.hidden = alerts === 0;
      navStockAlert.textContent = String(alerts);
      navStockAlert.classList.toggle('is-critical', summary.outCount > 0);
    }

    const inTemplate = state.view !== 'hub' && state.view !== 'stock';
    vpSwitcherEl.hidden = !inTemplate;
    btnClientMode.hidden = !inTemplate;
    btnBackHub.hidden = state.view === 'hub';

    vpSwitcherEl.querySelectorAll('.vp-btn').forEach((btn) => {
      btn.classList.toggle('is-active', btn.dataset.vp === state.viewport);
    });
    if (clientVpSwitcher) {
      clientVpSwitcher.querySelectorAll('.client-vp-btn').forEach((btn) => {
        btn.classList.toggle('is-active', btn.dataset.vp === state.viewport);
      });
    }
  }

  function render() {
    if (state.view === 'hub') {
      rootEl.innerHTML = window.renderHubView(state, stockHelpers);
      bindHubInputs();
    } else if (state.view === 'stock') {
      rootEl.innerHTML = window.renderStockView(state, stockHelpers);
      bindStockInputs();
    } else {
      const section = getSection(state.view);
      rootEl.innerHTML = window.renderTemplateView(section, state, stockHelpers);
      bindTemplateInputs();
    }
  }

  function bindHubInputs() {
    const searchInput = document.getElementById('hub-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        state.hubSearch = e.target.value;
        const pos = e.target.selectionStart;
        render();
        const fresh = document.getElementById('hub-search-input');
        if (fresh) {
          fresh.focus();
          fresh.setSelectionRange(pos, pos);
        }
      });
    }
  }

  function bindStockInputs() {
    const searchInput = document.getElementById('stock-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        state.stockSearch = e.target.value;
        const pos = e.target.selectionStart;
        render();
        const fresh = document.getElementById('stock-search-input');
        if (fresh) {
          fresh.focus();
          fresh.setSelectionRange(pos, pos);
        }
      });
    }

    rootEl.querySelectorAll('[data-stock-input]').forEach((input) => {
      input.addEventListener('change', (e) => {
        setItemStock(e.target.dataset.stockInput, e.target.value);
        showToast('Stock actualizado');
      });
    });

    rootEl.querySelectorAll('[data-price-input]').forEach((input) => {
      input.addEventListener('change', (e) => {
        setItemPrice(e.target.dataset.priceInput, e.target.value);
        showToast('Precio actualizado');
      });
    });
  }

  function bindTemplateInputs() {
    const sortSelect = document.getElementById('tpl-sort-select');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        state.sortBy[state.view] = e.target.value;
        render();
      });
    }

    const pdpPay = document.getElementById('pdp-payment-select');
    if (pdpPay) {
      pdpPay.addEventListener('change', (e) => {
        state.pdpPayment = e.target.value;
      });
    }

    const matEl = document.getElementById('calc-material');
    const sizeEl = document.getElementById('calc-size');
    const infillEl = document.getElementById('calc-infill');
    if (matEl && sizeEl && infillEl) {
      matEl.addEventListener('change', (e) => {
        state.quote3d.material = e.target.value;
        render();
      });
      sizeEl.addEventListener('input', (e) => {
        state.quote3d.sizeCm = Number(e.target.value);
        render();
      });
      infillEl.addEventListener('input', (e) => {
        state.quote3d.infill = Number(e.target.value);
        render();
      });
    }
  }

  function addToCart(sectionId, item, metaLabel, customPrice) {
    if (isTrackedItem(item.id) && getAvailable(item.id) <= 0) {
      showToast(`Sin stock disponible para ${item.name}`);
      return;
    }

    const list = state.carts[sectionId];
    const colorIdx = state.selectedColors[item.id] || 0;
    const color = (item.colors && item.colors[colorIdx]) || { name: 'Estándar', hex: '#888' };
    const key = `${item.id}|${color.name}|${metaLabel}`;
    const existing = list.find((entry) => entry.key === key);

    if (existing) {
      existing.qty += 1;
    } else {
      list.push({
        key,
        id: item.id,
        name: item.name,
        price: customPrice || item.price,
        colorHex: color.hex,
        artType: item.artType || 'vase',
        image: item.image || '',
        meta: `${color.name} · ${metaLabel}`,
        qty: 1
      });
    }

    render();
    showToast(`Agregado: ${item.name}`);
  }

  function openCartDrawer(sectionId, receipt) {
    state.drawerSectionId = sectionId;
    state.lastSaleReceipt = receipt || null;
    renderCartDrawer();
    drawerBackdrop.hidden = false;
    cartDrawer.classList.add('is-open');
    cartDrawer.setAttribute('aria-hidden', 'false');
  }

  function closeCartDrawer() {
    drawerBackdrop.hidden = true;
    cartDrawer.classList.remove('is-open');
    cartDrawer.setAttribute('aria-hidden', 'true');
    state.lastSaleReceipt = null;
  }

  function renderCartDrawer() {
    const sectionId = state.drawerSectionId;
    const section = getSection(sectionId);
    if (!section) return;

    drawerTitle.textContent = `${section.cartLabel} · ${section.brand}`;
    drawerSubtitle.textContent = section.sectionName;

    if (state.lastSaleReceipt) {
      const r = state.lastSaleReceipt;
      const waReceiptUrl = buildWhatsAppOrderUrl(sectionId, r);
      drawerBody.innerHTML = `
        <div class="sale-receipt">
          <div class="sale-receipt-head">
            <div class="sale-receipt-icon">✓</div>
            <h4>¡Venta #${r.code} registrada!</h4>
            <p>El stock se descontó automáticamente · ${r.dateLabel}</p>
          </div>
          <div style="font-size:0.8rem;color:#64635e;margin-bottom:10px;">
            <strong>${r.customer}</strong> · Pago: <strong>${r.payment}</strong>
          </div>
          <div class="sale-receipt-list">
            ${r.items
              .map(
                (it) => `
              <div class="sale-receipt-row">
                <div class="sale-receipt-row-top">
                  <span>${it.qty}x ${it.name}</span>
                  <span>${window.formatPrice(it.lineTotal)}</span>
                </div>
                ${
                  typeof it.prevStock === 'number'
                    ? `<span class="sale-stock-delta ${it.newStock === 0 ? 'is-out' : ''}">
                         Stock actualizado: ${it.prevStock} → ${it.newStock} u. ${it.newStock === 0 ? '(Agotado)' : ''}
                       </span>`
                    : '<span class="sale-stock-delta">Pieza a pedido</span>'
                }
              </div>`
              )
              .join('')}
          </div>
        </div>
      `;
      drawerFooter.innerHTML = `
        <div class="cart-total-row">
          <span>Total cobrado</span>
          <strong>${window.formatPrice(r.total)}</strong>
        </div>
        <div class="checkout-actions">
          <a class="btn-whatsapp" href="${waReceiptUrl}" target="_blank" rel="noopener noreferrer">
            <span>Enviar pedido por WhatsApp ↗</span>
          </a>
          <button class="btn-checkout" id="btn-receipt-go-stock">Ver stock e historial</button>
          <button class="stock-btn" style="justify-content:center;" id="btn-receipt-continue">Seguir en ${section.brand}</button>
        </div>
      `;
      return;
    }

    const list = state.carts[sectionId] || [];

    if (list.length === 0) {
      drawerBody.innerHTML = `
        <div class="cart-empty">
          <div style="font-size:2rem;opacity:0.4;">🛍️</div>
          <p>Todavía no agregaste nada en <strong>${section.brand}</strong>.</p>
        </div>
      `;
      drawerFooter.innerHTML = '';
      return;
    }

    const total = list.reduce((sum, item) => sum + item.price * item.qty, 0);

    drawerBody.innerHTML = list
      .map((entry, idx) => {
        const canInc = getAvailable(entry.id) > 0;
        const leftTxt = isTrackedItem(entry.id) ? ` · Disp: ${getAvailable(entry.id)}` : '';
        return `
          <div class="cart-item">
            <div class="cart-item-thumb">
              ${window.renderProductMedia(entry, entry.colorHex, sectionId)}
            </div>
            <div class="cart-item-info">
              <h4>${entry.name}</h4>
              <div class="cart-item-meta">${entry.meta}${leftTxt}</div>
              <div class="cart-item-price">${window.formatPrice(entry.price * entry.qty)}</div>
            </div>
            <div class="qty-control">
              <button data-cart-dec="${idx}" aria-label="Restar">−</button>
              <span>${entry.qty}</span>
              <button data-cart-inc="${idx}" aria-label="Sumar" ${canInc ? '' : 'disabled style="opacity:0.3;cursor:not-allowed;"'}>+</button>
            </div>
          </div>`;
      })
      .join('');

    drawerFooter.innerHTML = `
      <div class="checkout-form">
        <input
          type="text"
          id="checkout-customer"
          class="checkout-input"
          placeholder="${sectionId === 'comida' ? 'Mesa o nombre...' : 'Nombre del cliente...'}"
        />
        <select id="checkout-payment" class="checkout-select" aria-label="Forma de pago">
          ${PAYMENT_METHODS.map((m) => `<option value="${m}">${m}</option>`).join('')}
        </select>
      </div>
      <div class="cart-total-row">
        <span>Total a cobrar</span>
        <strong>${window.formatPrice(total)}</strong>
      </div>
      <div class="checkout-actions">
        <button class="btn-checkout" id="btn-confirm-order">
          ${sectionId === 'comida' ? 'Confirmar pedido' : 'Finalizar compra'}
        </button>
        <button class="btn-whatsapp" id="btn-confirm-whatsapp">
          <span>Enviar pedido por WhatsApp ↗</span>
        </button>
      </div>
    `;
  }

  function openQuickView(sectionId, itemId) {
    const section = getSection(sectionId);
    const item = findItem(sectionId, itemId);
    if (!section || !item) return;

    state.modalItem = { sectionId, item };
    state.modalOptionIdx = 0;
    renderQuickViewModal();
    modalBackdrop.hidden = false;
  }

  function renderQuickViewModal() {
    if (!state.modalItem) return;
    const { sectionId, item } = state.modalItem;
    const colorIdx = state.selectedColors[item.id] || 0;
    const activeColor = (item.colors && item.colors[colorIdx]) || { name: 'Estándar', hex: '#888' };
    const available = getAvailable(item.id);
    const totalStock = getStock(item.id);
    const stockMeta = window.getStockMeta(available, sectionId === 'comida');

    modalContent.innerHTML = `
      <div class="modal-grid">
        <div class="modal-art">
          ${window.renderProductMedia(item, activeColor.hex, sectionId)}
        </div>
        <div>
          <span class="modal-tag">${item.category} · ${activeColor.name}</span>
          <h3 class="modal-title">${item.name}</h3>
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:14px;">
            <div class="modal-price" style="margin-bottom:0;">${window.formatPrice(item.price)}</div>
            <span class="stock-chip ${stockMeta.cls}"><i></i>${stockMeta.label}</span>
          </div>
          <p class="modal-desc">${item.desc}</p>

          ${
            item.colors && item.colors.length > 1
              ? `
            <span class="modal-options-label">Color / Acabado</span>
            <div class="prod-swatches" style="margin-bottom:16px;">
              ${item.colors
                .map(
                  (col, idx) => `
                <button
                  class="swatch-dot ${idx === colorIdx ? 'is-active' : ''}"
                  style="background:${col.hex};color:${col.hex}"
                  title="${col.name}"
                  data-modal-color="${idx}"
                ></button>`
                )
                .join('')}
            </div>`
              : ''
          }

          <span class="modal-options-label">${item.optionsLabel || 'Opción'}</span>
          <div class="modal-chips">
            ${(item.options || ['Estándar'])
              .map(
                (opt, idx) => `
              <button class="modal-chip ${idx === state.modalOptionIdx ? 'is-selected' : ''}" data-modal-opt="${idx}">
                ${opt}
              </button>`
              )
              .join('')}
          </div>

          <div style="margin-bottom:14px;">
            <span class="modal-options-label">Forma de pago rápida</span>
            <select id="modal-payment-select" class="checkout-select">
              ${PAYMENT_METHODS.map((m) => `<option value="${m}">${m}</option>`).join('')}
            </select>
          </div>

          <div class="modal-btn-row">
            <button class="btn-checkout" id="btn-modal-add" ${available <= 0 ? 'disabled' : ''}>
              ${available <= 0 ? 'Sin stock' : '+ Al carrito'}
            </button>
            <button class="btn-buy-now" id="btn-modal-sell-now" ${totalStock <= 0 ? 'disabled' : ''}>
              ${totalStock <= 0 ? 'Agotado' : 'Comprar ahora'}
            </button>
          </div>
        </div>
      </div>
    `;
  }

  function openNewProductModal() {
    state.modalItem = null;
    const defaultStoreId =
      state.stockStoreFilter !== 'Todas' ? state.stockStoreFilter : window.HUB_SECTIONS[0].id;
    const defaultSection = getSection(defaultStoreId) || window.HUB_SECTIONS[0];
    const defaultCats = defaultSection.categories.filter((c) => c !== 'Todo');

    modalContent.innerHTML = `
      <form class="new-prod-form" id="new-product-form">
        <div>
          <span class="modal-tag">Gestor de Catálogo</span>
          <h3 class="modal-title" style="margin-bottom:4px;">Agregar Nuevo Producto</h3>
          <p class="modal-desc" style="margin-bottom:4px;">Se sumará automáticamente a la tienda elegida y al Control de Stock.</p>
        </div>

        <div class="new-prod-grid">
          <div class="form-field">
            <label for="np-store">Tienda / Sección</label>
            <select id="np-store" required>
              ${window.HUB_SECTIONS.map(
                (s) =>
                  `<option value="${s.id}" ${s.id === defaultSection.id ? 'selected' : ''}>${s.brand} (${s.sectionName})</option>`
              ).join('')}
            </select>
          </div>
          <div class="form-field">
            <label for="np-category">Categoría</label>
            <select id="np-category" required>
              ${defaultCats.map((c) => `<option value="${c}">${c}</option>`).join('')}
            </select>
          </div>
        </div>

        <div class="form-field">
          <label for="np-name">Nombre del producto o plato</label>
          <input id="np-name" type="text" required placeholder="Ej: Campera de cuero, Lámpara geométrica..." />
        </div>

        <div class="new-prod-grid">
          <div class="form-field">
            <label for="np-price">Precio ($)</label>
            <input id="np-price" type="number" min="0" step="100" required value="25000" />
          </div>
          <div class="form-field">
            <label for="np-stock">Stock inicial (unidades)</label>
            <input id="np-stock" type="number" min="0" max="999" required value="10" />
          </div>
        </div>

        <div class="form-field">
          <label for="np-desc">Descripción breve</label>
          <textarea id="np-desc" placeholder="Detalles, materiales o ingredientes..."></textarea>
        </div>

        <div class="new-prod-grid">
          <div class="form-field">
            <label for="np-img-url">URL de imagen (opcional)</label>
            <input id="np-img-url" type="url" placeholder="https://..." />
          </div>
          <div class="form-field">
            <label for="np-img-file">O subir foto desde tu PC</label>
            <input id="np-img-file" type="file" accept="image/*" />
          </div>
        </div>

        <button type="submit" class="btn-checkout">Guardar producto en la tienda</button>
      </form>
    `;

    modalBackdrop.hidden = false;

    const storeSel = document.getElementById('np-store');
    const catSel = document.getElementById('np-category');
    const fileInput = document.getElementById('np-img-file');
    let uploadedDataUrl = '';

    storeSel.addEventListener('change', () => {
      const sec = getSection(storeSel.value);
      const cats = sec ? sec.categories.filter((c) => c !== 'Todo') : ['General'];
      catSel.innerHTML = cats.map((c) => `<option value="${c}">${c}</option>`).join('');
    });

    fileInput.addEventListener('change', () => {
      const file = fileInput.files && fileInput.files[0];
      if (!file) {
        uploadedDataUrl = '';
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        uploadedDataUrl = typeof reader.result === 'string' ? reader.result : '';
      };
      reader.readAsDataURL(file);
    });

    document.getElementById('new-product-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const storeId = storeSel.value;
      const name = document.getElementById('np-name').value.trim();
      const category = catSel.value;
      const price = Math.max(0, Math.round(Number(document.getElementById('np-price').value) || 0));
      const stock = Math.max(0, Math.min(999, Math.floor(Number(document.getElementById('np-stock').value) || 0)));
      const desc =
        document.getElementById('np-desc').value.trim() ||
        'Producto agregado desde el panel de administración.';
      const imageUrl = uploadedDataUrl || document.getElementById('np-img-url').value.trim();

      if (!name) return;

      const id = 'custom_' + Date.now();
      const newItem = {
        id,
        name,
        category,
        price,
        stock,
        badge: 'Nuevo',
        artType: storeId === 'comida' ? 'dish_main' : storeId === 'impresion3d' ? 'lamp3d' : 'coat',
        image: imageUrl || '',
        desc,
        optionsLabel: storeId === 'comida' ? 'Porción' : storeId === 'impresion3d' ? 'Material' : 'Opción',
        options: storeId === 'comida' ? ['Estándar'] : ['Estándar', 'Especial'],
        colors: [{ name: 'Principal', hex: '#4B5563' }],
        diet: [],
        isCustom: true
      };

      if (!Array.isArray(state.customItems[storeId])) {
        state.customItems[storeId] = [];
      }
      state.customItems[storeId].push(newItem);
      state.stock[id] = stock;

      saveJson(CUSTOM_ITEMS_KEY, state.customItems);
      saveJson(STOCK_STORAGE_KEY, state.stock);

      closeQuickView();
      updateShellControls();
      render();
      showToast(`Producto "${name}" agregado con ${stock} u.`);
    });
  }

  function closeQuickView() {
    modalBackdrop.hidden = true;
    state.modalItem = null;
  }

  /* ---------- Cross-Tab Automatic Sync ---------- */
  window.addEventListener('storage', (e) => {
    if (
      e.key === STOCK_STORAGE_KEY ||
      e.key === SALES_STORAGE_KEY ||
      e.key === PRICES_STORAGE_KEY ||
      e.key === CUSTOM_ITEMS_KEY
    ) {
      state.customItems = loadCustomItems();
      state.priceOverrides = loadPrices();
      state.stock = loadStock(state.customItems);
      state.sales = loadSales();
      Object.keys(state.stock).forEach(clampCartsToStock);
      updateShellControls();
      render();
      if (cartDrawer.classList.contains('is-open')) {
        renderCartDrawer();
      }
    }
  });

  /* ---------- Global Delegated Event Listeners ---------- */
  btnGoHub.addEventListener('click', () => navigateTo('hub'));
  btnBackHub.addEventListener('click', () => navigateTo('hub'));
  btnClientMode.addEventListener('click', () => setClientMode(true));
  btnExitClientMode.addEventListener('click', () => setClientMode(false));

  navEl.addEventListener('click', (e) => {
    const pill = e.target.closest('.hub-nav-pill');
    if (!pill) return;
    if (pill.dataset.section === 'stock') {
      openStockForStore('Todas');
    } else {
      navigateTo(pill.dataset.section);
    }
  });

  vpSwitcherEl.addEventListener('click', (e) => {
    const btn = e.target.closest('.vp-btn');
    if (!btn) return;
    state.viewport = btn.dataset.vp;
    updateShellControls();
    render();
  });

  if (clientVpSwitcher) {
    clientVpSwitcher.addEventListener('click', (e) => {
      const btn = e.target.closest('.client-vp-btn');
      if (!btn) return;
      state.viewport = btn.dataset.vp;
      updateShellControls();
      render();
    });
  }

  rootEl.addEventListener('click', (e) => {
    if (e.target.closest('#btn-open-new-product')) {
      openNewProductModal();
      return;
    }

    const delCustomBtn = e.target.closest('[data-delete-custom]');
    if (delCustomBtn) {
      const [secId, itemId] = delCustomBtn.dataset.deleteCustom.split(':');
      if (Array.isArray(state.customItems[secId])) {
        state.customItems[secId] = state.customItems[secId].filter((i) => i.id !== itemId);
      }
      delete state.stock[itemId];
      delete state.priceOverrides[itemId];
      state.carts[secId] = (state.carts[secId] || []).filter((entry) => entry.id !== itemId);
      saveJson(CUSTOM_ITEMS_KEY, state.customItems);
      saveJson(STOCK_STORAGE_KEY, state.stock);
      saveJson(PRICES_STORAGE_KEY, state.priceOverrides);
      updateShellControls();
      render();
      showToast('Producto eliminado');
      return;
    }

    const toggleInStockBtn = e.target.closest('[data-toggle-instock]');
    if (toggleInStockBtn) {
      const secId = toggleInStockBtn.dataset.toggleInstock;
      state.onlyInStock[secId] = !state.onlyInStock[secId];
      render();
      return;
    }

    const openStockBtn = e.target.closest('[data-open-stock]');
    if (openStockBtn) {
      openStockForStore(openStockBtn.dataset.openStock);
      return;
    }

    const stockStoreBtn = e.target.closest('[data-stock-store]');
    if (stockStoreBtn) {
      state.stockStoreFilter = stockStoreBtn.dataset.stockStore;
      render();
      return;
    }

    const stockStatusBtn = e.target.closest('[data-stock-status]');
    if (stockStatusBtn) {
      state.stockStatusFilter = stockStatusBtn.dataset.stockStatus;
      render();
      return;
    }

    const quickSaleBtn = e.target.closest('[data-quick-sale]');
    if (quickSaleBtn) {
      const [secId, itemId] = quickSaleBtn.dataset.quickSale.split(':');
      const item = findItem(secId, itemId);
      if (!item) return;
      const receipt = completeSale(
        secId,
        [{ id: item.id, name: item.name, price: item.price, qty: 1 }],
        'Venta rápida',
        'Efectivo'
      );
      if (receipt) {
        const row = receipt.items[0];
        render();
        showToast(`Venta #${receipt.code}: ${item.name} (${row.prevStock} → ${row.newStock} u.)`);
      }
      return;
    }

    const refundBtn = e.target.closest('[data-refund-sale]');
    if (refundBtn) {
      refundSale(refundBtn.dataset.refundSale);
      return;
    }

    if (e.target.closest('#btn-clear-sales')) {
      state.sales = [];
      saveJson(SALES_STORAGE_KEY, state.sales);
      render();
      showToast('Historial de ventas limpiado');
      return;
    }

    const deltaBtn = e.target.closest('[data-stock-delta]');
    if (deltaBtn) {
      const [itemId, deltaStr] = deltaBtn.dataset.stockDelta.split(':');
      setItemStock(itemId, getStock(itemId) + Number(deltaStr));
      return;
    }

    const setBtn = e.target.closest('[data-stock-set]');
    if (setBtn) {
      const [itemId, valStr] = setBtn.dataset.stockSet.split(':');
      setItemStock(itemId, Number(valStr));
      showToast('Producto marcado sin stock');
      return;
    }

    if (e.target.closest('#btn-refill-alerts')) {
      let count = 0;
      Object.keys(state.stock).forEach((id) => {
        if (state.stock[id] <= 3) {
          state.stock[id] += 10;
          count += 1;
        }
      });
      saveJson(STOCK_STORAGE_KEY, state.stock);
      updateShellControls();
      render();
      showToast(
        count > 0
          ? `Se repusieron +10 unidades en ${count} productos`
          : 'No había productos bajos ni agotados'
      );
      return;
    }

    if (e.target.closest('#btn-reset-stock')) {
      state.priceOverrides = {};
      state.stock = buildDefaultStock(state.customItems);
      Object.keys(state.stock).forEach(clampCartsToStock);
      saveJson(PRICES_STORAGE_KEY, state.priceOverrides);
      saveJson(STOCK_STORAGE_KEY, state.stock);
      updateShellControls();
      render();
      showToast('Stock y precios restablecidos a sus valores iniciales');
      return;
    }

    const filterBtn = e.target.closest('[data-hub-filter]');
    if (filterBtn) {
      state.hubFilter = filterBtn.dataset.hubFilter;
      render();
      return;
    }

    const openSec = e.target.closest('[data-open-section]');
    if (openSec) {
      navigateTo(openSec.dataset.openSection, 'desktop');
      return;
    }

    const openMob = e.target.closest('[data-open-mobile]');
    if (openMob) {
      navigateTo(openMob.dataset.openMobile, 'mobile');
      return;
    }

    const catBtn = e.target.closest('[data-tpl-cat]');
    if (catBtn) {
      state.activeCategory[state.view] = catBtn.dataset.tplCat;
      render();
      return;
    }

    const dietBtn = e.target.closest('[data-comida-diet]');
    if (dietBtn) {
      state.comidaDiet = dietBtn.dataset.comidaDiet;
      render();
      return;
    }

    const swatchBtn = e.target.closest('[data-pick-color]');
    if (swatchBtn) {
      const [itemId, idx] = swatchBtn.dataset.pickColor.split(':');
      state.selectedColors[itemId] = Number(idx);
      render();
      return;
    }

    const favBtn = e.target.closest('[data-toggle-fav]');
    if (favBtn) {
      e.stopPropagation();
      const id = favBtn.dataset.toggleFav;
      state.favorites[id] = !state.favorites[id];
      render();
      showToast(state.favorites[id] ? 'Guardado en favoritos' : 'Quitado de favoritos');
      return;
    }

    const quickAdd = e.target.closest('[data-quick-add]');
    if (quickAdd) {
      const item = findItem(state.view, quickAdd.dataset.quickAdd);
      if (item) addToCart(state.view, item, (item.options && item.options[0]) || 'Estándar');
      return;
    }

    const quickView = e.target.closest('[data-quick-view]');
    if (quickView) {
      openProductPage(state.view, quickView.dataset.quickView);
      return;
    }

    if (e.target.closest('[data-back-catalog]')) {
      navigateTo(state.view, state.viewport, null);
      return;
    }

    const pdpOptBtn = e.target.closest('[data-pdp-opt]');
    if (pdpOptBtn) {
      state.pdpOptionIdx = Number(pdpOptBtn.dataset.pdpOpt);
      render();
      return;
    }

    const pdpQtyBtn = e.target.closest('[data-pdp-qty]');
    if (pdpQtyBtn && state.activeProductId) {
      const avail = getAvailable(state.activeProductId);
      const nextQty = state.pdpQty + Number(pdpQtyBtn.dataset.pdpQty);
      state.pdpQty = Math.max(1, Math.min(Math.max(1, avail), nextQty));
      render();
      return;
    }

    if (e.target.closest('#btn-pdp-add') && state.activeProductId) {
      const item = findItem(state.view, state.activeProductId);
      if (!item) return;
      const avail = getAvailable(item.id);
      const qtyToAdd = Math.min(state.pdpQty, avail);
      if (qtyToAdd <= 0) {
        showToast('Sin stock disponible');
        return;
      }
      const optLabel = (item.options && item.options[state.pdpOptionIdx]) || 'Estándar';
      for (let i = 0; i < qtyToAdd; i += 1) {
        addToCart(state.view, item, optLabel);
      }
      state.pdpQty = 1;
      render();
      return;
    }

    if (e.target.closest('#btn-pdp-buy-now') && state.activeProductId) {
      const item = findItem(state.view, state.activeProductId);
      if (!item) return;
      const avail = getAvailable(item.id);
      const qtyToBuy = Math.min(state.pdpQty, avail);
      if (qtyToBuy <= 0) {
        showToast('Sin stock disponible');
        return;
      }
      const optLabel = (item.options && item.options[state.pdpOptionIdx]) || 'Estándar';
      const colorIdx = state.selectedColors[item.id] || 0;
      const color = (item.colors && item.colors[colorIdx]) || { name: 'Estándar' };
      const payEl = document.getElementById('pdp-payment-select');
      const payment = payEl ? payEl.value : state.pdpPayment;
      const receipt = completeSale(
        state.view,
        [
          {
            id: item.id,
            name: item.name,
            price: item.price,
            qty: qtyToBuy,
            meta: `${color.name} · ${optLabel}`
          }
        ],
        state.view === 'comida' ? 'Pedido directo' : 'Compra directa',
        payment
      );
      if (receipt) {
        state.pdpQty = 1;
        render();
        openCartDrawer(state.view, receipt);
        showToast(`¡Venta #${receipt.code} realizada! Stock descontado automáticamente`);
      }
      return;
    }

    const openCart = e.target.closest('[data-open-cart]');
    if (openCart) {
      openCartDrawer(openCart.dataset.openCart);
      return;
    }

    const addCustom3d = e.target.closest('#btn-add-custom-3d');
    if (addCustom3d) {
      const price = Number(addCustom3d.dataset.price);
      const q = state.quote3d;
      const customItem = {
        id: 'custom3d_' + Date.now(),
        name: `Impresión 3D a medida (${q.sizeCm}cm)`,
        price,
        artType: 'figure3d',
        colors: [{ name: q.material, hex: '#22D3EE' }]
      };
      addToCart('impresion3d', customItem, `Relleno ${q.infill}%`, price);
      return;
    }

    if (e.target.closest('[data-scroll-catalog]')) {
      e.preventDefault();
      if (state.activeProductId) {
        navigateTo(state.view, state.viewport, null);
      } else {
        const el = document.getElementById('tpl-catalog-anchor');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }

    if (e.target.closest('[data-scroll-calc]')) {
      e.preventDefault();
      if (state.activeProductId) {
        state.activeProductId = null;
        render();
      }
      const el = document.getElementById('tpl-calc-anchor');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    if (e.target.closest('[data-scroll-info]')) {
      e.preventDefault();
      const el = document.getElementById('tpl-info-anchor');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  });

  /* Drawer Events */
  drawerClose.addEventListener('click', closeCartDrawer);
  drawerBackdrop.addEventListener('click', closeCartDrawer);

  cartDrawer.addEventListener('click', (e) => {
    if (e.target.closest('#btn-receipt-go-stock')) {
      const secId = state.drawerSectionId;
      closeCartDrawer();
      openStockForStore(secId);
      return;
    }

    if (e.target.closest('#btn-receipt-continue')) {
      closeCartDrawer();
      return;
    }

    const inc = e.target.closest('[data-cart-inc]');
    const dec = e.target.closest('[data-cart-dec]');
    const confirmBtn = e.target.closest('#btn-confirm-order');
    const confirmWaBtn = e.target.closest('#btn-confirm-whatsapp');
    const list = state.carts[state.drawerSectionId];
    if (!list) return;

    if (inc) {
      const entry = list[Number(inc.dataset.cartInc)];
      if (getAvailable(entry.id) <= 0) {
        showToast('No hay más stock disponible de este producto');
        return;
      }
      entry.qty += 1;
      renderCartDrawer();
      render();
    } else if (dec) {
      const idx = Number(dec.dataset.cartDec);
      list[idx].qty -= 1;
      if (list[idx].qty <= 0) list.splice(idx, 1);
      renderCartDrawer();
      render();
    } else if (confirmBtn || confirmWaBtn) {
      const customerInput = document.getElementById('checkout-customer');
      const paymentSelect = document.getElementById('checkout-payment');
      const secId = state.drawerSectionId;
      const receipt = completeSale(
        secId,
        list,
        customerInput ? customerInput.value : '',
        paymentSelect ? paymentSelect.value : PAYMENT_METHODS[0]
      );
      if (receipt) {
        state.carts[secId] = [];
        state.lastSaleReceipt = receipt;
        renderCartDrawer();
        render();
        showToast(`¡Venta #${receipt.code} confirmada! Stock actualizado automáticamente`);
        if (confirmWaBtn) {
          window.open(buildWhatsAppOrderUrl(secId, receipt), '_blank', 'noopener,noreferrer');
        }
      }
    }
  });

  /* Modal Events */
  modalClose.addEventListener('click', closeQuickView);
  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) closeQuickView();
  });

  modalContent.addEventListener('click', (e) => {
    if (!state.modalItem) return;
    const optBtn = e.target.closest('[data-modal-opt]');
    const colBtn = e.target.closest('[data-modal-color]');
    const addBtn = e.target.closest('#btn-modal-add');
    const sellNowBtn = e.target.closest('#btn-modal-sell-now');

    if (optBtn) {
      state.modalOptionIdx = Number(optBtn.dataset.modalOpt);
      renderQuickViewModal();
    } else if (colBtn) {
      state.selectedColors[state.modalItem.item.id] = Number(colBtn.dataset.modalColor);
      renderQuickViewModal();
      render();
    } else if (addBtn) {
      const { sectionId, item } = state.modalItem;
      addToCart(sectionId, item, (item.options && item.options[state.modalOptionIdx]) || 'Estándar');
      closeQuickView();
    } else if (sellNowBtn) {
      const { sectionId, item } = state.modalItem;
      const payEl = document.getElementById('modal-payment-select');
      const payment = payEl ? payEl.value : PAYMENT_METHODS[0];
      const receipt = completeSale(
        sectionId,
        [{ id: item.id, name: item.name, price: item.price, qty: 1, meta: (item.options && item.options[state.modalOptionIdx]) || '' }],
        sectionId === 'comida' ? 'Pedido directo' : 'Compra directa',
        payment
      );
      if (receipt) {
        closeQuickView();
        render();
        openCartDrawer(sectionId, receipt);
        showToast(`¡Venta #${receipt.code} realizada! Stock descontado automáticamente`);
      }
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (!modalBackdrop.hidden) {
        closeQuickView();
      } else if (cartDrawer.classList.contains('is-open')) {
        closeCartDrawer();
      } else if (state.clientMode) {
        setClientMode(false);
      }
    }
  });

  /* Sync with browser back/forward buttons */
  function syncFromHash() {
    const raw = window.location.hash.replace(/^#/, '');
    const [sec, prodId] = raw.split('/');
    const valid = sec === 'hub' || sec === 'stock' || !!getSection(sec);
    state.view = valid ? sec : 'hub';
    state.activeProductId = prodId && findItem(state.view, prodId) ? prodId : null;
    state.pdpOptionIdx = 0;
    state.pdpQty = 1;
    updateShellControls();
    render();
  }

  window.addEventListener('hashchange', syncFromHash);
  syncFromHash();
})();
