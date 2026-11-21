/* =========================================================
   ARTISTIC SVG PRODUCT VISUALS (Color-reactive per swatch!)
   ========================================================= */

window.renderItemArtwork = function renderItemArtwork(artType, colorHex, themeId) {
  const c = colorHex || '#888888';
  const bgMap = {
    mujer: '#F3ECE3',
    hombre: '#E8EAEE',
    impresion3d: '#0E1420',
    comida: '#F6EDE1',
    objetos: '#ECEAE3'
  };
  const bg = bgMap[themeId] || '#F2F2EE';
  const isDark = themeId === 'impresion3d';
  const stroke = isDark ? 'rgba(255,255,255,0.22)' : 'rgba(25,25,22,0.16)';
  const shadow = isDark ? 'rgba(0,0,0,0.45)' : 'rgba(25,25,22,0.09)';

  let inner = '';

  switch (artType) {
    case 'coat':
      inner = `
        <ellipse cx="120" cy="216" rx="52" ry="8" fill="${shadow}"/>
        <path d="M88 46 L120 62 L152 46 L176 66 L190 156 L166 160 L156 104 L158 206 L82 206 L84 104 L74 160 L50 156 L64 66 Z" fill="${c}" stroke="${stroke}" stroke-width="2"/>
        <path d="M120 62 L120 206" stroke="${stroke}" stroke-width="2"/>
        <path d="M98 49 L120 96 L142 49" fill="none" stroke="${stroke}" stroke-width="2"/>
        <rect x="82" y="122" width="76" height="10" rx="4" fill="rgba(0,0,0,0.16)"/>
      `;
      break;

    case 'dress':
      inner = `
        <ellipse cx="120" cy="218" rx="58" ry="8" fill="${shadow}"/>
        <path d="M96 42 L96 68 M144 42 L144 68" stroke="${c}" stroke-width="4" stroke-linecap="round"/>
        <path d="M92 66 Q120 82 148 66 L142 114 L176 208 Q120 220 64 208 L98 114 Z" fill="${c}" stroke="${stroke}" stroke-width="2"/>
        <path d="M98 114 Q120 120 142 114" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="2"/>
      `;
      break;

    case 'blouse':
      inner = `
        <ellipse cx="120" cy="204" rx="50" ry="7" fill="${shadow}"/>
        <path d="M92 56 Q120 74 148 56 L184 82 Q196 122 172 146 L154 134 L154 192 L86 192 L86 134 L68 146 Q44 122 56 82 Z" fill="${c}" stroke="${stroke}" stroke-width="2"/>
        <path d="M120 68 L120 126" stroke="${stroke}" stroke-width="2"/>
      `;
      break;

    case 'bag':
      inner = `
        <ellipse cx="120" cy="206" rx="52" ry="8" fill="${shadow}"/>
        <path d="M78 112 C78 58 162 58 162 112" fill="none" stroke="${c}" stroke-width="10" stroke-linecap="round"/>
        <path d="M62 112 C62 184 178 184 178 112 Q120 128 62 112 Z" fill="${c}" stroke="${stroke}" stroke-width="2"/>
        <circle cx="120" cy="144" r="7" fill="#D4AF37"/>
      `;
      break;

    case 'jacket':
      inner = `
        <ellipse cx="120" cy="212" rx="56" ry="8" fill="${shadow}"/>
        <path d="M84 48 L120 62 L156 48 L184 70 L194 166 L166 170 L158 106 L160 198 L80 198 L82 106 L74 170 L46 166 L56 70 Z" fill="${c}" stroke="${stroke}" stroke-width="2"/>
        <line x1="120" y1="62" x2="120" y2="198" stroke="${stroke}" stroke-width="2.5"/>
        <rect x="88" y="96" width="22" height="24" rx="2" fill="rgba(255,255,255,0.12)" stroke="${stroke}"/>
        <rect x="130" y="96" width="22" height="24" rx="2" fill="rgba(255,255,255,0.12)" stroke="${stroke}"/>
      `;
      break;

    case 'shirt':
      inner = `
        <ellipse cx="120" cy="210" rx="54" ry="8" fill="${shadow}"/>
        <path d="M90 50 L120 66 L150 50 L186 76 L176 124 L156 116 L156 196 L84 196 L84 116 L64 124 L54 76 Z" fill="${c}" stroke="${stroke}" stroke-width="2"/>
        <path d="M120 66 L120 196" stroke="${stroke}" stroke-width="1.6"/>
        <circle cx="120" cy="96" r="2.5" fill="${stroke}"/>
        <circle cx="120" cy="122" r="2.5" fill="${stroke}"/>
        <circle cx="120" cy="148" r="2.5" fill="${stroke}"/>
      `;
      break;

    case 'pants':
      inner = `
        <ellipse cx="120" cy="216" rx="48" ry="7" fill="${shadow}"/>
        <path d="M78 44 L162 44 L172 204 L132 204 L120 112 L108 204 L68 204 Z" fill="${c}" stroke="${stroke}" stroke-width="2"/>
        <line x1="78" y1="58" x2="162" y2="58" stroke="${stroke}" stroke-width="2"/>
        <line x1="120" y1="44" x2="120" y2="90" stroke="${stroke}" stroke-width="1.8"/>
      `;
      break;

    case 'shoe':
      inner = `
        <ellipse cx="120" cy="186" rx="72" ry="10" fill="${shadow}"/>
        <path d="M52 152 L68 106 L104 110 C124 128 152 134 184 142 C194 145 196 164 186 168 L52 168 Z" fill="${c}" stroke="${stroke}" stroke-width="2"/>
        <rect x="48" y="164" width="144" height="16" rx="6" fill="#F5F5F2" stroke="${stroke}" stroke-width="2"/>
        <path d="M110 118 L128 124 M118 126 L136 132" stroke="rgba(255,255,255,0.6)" stroke-width="3" stroke-linecap="round"/>
      `;
      break;

    case 'lamp3d':
      inner = `
        <defs>
          <radialGradient id="glow3d-${c.replace('#','')}" cx="50%" cy="46%" r="48%">
            <stop offset="0%" stop-color="${c}" stop-opacity="0.45"/>
            <stop offset="100%" stop-color="${c}" stop-opacity="0"/>
          </radialGradient>
        </defs>
        <circle cx="120" cy="116" r="88" fill="url(#glow3d-${c.replace('#','')})"/>
        <ellipse cx="120" cy="206" rx="46" ry="8" fill="rgba(0,0,0,0.5)"/>
        <path d="M84 184 C74 128 84 64 120 44 C156 64 166 128 156 184 Z" fill="${c}" fill-opacity="0.88" stroke="#ffffff" stroke-opacity="0.35" stroke-width="1.5"/>
        <path d="M88 86 Q120 74 152 86 M82 114 Q120 100 158 114 M82 142 Q120 128 158 142 M85 168 Q120 156 155 168" fill="none" stroke="rgba(11,15,23,0.45)" stroke-width="2"/>
        <rect x="92" y="184" width="56" height="16" rx="5" fill="#1E293B" stroke="rgba(255,255,255,0.2)"/>
      `;
      break;

    case 'figure3d':
      inner = `
        <ellipse cx="120" cy="208" rx="48" ry="8" fill="rgba(0,0,0,0.55)"/>
        <polygon points="120,44 152,66 144,104 96,104 88,66" fill="${c}" stroke="rgba(255,255,255,0.3)" stroke-width="1.5"/>
        <polygon points="90,108 150,108 170,152 152,188 88,188 70,152" fill="${c}" fill-opacity="0.85" stroke="rgba(255,255,255,0.28)" stroke-width="1.5"/>
        <polygon points="104,76 136,76 132,86 108,86" fill="#22D3EE"/>
        <rect x="78" y="188" width="84" height="16" rx="4" fill="#1E293B" stroke="rgba(34,211,238,0.4)"/>
      `;
      break;

    case 'dock3d':
      inner = `
        <ellipse cx="120" cy="204" rx="64" ry="8" fill="rgba(0,0,0,0.55)"/>
        <polygon points="56,166 184,166 172,196 68,196" fill="${c}" stroke="rgba(255,255,255,0.26)" stroke-width="1.5"/>
        <polygon points="82,76 142,76 156,166 74,166" fill="${c}" fill-opacity="0.86" stroke="rgba(255,255,255,0.26)" stroke-width="1.5"/>
        <rect x="92" y="88" width="44" height="66" rx="5" fill="#0B0F17" stroke="#22D3EE" stroke-width="1.5"/>
      `;
      break;

    case 'planter3d':
      inner = `
        <ellipse cx="120" cy="206" rx="52" ry="8" fill="rgba(0,0,0,0.5)"/>
        <path d="M120 112 C104 84 86 78 82 58 C102 62 114 78 120 94 C126 74 140 58 160 54 C156 76 140 88 120 112 Z" fill="#34D399"/>
        <polygon points="74,112 166,112 152,194 88,194" fill="${c}" stroke="rgba(255,255,255,0.28)" stroke-width="1.5"/>
        <polyline points="74,112 120,152 166,112" fill="none" stroke="rgba(255,255,255,0.22)" stroke-width="1.5"/>
        <line x1="120" y1="152" x2="120" y2="194" stroke="rgba(255,255,255,0.22)" stroke-width="1.5"/>
      `;
      break;

    case 'dish_pizza':
      inner = `
        <circle cx="120" cy="120" r="82" fill="#D98A46" stroke="${stroke}" stroke-width="2"/>
        <circle cx="120" cy="120" r="68" fill="${c}"/>
        <circle cx="96" cy="96" r="14" fill="#FBF7F0"/>
        <circle cx="146" cy="108" r="15" fill="#FBF7F0"/>
        <circle cx="114" cy="146" r="16" fill="#FBF7F0"/>
        <circle cx="144" cy="144" r="11" fill="#FBF7F0"/>
        <ellipse cx="120" cy="116" rx="10" ry="5" transform="rotate(-25 120 116)" fill="#2F6B48"/>
        <ellipse cx="98" cy="130" rx="9" ry="4" transform="rotate(30 98 130)" fill="#2F6B48"/>
        <ellipse cx="148" cy="94" rx="8" ry="4" transform="rotate(-15 148 94)" fill="#2F6B48"/>
      `;
      break;

    case 'dish_starter':
    case 'dish_main':
      inner = `
        <circle cx="120" cy="120" r="82" fill="#FFFFFF" stroke="${stroke}" stroke-width="2"/>
        <circle cx="120" cy="120" r="64" fill="#F6EFE5"/>
        <ellipse cx="118" cy="122" rx="44" ry="30" fill="${c}"/>
        <circle cx="96" cy="112" r="12" fill="#E9D8C2"/>
        <circle cx="144" cy="132" r="10" fill="#2F6B48"/>
        <circle cx="126" cy="104" r="7" fill="#D97706"/>
      `;
      break;

    case 'dish_dessert':
      inner = `
        <circle cx="120" cy="124" r="76" fill="#FFFFFF" stroke="${stroke}" stroke-width="2"/>
        <rect x="74" y="88" width="92" height="58" rx="10" fill="#EFE4D2" stroke="${stroke}"/>
        <rect x="74" y="88" width="92" height="16" rx="6" fill="${c}"/>
        <line x1="76" y1="120" x2="164" y2="120" stroke="${c}" stroke-width="5"/>
      `;
      break;

    case 'dish_drink':
      inner = `
        <ellipse cx="120" cy="196" rx="40" ry="7" fill="${shadow}"/>
        <path d="M84 62 L156 62 L146 188 L94 188 Z" fill="#FFFFFF" fill-opacity="0.7" stroke="${stroke}" stroke-width="2"/>
        <path d="M88 94 L152 94 L144 184 L96 184 Z" fill="${c}" fill-opacity="0.72"/>
        <circle cx="110" cy="118" r="12" fill="#FDE047" fill-opacity="0.8"/>
        <ellipse cx="134" cy="102" rx="10" ry="5" transform="rotate(-30 134 102)" fill="#2F6B48"/>
        <line x1="132" y1="42" x2="118" y2="146" stroke="#1F352B" stroke-width="4" stroke-linecap="round"/>
      `;
      break;

    case 'vase':
      inner = `
        <ellipse cx="120" cy="208" rx="44" ry="7" fill="${shadow}"/>
        <path d="M120 90 Q106 54 92 42 M120 90 Q136 58 148 46" fill="none" stroke="#6B7B6E" stroke-width="2.5" stroke-linecap="round"/>
        <path d="M102 82 L138 82 L134 104 C162 126 164 176 144 200 L96 200 C76 176 78 126 106 104 Z" fill="${c}" stroke="${stroke}" stroke-width="2"/>
      `;
      break;

    case 'globe_lamp':
      inner = `
        <ellipse cx="120" cy="208" rx="42" ry="7" fill="${shadow}"/>
        <circle cx="120" cy="108" r="52" fill="${c}" stroke="${stroke}" stroke-width="2"/>
        <circle cx="104" cy="92" r="14" fill="rgba(255,255,255,0.45)"/>
        <rect x="92" y="156" width="56" height="44" rx="8" fill="#C4B6A2" stroke="${stroke}" stroke-width="2"/>
      `;
      break;

    case 'tray':
      inner = `
        <ellipse cx="120" cy="176" rx="76" ry="12" fill="${shadow}"/>
        <rect x="44" y="102" width="152" height="62" rx="22" fill="${c}" stroke="${stroke}" stroke-width="2"/>
        <rect x="56" y="114" width="128" height="38" rx="14" fill="rgba(0,0,0,0.14)"/>
        <line x1="74" y1="133" x2="142" y2="133" stroke="#E5DFD3" stroke-width="5" stroke-linecap="round"/>
      `;
      break;

    case 'candle':
      inner = `
        <ellipse cx="120" cy="204" rx="46" ry="8" fill="${shadow}"/>
        <path d="M120 56 C128 70 128 84 120 90 C112 84 112 70 120 56 Z" fill="#F59E0B"/>
        <line x1="120" y1="90" x2="120" y2="104" stroke="#222" stroke-width="2"/>
        <rect x="78" y="104" width="84" height="92" rx="14" fill="${c}" stroke="${stroke}" stroke-width="2"/>
        <rect x="94" y="132" width="52" height="36" rx="4" fill="#FAF8F4" stroke="${stroke}"/>
      `;
      break;

    case 'cup':
      inner = `
        <ellipse cx="120" cy="198" rx="48" ry="8" fill="${shadow}"/>
        <path d="M74 96 L166 96 L156 184 C154 192 86 192 84 184 Z" fill="${c}" stroke="${stroke}" stroke-width="2"/>
        <ellipse cx="120" cy="96" rx="46" ry="11" fill="#4A3222" stroke="${stroke}" stroke-width="2"/>
      `;
      break;

    case 'clock':
    default:
      inner = `
        <ellipse cx="120" cy="204" rx="46" ry="7" fill="${shadow}"/>
        <circle cx="120" cy="124" r="64" fill="${c}" stroke="${stroke}" stroke-width="2"/>
        <circle cx="120" cy="124" r="52" fill="#FAF8F4"/>
        <line x1="120" y1="124" x2="120" y2="88" stroke="#1E1E1B" stroke-width="3.5" stroke-linecap="round"/>
        <line x1="120" y1="124" x2="148" y2="136" stroke="#C48B71" stroke-width="3" stroke-linecap="round"/>
        <circle cx="120" cy="124" r="4" fill="#1E1E1B"/>
      `;
      break;
  }

  return `
    <svg viewBox="0 0 240 240" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style="background:${bg};display:block;">
      ${inner}
    </svg>
  `;
};
