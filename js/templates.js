/* =========================================================
   TEMPLATE, HUB & STOCK CONTROL RENDERERS
   ========================================================= */

window.formatPrice = function formatPrice(amount) {
  return '$' + Number(amount).toLocaleString('es-AR');
};

window.getStockMeta = function getStockMeta(available, isFood) {
  const unit = isFood ? 'porc.' : 'u.';
  if (available <= 0) {
    return { cls: 'is-out', label: 'Agotado', shortLabel: 'Sin stock' };
  }
  if (available <= 3) {
    return {
      cls: 'is-low',
      label: `¡Últimas ${available} ${unit}!`,
      shortLabel: `Quedan ${available}`
    };
  }
  return {
    cls: 'is-ok',
    label: `En stock (${available} ${unit})`,
    shortLabel: `${available} ${unit}`
  };
};

window.renderHubView = function renderHubView(state, helpers) {
  const sections = window.HUB_SECTIONS;
  const query = state.hubSearch.trim().toLowerCase();
  const cat = state.hubFilter;

  const filtered = sections.filter((s) => {
    const matchCat = cat === 'Todos' || s.hubCategory === cat;
    const matchQuery =
      !query ||
      s.sectionName.toLowerCase().includes(query) ||
      s.brand.toLowerCase().includes(query) ||
      s.description.toLowerCase().includes(query) ||
      s.features.some((f) => f.toLowerCase().includes(query));
    return matchCat && matchQuery;
  });

  const summary = helpers.getGlobalStockSummary();
  const totalCartItems = Object.values(state.carts).reduce(
    (sum, list) => sum + list.reduce((a, b) => a + b.qty, 0),
    0
  );

  const hubCategories = ['Todos', 'Moda', 'Tecnología', 'Gastronomía', 'Diseño'];

  return `
    <section class="hub-page">
      <div class="hub-hero">
        <div class="hub-hero-copy">
          <div class="hub-eyebrow">
            <span class="hub-eyebrow-dot"></span>
            <span>Centro de Control · 5 Modelos + Stock y Ventas en Vivo</span>
          </div>
          <h1 class="hub-title">Tu Centro de Páginas Web</h1>
          <p class="hub-subtitle">
            Elegí qué modelo querés mostrarle a un cliente, activá <strong>Vista Cliente</strong> para pantalla completa o administrá productos, precios, stock y ventas desde un solo lugar.
          </p>
        </div>
        <div class="hub-stats-row">
          <div class="hub-stat-chip">
            <strong>${summary.totalUnits}</strong>
            <span>Unidades en stock</span>
          </div>
          <div class="hub-stat-chip" style="cursor:pointer;" data-open-stock="Todas">
            <strong style="color:${summary.outCount > 0 ? '#b91c1c' : summary.lowCount > 0 ? '#b45309' : '#15803d'}">
              ${summary.lowCount + summary.outCount}
            </strong>
            <span>Alertas de stock</span>
          </div>
          <div class="hub-stat-chip" style="cursor:pointer;" data-open-stock="Todas">
            <strong style="color:#15803d">${state.sales.length}</strong>
            <span>Ventas registradas</span>
          </div>
          <div class="hub-stat-chip">
            <strong>${totalCartItems}</strong>
            <span>En carritos activos</span>
          </div>
        </div>
      </div>

      <div class="hub-toolbar">
        <div class="hub-search-box">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="search"
            id="hub-search-input"
            class="hub-search-input"
            placeholder="Buscar sección (ropa, 3D, comida, objetos)..."
            value="${state.hubSearch.replace(/"/g, '&quot;')}"
          />
        </div>
        <div class="hub-filter-group">
          ${hubCategories
            .map(
              (c) => `
            <button class="hub-filter-chip ${cat === c ? 'is-active' : ''}" data-hub-filter="${c}">
              ${c}
            </button>`
            )
            .join('')}
        </div>
      </div>

      <div class="hub-grid">
        ${
          filtered.length === 0
            ? `<div style="grid-column:span 12;text-align:center;padding:56px 20px;color:#64635e;">
                 No se encontraron secciones para "<strong>${state.hubSearch}</strong>".
               </div>`
            : filtered
                .map((s) => {
                  const cartCount = (state.carts[s.id] || []).reduce((a, b) => a + b.qty, 0);
                  const st = helpers.getSectionStockSummary(s.id);
                  const alertBits = [];
                  if (st.outCount > 0) alertBits.push(`<span style="color:#b91c1c;font-weight:600;">${st.outCount} agotado${st.outCount > 1 ? 's' : ''}</span>`);
                  if (st.lowCount > 0) alertBits.push(`<span style="color:#b45309;font-weight:600;">${st.lowCount} poco stock</span>`);

                  return `
                    <article class="section-card ${s.featured && filtered.length >= 4 ? 'is-featured' : ''}">
                      <div class="section-card-preview" data-open-section="${s.id}">
                        <img src="${s.heroImage}" alt="${s.sectionName} — ${s.brand}" loading="lazy" />
                        <div class="preview-browser-bar">
                          <span class="preview-dots"><i></i><i></i><i></i></span>
                          <span class="preview-badge">${s.badge}</span>
                        </div>
                        ${
                          cartCount > 0
                            ? `<span class="preview-cart-pill">${cartCount} en ${s.cartLabel.toLowerCase()}</span>`
                            : ''
                        }
                      </div>
                      <div class="section-card-body">
                        <div class="section-card-head">
                          <div>
                            <div class="section-card-label">${s.sectionName}</div>
                            <h2 class="section-card-title">${s.brand}</h2>
                          </div>
                          <div class="palette-swatches" title="Paleta del diseño">
                            ${s.palette.map((hex) => `<span style="background:${hex}"></span>`).join('')}
                          </div>
                        </div>
                        <p class="section-card-desc">${s.description}</p>

                        <div class="section-stock-summary">
                          <span>
                            Stock: <strong>${st.totalUnits} u.</strong>
                            ${alertBits.length ? ' · ' + alertBits.join(' · ') : ' · <span style="color:#15803d;font-weight:600;">Todo disponible</span>'}
                          </span>
                          <button class="section-stock-link" data-open-stock="${s.id}">Ajustar</button>
                        </div>

                        <div class="section-feature-tags">
                          ${s.features.map((f) => `<span>${f}</span>`).join('')}
                        </div>
                        <div class="section-card-actions">
                          <button class="btn-open-model" data-open-section="${s.id}">
                            <span>Abrir página</span>
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                          </button>
                        </div>
                      </div>
                    </article>
                  `;
                })
                .join('')
        }
      </div>
    </section>
  `;
};

window.renderStockView = function renderStockView(state, helpers) {
  const summary = helpers.getGlobalStockSummary();
  const filterStore = state.stockStoreFilter;
  const filterStatus = state.stockStatusFilter;
  const query = state.stockSearch.trim().toLowerCase();

  const allRows = [];
  window.HUB_SECTIONS.forEach((section) => {
    helpers.getSectionItems(section.id).forEach((item) => {
      const total = helpers.getStock(item.id);
      const inCart = helpers.getInCart(item.id);
      const available = Math.max(0, total - inCart);
      const status = total === 0 ? 'out' : total <= 3 ? 'low' : 'ok';
      allRows.push({ section, item, total, inCart, available, status });
    });
  });

  const filtered = allRows.filter((row) => {
    const matchStore = filterStore === 'Todas' || row.section.id === filterStore;
    const matchStatus =
      filterStatus === 'Todos' ||
      (filterStatus === 'Disponible' && row.status === 'ok') ||
      (filterStatus === 'Poco stock' && row.status === 'low') ||
      (filterStatus === 'Agotado' && row.status === 'out');
    const matchQuery =
      !query ||
      row.item.name.toLowerCase().includes(query) ||
      row.item.category.toLowerCase().includes(query) ||
      row.section.brand.toLowerCase().includes(query) ||
      row.section.sectionName.toLowerCase().includes(query);
    return matchStore && matchStatus && matchQuery;
  });

  const storeOptions = [
    { id: 'Todas', label: 'Todas las tiendas' },
    ...window.HUB_SECTIONS.map((s) => ({ id: s.id, label: s.brand }))
  ];

  const statusOptions = ['Todos', 'Disponible', 'Poco stock', 'Agotado'];
  const totalRevenue = state.sales.reduce((sum, sale) => sum + sale.total, 0);
  const filteredSales =
    filterStore === 'Todas'
      ? state.sales
      : state.sales.filter((sale) => sale.sectionId === filterStore);

  return `
    <section class="stock-page">
      <div class="stock-header">
        <div>
          <div class="hub-eyebrow">
            <span class="hub-eyebrow-dot"></span>
            <span>Catálogo Editable · Stock Automático · Sincronizado entre Pestañas</span>
          </div>
          <h1 class="hub-title" style="margin-bottom:6px;">Control de Stock y Ventas</h1>
          <p class="hub-subtitle">
            Agregá productos nuevos, editá precios y stock en vivo, y seguí cada venta con descuento automático de unidades.
          </p>
        </div>
        <div class="stock-header-actions">
          <button class="stock-btn stock-btn-primary" id="btn-open-new-product">
            + Nuevo producto
          </button>
          <button class="stock-btn" id="btn-refill-alerts">
            + Reponer bajos (+10)
          </button>
          <button class="stock-btn" id="btn-reset-stock">
            Restablecer todo
          </button>
        </div>
      </div>

      <div class="stock-kpis">
        <div class="stock-kpi is-ok">
          <span>Unidades en inventario</span>
          <strong>${summary.totalUnits}</strong>
        </div>
        <div class="stock-kpi is-warn">
          <span>Poco stock (1 a 3 u.)</span>
          <strong>${summary.lowCount}</strong>
        </div>
        <div class="stock-kpi is-danger">
          <span>Agotados (0 u.)</span>
          <strong>${summary.outCount}</strong>
        </div>
        <div class="stock-kpi is-ok">
          <span>Ventas (${state.sales.length}) · Facturado</span>
          <strong>${window.formatPrice(totalRevenue)}</strong>
        </div>
      </div>

      <div class="hub-toolbar" style="margin-bottom:14px;">
        <div class="hub-search-box">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="search"
            id="stock-search-input"
            class="hub-search-input"
            placeholder="Buscar producto, plato o tienda..."
            value="${state.stockSearch.replace(/"/g, '&quot;')}"
          />
        </div>
        <div class="hub-filter-group">
          ${storeOptions
            .map(
              (opt) => `
            <button class="hub-filter-chip ${filterStore === opt.id ? 'is-active' : ''}" data-stock-store="${opt.id}">
              ${opt.label}
            </button>`
            )
            .join('')}
        </div>
      </div>

      <div class="hub-filter-group" style="margin-bottom:20px;">
        ${statusOptions
          .map(
            (st) => `
          <button class="hub-filter-chip ${filterStatus === st ? 'is-active' : ''}" data-stock-status="${st}">
            ${st}
          </button>`
          )
          .join('')}
      </div>

      <div class="stock-table-wrap">
        <table class="stock-table">
          <thead>
            <tr>
              <th>Producto / Plato</th>
              <th>Sección</th>
              <th>Precio editable</th>
              <th>Estado</th>
              <th>Stock actual</th>
              <th>Acciones rápidas</th>
            </tr>
          </thead>
          <tbody>
            ${
              filtered.length === 0
                ? `<tr><td colspan="6" style="text-align:center;padding:40px;color:#64635e;">No hay productos que coincidan con los filtros actuales.</td></tr>`
                : filtered
                    .map((row) => {
                      const statusText =
                        row.status === 'out'
                          ? 'Agotado'
                          : row.status === 'low'
                          ? 'Poco stock'
                          : 'Disponible';
                      const rowCls =
                        row.status === 'out' ? 'row-out' : row.status === 'low' ? 'row-low' : '';
                      const thumbHtml = row.item.image
                        ? `<img class="stock-thumb" src="${row.item.image}" alt="${row.item.name}" loading="lazy" />`
                        : `<div class="stock-thumb">${window.renderItemArtwork(row.item.artType || 'vase', (row.item.colors && row.item.colors[0] && row.item.colors[0].hex) || '#888', row.section.id)}</div>`;

                      return `
                        <tr class="${rowCls}">
                          <td>
                            <div class="stock-prod-cell">
                              ${thumbHtml}
                              <div>
                                <div class="stock-prod-name">${row.item.name}</div>
                                <div class="stock-prod-cat">
                                  ${row.item.category}
                                  ${row.item.isCustom ? ' · <span style="color:#15803d;font-weight:600;">Creado</span>' : ''}
                                  ${row.inCart > 0 ? ` · <strong style="color:#161614;">${row.inCart} en carrito</strong>` : ''}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <button class="stock-store-pill" style="border:none;cursor:pointer;" data-open-section="${row.section.id}" title="Ir a ${row.section.brand}">
                              <span class="pill-dot" style="background:${row.section.palette[2] || row.section.palette[0]}"></span>
                              <span>${row.section.brand}</span>
                            </button>
                          </td>
                          <td>
                            <div class="stock-price-wrap">
                              <span>$</span>
                              <input
                                type="number"
                                min="0"
                                step="100"
                                class="stock-price-input"
                                data-price-input="${row.item.id}"
                                value="${row.item.price}"
                                aria-label="Precio de ${row.item.name}"
                              />
                            </div>
                          </td>
                          <td>
                            <span class="stock-status-pill is-${row.status}">${statusText}</span>
                          </td>
                          <td>
                            <div class="stock-stepper">
                              <button class="stock-step-btn" data-stock-delta="${row.item.id}:-1" aria-label="Restar 1">−</button>
                              <input
                                type="number"
                                min="0"
                                max="999"
                                class="stock-num-input"
                                data-stock-input="${row.item.id}"
                                value="${row.total}"
                                aria-label="Stock de ${row.item.name}"
                              />
                              <button class="stock-step-btn" data-stock-delta="${row.item.id}:1" aria-label="Sumar 1">+</button>
                            </div>
                          </td>
                          <td>
                            <div class="stock-quick-actions">
                              <button class="stock-mini-btn" data-quick-sale="${row.section.id}:${row.item.id}" ${row.total <= 0 ? 'disabled style="opacity:0.4;cursor:not-allowed;"' : ''} title="Simular venta directa de 1 unidad">Vender 1</button>
                              <button class="stock-mini-btn" data-stock-delta="${row.item.id}:5">+5</button>
                              <button class="stock-mini-btn is-danger" data-stock-set="${row.item.id}:0">Agotar</button>
                              ${
                                row.item.isCustom
                                  ? `<button class="stock-mini-btn is-danger" data-delete-custom="${row.section.id}:${row.item.id}" title="Eliminar producto creado">✕</button>`
                                  : ''
                              }
                            </div>
                          </td>
                        </tr>
                      `;
                    })
                    .join('')
            }
          </tbody>
        </table>
      </div>

      <div class="sales-history-section">
        <div class="sales-history-head">
          <div>
            <h2>Historial de Ventas y Descuentos Automáticos</h2>
            <p style="margin:4px 0 0;font-size:0.86rem;color:#64635e;">
              Cada compra confirmada en cualquier tienda registra aquí el descuento automático de stock.
            </p>
          </div>
          ${
            state.sales.length > 0
              ? '<button class="stock-btn" id="btn-clear-sales">Limpiar historial</button>'
              : ''
          }
        </div>

        ${
          filteredSales.length === 0
            ? `<div class="sale-log-card" style="text-align:center;padding:32px;color:#64635e;">
                 Todavía no hay ventas registradas${filterStore !== 'Todas' ? ' en esta tienda' : ''}. Probá comprando en cualquiera de las 5 páginas o tocando <strong>"Vender 1"</strong> en la tabla de arriba.
               </div>`
            : `<div class="sales-history-list">
                ${filteredSales
                  .map(
                    (sale) => `
                  <article class="sale-log-card">
                    <div class="sale-log-top">
                      <div>
                        <span class="stock-store-pill">${sale.brand}</span>
                        <div class="sale-log-meta">
                          ${sale.dateLabel} · ${sale.customer} · ${sale.payment}
                        </div>
                      </div>
                      <div class="sale-log-total">${window.formatPrice(sale.total)}</div>
                    </div>
                    <div class="sale-log-items">
                      ${sale.items
                        .map(
                          (it) => `
                        <div class="sale-log-item">
                          <span><strong>${it.qty}x</strong> ${it.name}</span>
                          ${
                            typeof it.prevStock === 'number'
                              ? `<span class="sale-stock-delta ${it.newStock === 0 ? 'is-out' : ''}">
                                   Stock: ${it.prevStock} → ${it.newStock} u.
                                 </span>`
                              : '<span class="sale-stock-delta">A pedido</span>'
                          }
                        </div>`
                        )
                        .join('')}
                    </div>
                    <div class="sale-log-foot">
                      <span>Venta #${sale.code}</span>
                      <button class="stock-mini-btn is-danger" data-refund-sale="${sale.id}">
                        Anular y devolver stock
                      </button>
                    </div>
                  </article>
                `
                  )
                  .join('')}
               </div>`
        }
      </div>
    </section>
  `;
};

window.renderContactRows = function renderContactRows(section) {
  const a = section.about;
  const waDigits = a.phone.replace(/\D/g, '');
  const waUrl = `https://wa.me/${waDigits}?text=${encodeURIComponent('Hola ' + section.brand + '! Quería hacer una consulta.')}`;
  const igUser = a.instagram.replace(/^@/, '').trim();
  const igUrl = `https://www.instagram.com/${igUser}/`;
  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(a.email)}&su=${encodeURIComponent('Consulta - ' + section.brand)}`;
  const mapsQuery = a.location.split('·')[0].trim() + ', ' + section.brand;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapsQuery)}`;

  return `
    <div class="tpl-contact-list">
      <div class="contact-row">
        <div class="contact-row-left">
          <span class="contact-icon" aria-hidden="true">📍</span>
          <div>
            <span class="contact-label">Ubicación / Google Maps</span>
            <span class="contact-val">${a.location}</span>
          </div>
        </div>
        <a class="contact-action-link" href="${mapsUrl}" target="_blank" rel="noopener noreferrer">
          <span>Abrir en Maps</span>
          <span aria-hidden="true">↗</span>
        </a>
      </div>
      <div class="contact-row">
        <div class="contact-row-left">
          <span class="contact-icon" aria-hidden="true">📞</span>
          <div>
            <span class="contact-label">Número / WhatsApp</span>
            <span class="contact-val">${a.phone}</span>
          </div>
        </div>
        <a class="contact-action-link" href="${waUrl}" target="_blank" rel="noopener noreferrer">
          <span>Ir a WhatsApp</span>
          <span aria-hidden="true">↗</span>
        </a>
      </div>
      <div class="contact-row">
        <div class="contact-row-left">
          <span class="contact-icon" aria-hidden="true">📸</span>
          <div>
            <span class="contact-label">Instagram</span>
            <span class="contact-val">${a.instagram}</span>
          </div>
        </div>
        <a class="contact-action-link" href="${igUrl}" target="_blank" rel="noopener noreferrer">
          <span>Ir a Instagram</span>
          <span aria-hidden="true">↗</span>
        </a>
      </div>
      <div class="contact-row">
        <div class="contact-row-left">
          <span class="contact-icon" aria-hidden="true">✉️</span>
          <div>
            <span class="contact-label">Gmail</span>
            <span class="contact-val">${a.email}</span>
          </div>
        </div>
        <a class="contact-action-link" href="${gmailUrl}" target="_blank" rel="noopener noreferrer">
          <span>Enviar Gmail</span>
          <span aria-hidden="true">↗</span>
        </a>
      </div>
    </div>
  `;
};

window.renderTemplateView = function renderTemplateView(section, state, helpers) {
  const themeClassMap = {
    mujer: 'theme-mujer',
    hombre: 'theme-hombre',
    impresion3d: 'theme-3d',
    comida: 'theme-comida',
    objetos: 'theme-objetos'
  };

  const activeCat = state.activeCategory[section.id] || 'Todo';
  const activeDiet = state.comidaDiet || 'Todos';
  const sortMode = state.sortBy[section.id] || 'featured';
  const onlyInStock = !!state.onlyInStock[section.id];
  const cartCount = (state.carts[section.id] || []).reduce((sum, item) => sum + item.qty, 0);
  const secStock = helpers.getSectionStockSummary(section.id);

  let items = helpers.getSectionItems(section.id).filter(
    (item) => activeCat === 'Todo' || item.category === activeCat
  );

  if (section.id === 'comida' && activeDiet !== 'Todos') {
    items = items.filter((item) => (item.diet || []).includes(activeDiet));
  }

  if (onlyInStock) {
    items = items.filter((item) => helpers.getAvailable(item.id) > 0);
  }

  if (sortMode === 'price-asc') {
    items = [...items].sort((a, b) => a.price - b.price);
  } else if (sortMode === 'price-desc') {
    items = [...items].sort((a, b) => b.price - a.price);
  }

  const activeProduct = state.activeProductId
    ? helpers.getSectionItems(section.id).find((i) => i.id === state.activeProductId)
    : null;

  const headerInner = `
    <div class="tpl-container">
      <div class="tpl-header">
        <div class="tpl-logo" style="cursor:pointer;" data-back-catalog title="Volver al inicio de ${section.brand}">${section.brand}</div>
        <div class="tpl-links">
          <a href="#catalogo" data-scroll-catalog>Catálogo</a>
          ${section.id === 'impresion3d' ? '<a href="#cotizador" data-scroll-calc>Cotizador 3D</a>' : ''}
          ${section.id === 'comida' ? '<span class="open-pill">● Abierto ahora</span>' : ''}
          <a href="#nosotros" data-scroll-info>Nosotros</a>
        </div>
        <div class="tpl-header-actions">
          <button class="tpl-mobile-about-btn" data-scroll-info>Nosotros</button>
          <button class="tpl-stock-btn" data-open-stock="${section.id}" title="Controlar stock de ${section.brand}">
            <span>Stock (${secStock.totalUnits})</span>
          </button>
          <button class="tpl-cart-btn" data-open-cart="${section.id}">
            <span>${section.cartLabel}</span>
            <span class="tpl-cart-count">${cartCount}</span>
          </button>
        </div>
      </div>
    </div>
  `;

  const mainBodyMarkup = activeProduct
    ? renderProductDetailPage(section, activeProduct, state, helpers)
    : `
            <section class="tpl-hero">
              <img class="tpl-hero-bg" src="${section.heroImage}" alt="${section.brand}" />
              <div class="tpl-hero-overlay"></div>
              <div class="tpl-hero-content">
                <span class="tpl-hero-tag">${section.heroTag}</span>
                <h1>${section.heroTitle}</h1>
                <p>${section.heroSubtitle}</p>
                <div class="tpl-hero-actions">
                  <button class="tpl-btn tpl-btn-primary" data-scroll-catalog>
                    ${section.id === 'comida' ? 'Ver carta completa' : 'Explorar colección'}
                  </button>
                  ${
                    section.id === 'impresion3d'
                      ? '<button class="tpl-btn tpl-btn-ghost" data-scroll-calc>Cotizar pieza 3D</button>'
                      : `<button class="tpl-btn tpl-btn-ghost" data-open-stock="${section.id}">Control de stock (${secStock.totalUnits} u.)</button>`
                  }
                </div>
              </div>
            </section>

            <section id="tpl-catalog-anchor">
              <div class="tpl-section-head">
                <div>
                  <h2>${section.id === 'comida' ? 'Nuestra Carta' : 'Catálogo Destacado'}</h2>
                  <p>${items.length} ${section.id === 'comida' ? 'platos' : 'productos'} · ${secStock.totalUnits} unidades disponibles en tienda</p>
                </div>
                <div class="tpl-tabs">
                  ${section.categories
                    .map(
                      (c) => `
                    <button class="tpl-tab ${activeCat === c ? 'is-active' : ''}" data-tpl-cat="${c}">
                      ${c}
                    </button>`
                    )
                    .join('')}
                </div>
              </div>

              <div class="tpl-catalog-controls">
                <div class="tpl-controls-left">
                  ${
                    section.id === 'comida'
                      ? ['Todos', 'Vegetariano', 'Sin TACC']
                          .map(
                            (d) => `
                          <button class="tpl-tab ${activeDiet === d ? 'is-active' : ''}" data-comida-diet="${d}">
                            ${d === 'Todos' ? 'Todas las opciones' : d}
                          </button>`
                          )
                          .join('')
                      : `<span style="font-size:0.8rem;opacity:0.74;">Filtrar y ordenar catálogo</span>`
                  }
                </div>
                <div class="tpl-controls-right">
                  <button class="tpl-instock-toggle ${onlyInStock ? 'is-active' : ''}" data-toggle-instock="${section.id}">
                    <span>${onlyInStock ? '✓ Solo con stock' : 'Solo con stock'}</span>
                  </button>
                  <select class="tpl-sort-select" id="tpl-sort-select" aria-label="Ordenar productos">
                    <option value="featured" ${sortMode === 'featured' ? 'selected' : ''}>Orden: Destacados</option>
                    <option value="price-asc" ${sortMode === 'price-asc' ? 'selected' : ''}>Menor precio</option>
                    <option value="price-desc" ${sortMode === 'price-desc' ? 'selected' : ''}>Mayor precio</option>
                  </select>
                </div>
              </div>

              ${
                section.id === 'comida'
                  ? renderFoodMenuGrid(section, items, state, helpers)
                  : renderStandardProductGrid(section, items, state, helpers)
              }
            </section>

            ${section.id === 'impresion3d' ? render3DQuoteCalculator(state) : ''}
    `;

  return `
    <div class="template-viewport-outer" data-vp="${state.viewport}">
      <div class="template-frame">
        <div class="tpl-root ${themeClassMap[section.id]}">
          ${
            section.id === 'mujer'
              ? '<div class="tpl-announcement">Envío gratis desde $85.000 · Pagá con Mercado Pago, Tarjeta o Transferencia</div>'
              : ''
          }
          <div class="tpl-header-wrap">${headerInner}</div>

          <div class="tpl-container">
            ${mainBodyMarkup}

            <section class="tpl-about-card" id="tpl-info-anchor">
              <div>
                <div class="prod-cat">Sobre Nosotros</div>
                <h3>${section.brand}</h3>
                <p class="tpl-about-story">${section.about.story}</p>
                <div class="tpl-about-meta">
                  <span>🕒 ${section.about.hours}</span>
                  <span>💳 Aceptamos Mercado Pago, Tarjetas, Transferencia, Modo y Efectivo</span>
                </div>
              </div>
              ${window.renderContactRows(section)}
            </section>

            <section class="tpl-strip">
              ${section.highlights
                .map(
                  (h) => `
                <div class="tpl-strip-item">
                  <strong>${h.title}</strong>
                  <span>${h.text}</span>
                </div>`
                )
                .join('')}
            </section>
          </div>

          <footer class="tpl-footer">
            <div class="tpl-container tpl-footer-inner">
              <div><strong>${section.brand}</strong> · Modelo interactivo de ${section.sectionName}</div>
              <div>Creado en <strong>Mi Centro Web</strong></div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  `;
};

function renderProductDetailPage(section, item, state, helpers) {
  const colorIdx = state.selectedColors[item.id] || 0;
  const activeColor = (item.colors && item.colors[colorIdx]) || { name: 'Estándar', hex: '#888' };
  const isFav = !!state.favorites[item.id];
  const available = helpers.getAvailable(item.id);
  const totalStock = helpers.getStock(item.id);
  const stockMeta = window.getStockMeta(available, section.id === 'comida');
  const maxQty = Math.max(1, available);
  const qty = Math.min(Math.max(1, state.pdpQty || 1), maxQty);
  const options = item.options || ['Estándar'];
  const optIdx = Math.min(state.pdpOptionIdx || 0, options.length - 1);
  const installment = Math.round(item.price / 3);

  const waDigits = section.about.phone.replace(/\D/g, '');
  const waAskUrl = `https://wa.me/${waDigits}?text=${encodeURIComponent(
    `Hola ${section.brand}! Quería consultar por *${item.name}* (${activeColor.name} / ${options[optIdx]}) — ${window.formatPrice(item.price)}.`
  )}`;

  const paymentMethods = [
    'Mercado Pago',
    'Tarjeta de Crédito / Débito',
    'Transferencia Bancaria',
    'Efectivo',
    'Modo / QR'
  ];

  const related = helpers
    .getSectionItems(section.id)
    .filter((other) => other.id !== item.id)
    .slice(0, 4);

  return `
    <section class="pdp-page">
      <div class="pdp-topbar">
        <button class="pdp-back-btn" data-back-catalog>
          <span>← Volver al catálogo</span>
        </button>
        <div class="pdp-breadcrumb">${section.brand} / ${item.category} / ${item.name}</div>
      </div>

      <div class="pdp-layout">
        <div class="pdp-media-card ${totalStock <= 0 ? 'is-out-of-stock' : ''}">
          ${renderProductMedia(item, activeColor.hex, section.id)}
          ${item.badge ? `<span class="prod-badge">${item.badge}</span>` : ''}
          ${totalStock <= 0 ? '<div class="prod-out-banner"><span>Agotado</span></div>' : ''}
          <button class="prod-fav-btn ${isFav ? 'is-fav' : ''}" data-toggle-fav="${item.id}" title="Guardar en favoritos">
            ${isFav ? '♥' : '♡'}
          </button>
        </div>

        <div class="pdp-info-panel">
          <div class="prod-cat">${item.category} · ${activeColor.name}</div>
          <h1 class="pdp-title">${item.name}</h1>

          <div class="pdp-price-row">
            <span class="pdp-price ${section.id === 'impresion3d' ? 'mono' : ''}">${window.formatPrice(item.price)}</span>
            <span class="stock-chip ${stockMeta.cls}"><i></i>${stockMeta.label}</span>
          </div>
          <div class="pdp-installments">
            Hasta 3 cuotas sin interés de <strong>${window.formatPrice(installment)}</strong> · 10% OFF por transferencia
          </div>

          <p class="pdp-desc">${item.desc}</p>

          ${
            item.diet && item.diet.length
              ? `<div class="diet-tags" style="margin-bottom:18px;">
                  ${item.diet
                    .map(
                      (tag) => `
                    <span class="diet-tag ${tag === 'Vegetariano' ? 'is-veggie' : tag === 'Picante' ? 'is-spicy' : ''}">
                      ${tag}
                    </span>`
                    )
                    .join('')}
                </div>`
              : ''
          }

          ${
            item.colors && item.colors.length > 1
              ? `
            <span class="pdp-field-label">Color / Acabado: ${activeColor.name}</span>
            <div class="prod-swatches" style="margin-bottom:20px;">
              ${item.colors
                .map(
                  (col, idx) => `
                <button
                  class="swatch-dot ${idx === colorIdx ? 'is-active' : ''}"
                  style="background:${col.hex};color:${col.hex}"
                  title="${col.name}"
                  data-pick-color="${item.id}:${idx}"
                ></button>`
                )
                .join('')}
            </div>`
              : ''
          }

          <span class="pdp-field-label">${item.optionsLabel || 'Opción'}</span>
          <div class="pdp-chips">
            ${options
              .map(
                (opt, idx) => `
              <button class="pdp-chip ${idx === optIdx ? 'is-selected' : ''}" data-pdp-opt="${idx}">
                ${opt}
              </button>`
              )
              .join('')}
          </div>

          <div class="pdp-qty-pay-row">
            <div>
              <span class="pdp-field-label">Cantidad</span>
              <div class="pdp-qty-box">
                <button data-pdp-qty="-1" ${qty <= 1 || available <= 0 ? 'disabled' : ''}>−</button>
                <span>${available <= 0 ? 0 : qty}</span>
                <button data-pdp-qty="1" ${qty >= available ? 'disabled' : ''}>+</button>
              </div>
            </div>
            <div>
              <span class="pdp-field-label">Forma de pago</span>
              <select id="pdp-payment-select" class="pdp-pay-select">
                ${paymentMethods
                  .map(
                    (m) =>
                      `<option value="${m}" ${state.pdpPayment === m ? 'selected' : ''}>${m}</option>`
                  )
                  .join('')}
              </select>
            </div>
          </div>

          <div class="pdp-cta-grid">
            <button class="pdp-cta-primary" id="btn-pdp-add" ${available <= 0 ? 'disabled' : ''}>
              ${available <= 0 ? 'Sin stock' : `+ Agregar (${window.formatPrice(item.price * qty)})`}
            </button>
            <button class="pdp-cta-buy" id="btn-pdp-buy-now" ${available <= 0 ? 'disabled' : ''}>
              ${available <= 0 ? 'Agotado' : 'Comprar ahora'}
            </button>
          </div>

          <a class="pdp-wa-link" href="${waAskUrl}" target="_blank" rel="noopener noreferrer">
            <span>Consultar este producto por WhatsApp ↗</span>
          </a>

          <div class="pdp-perks">
            ${section.highlights
              .map(
                (h) => `
              <div>
                <strong>${h.title}</strong>
                <span>${h.text}</span>
              </div>`
              )
              .join('')}
          </div>
        </div>
      </div>

      ${
        related.length > 0
          ? `
        <div class="pdp-related">
          <h2>También te puede interesar</h2>
          ${
            section.id === 'comida'
              ? renderFoodMenuGrid(section, related, state, helpers)
              : renderStandardProductGrid(section, related, state, helpers)
          }
        </div>`
          : ''
      }
    </section>
  `;
}

function renderProductMedia(item, activeColorHex, sectionId) {
  if (item.image) {
    return `<img class="prod-photo" src="${item.image}" alt="${item.name}" loading="lazy" />`;
  }
  return window.renderItemArtwork(item.artType || 'vase', activeColorHex, sectionId);
}

window.renderProductMedia = renderProductMedia;

function renderStandardProductGrid(section, items, state, helpers) {
  if (items.length === 0) {
    return `<p style="padding:36px 0;opacity:0.72;text-align:center;">No hay productos que coincidan con los filtros seleccionados.</p>`;
  }
  return `
    <div class="tpl-grid">
      ${items
        .map((item) => {
          const colorIdx = state.selectedColors[item.id] || 0;
          const activeColor = (item.colors && item.colors[colorIdx]) || { name: 'Estándar', hex: '#888' };
          const isFav = !!state.favorites[item.id];
          const available = helpers.getAvailable(item.id);
          const totalStock = helpers.getStock(item.id);
          const stockMeta = window.getStockMeta(available, false);
          const isOut = available <= 0;

          return `
            <article class="prod-card ${totalStock <= 0 ? 'is-out-of-stock' : ''}">
              <div class="prod-visual" data-quick-view="${item.id}">
                ${renderProductMedia(item, activeColor.hex, section.id)}
                ${item.badge ? `<span class="prod-badge">${item.badge}</span>` : ''}
                ${
                  totalStock <= 0
                    ? '<div class="prod-out-banner"><span>Agotado</span></div>'
                    : ''
                }
                ${
                  item.image && item.colors && item.colors.length > 1
                    ? `<span class="prod-color-pill"><i style="background:${activeColor.hex}"></i>${activeColor.name}</span>`
                    : ''
                }
                <button class="prod-fav-btn ${isFav ? 'is-fav' : ''}" data-toggle-fav="${item.id}" title="Guardar en favoritos">
                  ${isFav ? '♥' : '♡'}
                </button>
              </div>
              <div class="prod-body">
                <div class="prod-cat">${item.category} · ${activeColor.name}</div>
                <h3 class="prod-title" style="cursor:pointer;" data-quick-view="${item.id}">${item.name}</h3>
                <p class="prod-desc">${item.desc}</p>
                <div class="prod-stock-row">
                  <span class="stock-chip ${stockMeta.cls}"><i></i>${stockMeta.label}</span>
                  <div class="prod-swatches" style="margin-bottom:0;">
                    ${(item.colors || [])
                      .map(
                        (col, idx) => `
                      <button
                        class="swatch-dot ${idx === colorIdx ? 'is-active' : ''}"
                        style="background:${col.hex};color:${col.hex}"
                        title="${col.name}"
                        data-pick-color="${item.id}:${idx}"
                      ></button>`
                      )
                      .join('')}
                  </div>
                </div>
                <div class="prod-foot">
                  <span class="prod-price ${section.id === 'impresion3d' ? 'mono' : ''}">${window.formatPrice(item.price)}</span>
                  <button class="prod-add-btn" data-quick-add="${item.id}" ${isOut ? 'disabled' : ''}>
                    ${totalStock <= 0 ? 'Sin stock' : isOut ? 'Máx. en bolsa' : '+ Agregar'}
                  </button>
                </div>
              </div>
            </article>
          `;
        })
        .join('')}
    </div>
  `;
}

function renderFoodMenuGrid(section, items, state, helpers) {
  if (items.length === 0) {
    return `<p style="padding:36px 0;opacity:0.72;text-align:center;">No hay platos que coincidan con este filtro.</p>`;
  }
  return `
    <div class="menu-grid">
      ${items
        .map((item) => {
          const col = (item.colors && item.colors[0]) || { hex: '#C2410C' };
          const available = helpers.getAvailable(item.id);
          const totalStock = helpers.getStock(item.id);
          const stockMeta = window.getStockMeta(available, true);
          const isOut = available <= 0;

          return `
            <article class="menu-item-card ${totalStock <= 0 ? 'is-out-of-stock' : ''}">
              <div class="menu-item-art" data-quick-view="${item.id}">
                ${renderProductMedia(item, col.hex, 'comida')}
              </div>
              <div>
                <div class="menu-item-top">
                  <h3 style="cursor:pointer;" data-quick-view="${item.id}">${item.name}</h3>
                  <span class="menu-item-price">${window.formatPrice(item.price)}</span>
                </div>
                <p class="menu-item-desc">${item.desc}</p>
                <div class="menu-item-bottom">
                  <div class="diet-tags">
                    <span class="stock-chip ${stockMeta.cls}"><i></i>${stockMeta.shortLabel}</span>
                    ${(item.diet || [])
                      .map(
                        (tag) => `
                      <span class="diet-tag ${tag === 'Vegetariano' ? 'is-veggie' : tag === 'Picante' ? 'is-spicy' : ''}">
                        ${tag}
                      </span>`
                      )
                      .join('')}
                  </div>
                  <button class="menu-add-btn" data-quick-add="${item.id}" ${isOut ? 'disabled' : ''}>
                    ${totalStock <= 0 ? 'Agotado' : isOut ? 'Sin disp.' : '+ Pedir'}
                  </button>
                </div>
              </div>
            </article>
          `;
        })
        .join('')}
    </div>
  `;
}

function render3DQuoteCalculator(state) {
  const q = state.quote3d;
  const materialRate = { 'PLA+ Mate': 1, 'PETG Técnico': 1.28, 'Resina 8K': 1.75 }[q.material] || 1;
  const volumeFactor = Math.pow(q.sizeCm / 10, 1.45);
  const infillFactor = 0.75 + (q.infill / 100) * 0.65;
  const estimatedPrice = Math.round((8500 * materialRate * volumeFactor * infillFactor) / 100) * 100;
  const hours = Math.max(1.5, +(volumeFactor * infillFactor * 2.8).toFixed(1));

  return `
    <section class="calc-3d-panel" id="tpl-calc-anchor">
      <div>
        <span class="tpl-hero-tag" style="margin-bottom:10px;">Herramienta Interactiva</span>
        <h2 style="margin:0 0 8px;">Cotizador de Impresión Personalizada</h2>
        <p style="margin:0;color:#94A3B8;font-size:0.9rem;line-height:1.55;">
          Calculá en segundos el valor estimado para imprimir tu pieza STL según material, altura y densidad de relleno.
        </p>

        <div class="calc-3d-controls">
          <div class="calc-field">
            <label for="calc-material">Material</label>
            <select id="calc-material">
              ${['PLA+ Mate', 'PETG Técnico', 'Resina 8K']
                .map((m) => `<option value="${m}" ${q.material === m ? 'selected' : ''}>${m}</option>`)
                .join('')}
            </select>
          </div>
          <div class="calc-field">
            <label for="calc-size">Altura: ${q.sizeCm} cm</label>
            <input id="calc-size" type="range" min="5" max="30" step="1" value="${q.sizeCm}" />
          </div>
          <div class="calc-field">
            <label for="calc-infill">Relleno: ${q.infill}%</label>
            <input id="calc-infill" type="range" min="15" max="100" step="5" value="${q.infill}" />
          </div>
        </div>
      </div>

      <div class="calc-summary">
        <div style="font-size:0.78rem;text-transform:uppercase;letter-spacing:0.08em;color:#94A3B8;">Estimado en vivo</div>
        <div class="calc-summary-price">${window.formatPrice(estimatedPrice)}</div>
        <div class="calc-summary-meta">Tiempo aprox: ${hours} hs · ${q.material} · ${q.sizeCm}cm · ${q.infill}%</div>
        <button class="tpl-btn tpl-btn-primary" style="width:100%;" id="btn-add-custom-3d" data-price="${estimatedPrice}">
          + Agregar cotización al pedido
        </button>
      </div>
    </section>
  `;
}
