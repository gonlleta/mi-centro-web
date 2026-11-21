/* =========================================================
   CATALOG & TEMPLATE DATA FOR MI CENTRO WEB
   ========================================================= */

window.HUB_SECTIONS = [
  {
    id: 'mujer',
    sectionName: 'Tienda de Ropa de Mujer',
    brand: 'ATELIER LUNA',
    hubCategory: 'Moda',
    featured: true,
    badge: 'Moda Femenina',
    heroImage: 'assets/hero-mujer.jpg',
    palette: ['#FAF7F2', '#211C18', '#C27862', '#D8C3B0'],
    description: 'Boutique editorial minimalista con lookbook, selector de talles y colores en vivo, favoritos y bolsa de compra interactiva.',
    features: ['Filtros por prenda', 'Colores en vivo', 'Talles XS–L', 'Bolsa de compra'],
    heroTag: 'Colección Otoño · Invierno',
    heroTitle: 'Siluetas suaves para vestir sin esfuerzo.',
    heroSubtitle: 'Prendas nobles en lino lavado, seda fluida y sastrería relajada pensadas para acompañarte todo el día.',
    cartLabel: 'Bolsa',
    categories: ['Todo', 'Vestidos', 'Abrigos', 'Blusas', 'Accesorios'],
    highlights: [
      { title: 'Envío sin cargo', text: 'En compras superiores a $85.000 a todo el país.' },
      { title: 'Cambios simples', text: '30 días para cambiar talle o prenda sin costo.' },
      { title: 'Tejidos nobles', text: 'Lino europeo, algodón peinado y confección local.' }
    ],
    about: {
      story: 'ATELIER LUNA nació como un estudio independiente de indumentaria femenina enfocado en cortes atemporales, telas nobles y producciones responsables en pequeños lotes. Diseñamos prendas versátiles pensadas para durar muchas temporadas.',
      location: 'Palermo Soho, Buenos Aires · Envíos a todo el país',
      hours: 'Lunes a Sábados de 10:00 a 20:00 hs',
      phone: '+54 9 11 4820-3190',
      instagram: '@atelierluna.tienda',
      email: 'atelierluna.contacto@gmail.com'
    },
    items: [
      {
        id: 'm1',
        name: 'Trench Aura en Lino',
        category: 'Abrigos',
        price: 78500,
        stock: 9,
        badge: 'Nuevo',
        artType: 'coat',
        image: 'assets/products/m1.jpg',
        desc: 'Corte midi fluido con lazo a la cintura, solapa amplia y forro respirable ideal para media estación.',
        optionsLabel: 'Talle',
        options: ['XS', 'S', 'M', 'L'],
        colors: [
          { name: 'Arena', hex: '#D8C3A8' },
          { name: 'Terracota', hex: '#B5654D' },
          { name: 'Espresso', hex: '#382B24' }
        ]
      },
      {
        id: 'm2',
        name: 'Vestido Brisa Satinado',
        category: 'Vestidos',
        price: 54900,
        stock: 3,
        badge: 'Destacado',
        artType: 'dress',
        image: 'assets/products/m2.jpg',
        desc: 'Caída al bies con escote suave y breteles regulables. Elegancia sutil para día o noche.',
        optionsLabel: 'Talle',
        options: ['XS', 'S', 'M', 'L'],
        colors: [
          { name: 'Champagne', hex: '#E5D3BE' },
          { name: 'Oliva', hex: '#6C735B' },
          { name: 'Borgoña', hex: '#6D2E3B' }
        ]
      },
      {
        id: 'm3',
        name: 'Blusa Siena Plisada',
        category: 'Blusas',
        price: 36200,
        stock: 14,
        badge: '',
        artType: 'blouse',
        image: 'assets/products/m3.jpg',
        desc: 'Mangas abullonadas con puño elastizado y textura liviana que no requiere planchado.',
        optionsLabel: 'Talle',
        options: ['XS', 'S', 'M', 'L'],
        colors: [
          { name: 'Marfil', hex: '#EFE9DE' },
          { name: 'Rosa Seco', hex: '#C98A7E' },
          { name: 'Negro', hex: '#262321' }
        ]
      },
      {
        id: 'm4',
        name: 'Vestido Camisero Alba',
        category: 'Vestidos',
        price: 49800,
        stock: 2,
        badge: 'Edición Limitada',
        artType: 'dress',
        image: 'assets/products/m4.jpg',
        desc: 'Algodón orgánico estructurado con botones de nácar y bolsillos laterales ocultos.',
        optionsLabel: 'Talle',
        options: ['S', 'M', 'L'],
        colors: [
          { name: 'Crudo', hex: '#E8DFD1' },
          { name: 'Cacao', hex: '#7A5442' },
          { name: 'Azul Tinta', hex: '#2F3E52' }
        ]
      },
      {
        id: 'm5',
        name: 'Blazer Estructural Lía',
        category: 'Abrigos',
        price: 69400,
        stock: 7,
        badge: '',
        artType: 'coat',
        image: 'assets/products/m5.jpg',
        desc: 'Hombros levemente marcados y calce relajado para combinar con denim o pantalón sastrero.',
        optionsLabel: 'Talle',
        options: ['XS', 'S', 'M', 'L'],
        colors: [
          { name: 'Piedra', hex: '#BDB4A6' },
          { name: 'Carbón', hex: '#2C2A29' },
          { name: 'Canela', hex: '#9E6240' }
        ]
      },
      {
        id: 'm6',
        name: 'Cartera Media Luna Cuero',
        category: 'Accesorios',
        price: 44500,
        stock: 0,
        badge: 'Favorito',
        artType: 'bag',
        image: 'assets/products/m6.jpg',
        desc: 'Cuero vacuno graneado con herrajes dorados cepillados y correa regulable para hombro.',
        optionsLabel: 'Formato',
        options: ['Estándar', 'Mini'],
        colors: [
          { name: 'Suela', hex: '#A4643F' },
          { name: 'Negro', hex: '#22201F' },
          { name: 'Manteca', hex: '#E3D7C3' }
        ]
      }
    ]
  },

  {
    id: 'hombre',
    sectionName: 'Tienda de Ropa de Hombre',
    brand: 'NORD & CO.',
    hubCategory: 'Moda',
    featured: true,
    badge: 'Moda Masculina',
    heroImage: 'assets/hero-hombre.jpg',
    palette: ['#13161B', '#F2F3F5', '#C88A3B', '#525B68'],
    description: 'Estética nórdica contemporánea con líneas arquitectónicas, cápsulas urbanas, talles S–XL y carrito ágil.',
    features: ['Estilo urbano/sastrero', 'Selector de talles', 'Cambio de color', 'Carrito rápido'],
    heroTag: 'Cápsula Urbana 04',
    heroTitle: 'Esenciales técnicos de corte preciso.',
    heroSubtitle: 'Sobrecamisas de paño, pantalones relajados y calzado minimalista diseñados para durar temporadas.',
    cartLabel: 'Carrito',
    categories: ['Todo', 'Camperas', 'Camisas', 'Pantalones', 'Calzado'],
    highlights: [
      { title: 'Calce garantizado', text: 'Guía de medidas exacta y primer cambio bonificado.' },
      { title: 'Tejidos pesados', text: 'Gabardinas 320gr y algodones de alta densidad.' },
      { title: '3 cuotas sin interés', text: 'Disponible en toda la colección cápsula.' }
    ],
    about: {
      story: 'NORD & CO. combina sastrería contemporánea con funcionalidad urbana. Seleccionamos paños pesados, gabardinas técnicas y algodones de alto gramaje para crear esenciales masculinos sobrios, cómodos y duraderos.',
      location: 'Villa Crespo, Buenos Aires · Showroom con cita',
      hours: 'Lunes a Sábados de 11:00 a 20:00 hs',
      phone: '+54 9 11 5391-8420',
      instagram: '@nordandco.men',
      email: 'nordandco.ventas@gmail.com'
    },
    items: [
      {
        id: 'h1',
        name: 'Overshirt Oslo en Paño',
        category: 'Camperas',
        price: 72000,
        stock: 11,
        badge: 'Top Ventas',
        artType: 'jacket',
        image: 'assets/products/h1.jpg',
        desc: 'Sobrecamisa estructurada con doble bolsillo pectoral y botones mate tono sobre tono.',
        optionsLabel: 'Talle',
        options: ['S', 'M', 'L', 'XL'],
        colors: [
          { name: 'Grafito', hex: '#2E343D' },
          { name: 'Verde Musgo', hex: '#3D4C41' },
          { name: 'Camel', hex: '#A67C52' }
        ]
      },
      {
        id: 'h2',
        name: 'Camisa Oxford Bergen',
        category: 'Camisas',
        price: 42500,
        stock: 16,
        badge: 'Esencial',
        artType: 'shirt',
        image: 'assets/products/h2.jpg',
        desc: 'Algodón Oxford lavado con cuello abotonado y caída limpia que funciona por dentro o fuera.',
        optionsLabel: 'Talle',
        options: ['S', 'M', 'L', 'XL'],
        colors: [
          { name: 'Blanco Tiza', hex: '#E5E7EB' },
          { name: 'Azul Acero', hex: '#4B637A' },
          { name: 'Negro', hex: '#1F2329' }
        ]
      },
      {
        id: 'h3',
        name: 'Pantalón Pinzado Kova',
        category: 'Pantalones',
        price: 56800,
        stock: 3,
        badge: 'Nuevo',
        artType: 'pants',
        image: 'assets/products/h3.jpg',
        desc: 'Corte tapered relajado con doble pinza frontal y cintura semielastizada en gabardina premium.',
        optionsLabel: 'Talle',
        options: ['38', '40', '42', '44'],
        colors: [
          { name: 'Gris Piedra', hex: '#7A818B' },
          { name: 'Carbón', hex: '#242930' },
          { name: 'Arena', hex: '#B9AC96' }
        ]
      },
      {
        id: 'h4',
        name: 'Campera Bomber Técnica',
        category: 'Camperas',
        price: 89000,
        stock: 5,
        badge: 'Repelente',
        artType: 'jacket',
        image: 'assets/products/h4.jpg',
        desc: 'Nylon ripstop liviano resistente al viento y llovizna con cierres termosellados.',
        optionsLabel: 'Talle',
        options: ['S', 'M', 'L', 'XL'],
        colors: [
          { name: 'Negro Mate', hex: '#1B1E23' },
          { name: 'Azul Noche', hex: '#223147' },
          { name: 'Cobre', hex: '#9A6338' }
        ]
      },
      {
        id: 'h5',
        name: 'Zapatilla Cuero Minimal',
        category: 'Calzado',
        price: 84500,
        stock: 2,
        badge: 'Hecho a mano',
        artType: 'shoe',
        image: 'assets/products/h5.jpg',
        desc: 'Cuero liso plena flor, suela cosida tipo cupsole y plantilla anatómica de espuma de memoria.',
        optionsLabel: 'Número',
        options: ['40', '41', '42', '43', '44'],
        colors: [
          { name: 'Off-White', hex: '#DFDED8' },
          { name: 'Obsidiana', hex: '#23262B' },
          { name: 'Suela', hex: '#8F6342' }
        ]
      },
      {
        id: 'h6',
        name: 'Remera Boxy 280gr',
        category: 'Camisas',
        price: 26900,
        stock: 20,
        badge: '',
        artType: 'shirt',
        image: 'assets/products/h6.jpg',
        desc: 'Jersey pesado de algodón peinado, cuello rib reforzado y hombro caído contemporáneo.',
        optionsLabel: 'Talle',
        options: ['S', 'M', 'L', 'XL'],
        colors: [
          { name: 'Plomo', hex: '#4B525C' },
          { name: 'Crudo', hex: '#D8D4C9' },
          { name: 'Negro', hex: '#1E2126' }
        ]
      }
    ]
  },

  {
    id: 'impresion3d',
    sectionName: 'Tienda de Impresiones 3D',
    brand: 'FORJA 3D',
    hubCategory: 'Tecnología',
    featured: false,
    badge: 'Maker & 3D',
    heroImage: 'assets/hero-3d.jpg',
    palette: ['#0B0F17', '#131A26', '#22D3EE', '#F59E0B'],
    description: 'Catálogo oscuro estilo laboratorio de fabricación digital con materiales (PLA+, PETG, Resina 8K) y cotizador interactivo.',
    features: ['Cotizador 3D en vivo', 'PLA+ / PETG / Resina', 'Colores de filamento', 'Carrito técnico'],
    heroTag: 'Precisión 0.05mm · Fabricación a Pedido',
    heroTitle: 'Objetos paramétricos e impresión 3D de alta definición.',
    heroSubtitle: 'Piezas de diseño listas para envío o cotizá tus propios archivos STL en filamento técnico y resina 8K.',
    cartLabel: 'Pedido',
    categories: ['Todo', 'Iluminación', 'Figuras', 'Organización', 'Decoración'],
    highlights: [
      { title: 'Filamentos Pro', text: 'PLA+ mate, PETG resistente al calor y Resina 8K.' },
      { title: 'Producción 48h', text: 'Granja de impresoras calibradas para entregas rápidas.' },
      { title: 'Diseño a medida', text: 'Adaptamos medidas, logos y encastres a tu proyecto.' }
    ],
    about: {
      story: 'FORJA 3D es un laboratorio de fabricación digital especializado en diseño paramétrico, iluminación 3D y figuras de alta precisión en resina 8K. Imprimimos piezas de catálogo y proyectos personalizados a partir de tus archivos STL.',
      location: 'Belgrano, Buenos Aires · Retiro y envíos express',
      hours: 'Lunes a Viernes de 09:30 a 19:00 hs',
      phone: '+54 9 11 6142-9075',
      instagram: '@forja3d.lab',
      email: 'forja3d.impresiones@gmail.com'
    },
    items: [
      {
        id: 'p1',
        name: 'Lámpara Espiral Voronoi',
        category: 'Iluminación',
        price: 38900,
        stock: 6,
        badge: 'PLA+ Mate',
        artType: 'lamp3d',
        image: 'assets/products/p1.jpg',
        desc: 'Difusor paramétrico de 26 cm de altura con luz LED cálida incluida y cable textil trenzado.',
        optionsLabel: 'Material',
        options: ['PLA+ Mate', 'PETG Translúcido'],
        colors: [
          { name: 'Ámbar Cálido', hex: '#E09F3E' },
          { name: 'Blanco Nieve', hex: '#DCE3EC' },
          { name: 'Cian Neón', hex: '#22D3EE' }
        ]
      },
      {
        id: 'p2',
        name: 'Busto Mecha Coleccionable',
        category: 'Figuras',
        price: 31500,
        stock: 2,
        badge: 'Resina 8K',
        artType: 'figure3d',
        image: 'assets/products/p2.jpg',
        desc: 'Impreso en resina fotopolímera de 50 micras con curado UV, listo para pintar o exhibir.',
        optionsLabel: 'Escala',
        options: ['15 cm', '22 cm (+35%)'],
        colors: [
          { name: 'Gris Primer', hex: '#8894A4' },
          { name: 'Grafito', hex: '#343D4B' },
          { name: 'Cobre Seda', hex: '#B97848' }
        ]
      },
      {
        id: 'p3',
        name: 'Dock Modular de Escritorio',
        category: 'Organización',
        price: 22400,
        stock: 12,
        badge: 'PETG Carbono',
        artType: 'dock3d',
        image: 'assets/products/p3.jpg',
        desc: 'Soporte ergonómico para celular, auriculares y tarjetas SD con pasacables integrado.',
        optionsLabel: 'Material',
        options: ['PLA+ Matte', 'PETG Carbono'],
        colors: [
          { name: 'Negro Carbón', hex: '#252D3A' },
          { name: 'Cian Tech', hex: '#0EA5B7' },
          { name: 'Naranja Maker', hex: '#EA580C' }
        ]
      },
      {
        id: 'p4',
        name: 'Maceta Geométrica Low-Poly',
        category: 'Decoración',
        price: 16800,
        stock: 15,
        badge: 'PLA Madera',
        artType: 'planter3d',
        image: 'assets/products/p4.jpg',
        desc: 'Diseño facetado con drenaje oculto y bandeja encastrable. Ideal para suculentas.',
        optionsLabel: 'Tamaño',
        options: ['Chica (10cm)', 'Mediana (15cm)'],
        colors: [
          { name: 'Obsidiana', hex: '#2B3340' },
          { name: 'Salvia', hex: '#5D8A78' },
          { name: 'Terracota 3D', hex: '#C26D4A' }
        ]
      },
      {
        id: 'p5',
        name: 'Soporte Auriculares Hex',
        category: 'Organización',
        price: 19900,
        stock: 8,
        badge: 'PLA+ Reforzado',
        artType: 'dock3d',
        image: 'assets/products/p5.jpg',
        desc: 'Estructura panal ultraliviana con base antideslizante y curvatura protectora de vincha.',
        optionsLabel: 'Material',
        options: ['PLA+', 'PETG'],
        colors: [
          { name: 'Cian', hex: '#22D3EE' },
          { name: 'Gris Titanio', hex: '#64748B' },
          { name: 'Amarillo Señal', hex: '#EAB308' }
        ]
      },
      {
        id: 'p6',
        name: 'Lámpara Luna Relieve NASA',
        category: 'Iluminación',
        price: 34200,
        stock: 0,
        badge: 'Litofanía',
        artType: 'lamp3d',
        image: 'assets/products/p6.jpg',
        desc: 'Topografía lunar real en litofanía de alta resolución con base de madera y dimmer táctil.',
        optionsLabel: 'Diámetro',
        options: ['15 cm', '20 cm'],
        colors: [
          { name: 'Blanco Lunar', hex: '#E5E7EB' },
          { name: 'Marfil Cálido', hex: '#F3DFC1' }
        ]
      }
    ]
  },

  {
    id: 'comida',
    sectionName: 'Menú de Comida',
    brand: 'BRASA & MASA',
    hubCategory: 'Gastronomía',
    featured: false,
    badge: 'Restaurante & Carta',
    heroImage: 'assets/hero-comida.jpg',
    palette: ['#FBF7F0', '#1F352B', '#C2410C', '#D97706'],
    description: 'Carta digital gastronómica con secciones por plato, etiquetas dietarias (Veggie / Sin TACC) y comanda interactiva.',
    features: ['Categorías de carta', 'Filtro Veggie / Sin TACC', 'Comanda en vivo', 'Mesa o Delivery'],
    heroTag: 'Horno de Barro · Masa Madre 48h',
    heroTitle: 'Cocina de fuego lento, masa viva y producto de estación.',
    heroSubtitle: 'Explorá nuestra carta digital, filtrá por preferencias y armá tu pedido para la mesa o retirar sin demora.',
    cartLabel: 'Tu Pedido',
    categories: ['Todo', 'Entradas', 'Pizzas a la Leña', 'Principales', 'Postres', 'Bebidas'],
    highlights: [
      { title: 'Abierto todos los días', text: 'Mediodía 12:00 a 15:30 · Noche 19:30 a 00:00.' },
      { title: 'Fermentación natural', text: 'Masa madre de 48 horas horneada a 450°C.' },
      { title: 'Opciones inclusivas', text: 'Platos vegetarianos y preparaciones Sin TACC.' }
    ],
    about: {
      story: 'BRASA & MASA es una cocina de fuego y fermentación natural. Trabajamos con masa madre de 48 horas, vegetales de productores locales y cortes seleccionados a las brasas en un ambiente cálido para compartir.',
      location: 'Chacarita, Buenos Aires · Salón y Take Away',
      hours: 'Todos los días · 12:00 a 15:30 y 19:30 a 00:00 hs',
      phone: '+54 9 11 4973-2218',
      instagram: '@brasaymasa.cocina',
      email: 'brasaymasa.reservas@gmail.com'
    },
    items: [
      {
        id: 'c1',
        name: 'Fainá Crocante & Burrata',
        category: 'Entradas',
        price: 11800,
        stock: 14,
        badge: 'Recomendado',
        artType: 'dish_starter',
        image: 'assets/products/c1.jpg',
        desc: 'Fainá fina al horno de leña con burrata fresca, tomates confitados, pesto de albahaca y aceite de oliva.',
        diet: ['Vegetariano', 'Sin TACC'],
        optionsLabel: 'Acompañamiento',
        options: ['Aceite de oliva', 'Aceite picante'],
        colors: [{ name: 'Fresco', hex: '#C2410C' }]
      },
      {
        id: 'c2',
        name: 'Empanadas de Bife a Cuchillo (x3)',
        category: 'Entradas',
        price: 9600,
        stock: 18,
        badge: 'Clásico',
        artType: 'dish_starter',
        image: 'assets/products/c2.jpg',
        desc: 'Carne braseada 6 horas, cebolla caramelizada, pimentón ahumado y salsa llajua aparte.',
        diet: ['Picante'],
        optionsLabel: 'Cocción',
        options: ['Horno de barro', 'Fritas'],
        colors: [{ name: 'Dorado', hex: '#B45309' }]
      },
      {
        id: 'c3',
        name: 'Pizza Margherita Napoletana',
        category: 'Pizzas a la Leña',
        price: 16500,
        stock: 12,
        badge: 'Masa Madre',
        artType: 'dish_pizza',
        image: 'assets/products/c3.jpg',
        desc: 'Salsa de tomate San Marzano, fior di latte, albahaca fresca y oliva extra virgen.',
        diet: ['Vegetariano'],
        optionsLabel: 'Tamaño',
        options: ['Individual (6 porc.)', 'Grande (8 porc.)'],
        colors: [{ name: 'Tomate', hex: '#DC2626' }]
      },
      {
        id: 'c4',
        name: 'Pizza Hongos & Trufa',
        category: 'Pizzas a la Leña',
        price: 19200,
        stock: 3,
        badge: 'Favorita',
        artType: 'dish_pizza',
        image: 'assets/products/c4.jpg',
        desc: 'Base blanca de muzzarella ahumada, gírgolas y portobellos salteados, tomillo y aceite trufado.',
        diet: ['Vegetariano'],
        optionsLabel: 'Tamaño',
        options: ['Individual (6 porc.)', 'Grande (8 porc.)'],
        colors: [{ name: 'Bosque', hex: '#574233' }]
      },
      {
        id: 'c5',
        name: 'Ojo de Bife a las Brasas',
        category: 'Principales',
        price: 26800,
        stock: 6,
        badge: 'Parrilla',
        artType: 'dish_main',
        image: 'assets/products/c5.jpg',
        desc: 'Corte de 380g madurado con manteca de hierbas, papas aplastadas crocantes y chimichurri casero.',
        diet: ['Sin TACC'],
        optionsLabel: 'Punto',
        options: ['Jugoso', 'A punto', 'Bien cocido'],
        colors: [{ name: 'Brasa', hex: '#7C2D12' }]
      },
      {
        id: 'c6',
        name: 'Tagliatelle Caseros al Ragú',
        category: 'Principales',
        price: 18900,
        stock: 9,
        badge: 'Pasta Fresca',
        artType: 'dish_main',
        image: 'assets/products/c6.jpg',
        desc: 'Cintas de huevo amasadas cada mañana con ragú lento de osobuco y parmesano estacionado 18 meses.',
        diet: [],
        optionsLabel: 'Extra',
        options: ['Parmesano extra', 'Sin queso'],
        colors: [{ name: 'Salsa', hex: '#9A3412' }]
      },
      {
        id: 'c7',
        name: 'Tiramisú de la Casa',
        category: 'Postres',
        price: 8900,
        stock: 2,
        badge: 'Artesanal',
        artType: 'dish_dessert',
        image: 'assets/products/c7.jpg',
        desc: 'Mascarpone batido, vainillas embebidas en espresso de especialidad y cacao amargo belga.',
        diet: ['Vegetariano'],
        optionsLabel: 'Porción',
        options: ['Individual', 'Para compartir'],
        colors: [{ name: 'Cacao', hex: '#5C3A21' }]
      },
      {
        id: 'c8',
        name: 'Limonada de Jengibre & Menta',
        category: 'Bebidas',
        price: 5400,
        stock: 25,
        badge: 'Sin Alcohol',
        artType: 'dish_drink',
        image: 'assets/products/c8.jpg',
        desc: 'Exprimida al momento con almíbar de jengibre fresco, hojas de menta y mucho hielo.',
        diet: ['Vegetariano', 'Sin TACC'],
        optionsLabel: 'Formato',
        options: ['Vaso 500ml', 'Jarra 1.2L'],
        colors: [{ name: 'Cítrico', hex: '#CA8A04' }]
      }
    ]
  },

  {
    id: 'objetos',
    sectionName: 'Tienda de Objetos',
    brand: 'OBJETO VIVO',
    hubCategory: 'Diseño',
    featured: false,
    badge: 'Hogar & Diseño',
    heroImage: 'assets/hero-objetos.jpg',
    palette: ['#F5F3EE', '#1E1E1B', '#6B7B6E', '#C48B71'],
    description: 'Curaduría serena de cerámica artesanal, iluminación, aromas y piezas de escritorio con favoritos y carrito.',
    features: ['Curaduría de diseño', 'Guardar favoritos', 'Acabados en vivo', 'Bolsa de compra'],
    heroTag: 'Diseño Cotidiano · Hecho para Durar',
    heroTitle: 'Piezas calmas que transforman cada rincón.',
    heroSubtitle: 'Objetos de cerámica gres, vidrio soplado, madera maciza y bronce cepillado seleccionados por su nobleza.',
    cartLabel: 'Bolsa',
    categories: ['Todo', 'Cerámica', 'Iluminación', 'Escritorio', 'Aromas'],
    highlights: [
      { title: 'Embalaje seguro', text: 'Protección biodegradable certificada contra golpes.' },
      { title: 'Series pequeñas', text: 'Colaboramos con ceramistas y talleres independientes.' },
      { title: 'Envío para regalo', text: 'Tarjeta impresa y caja rígida opcional sin cargo.' }
    ],
    about: {
      story: 'OBJETO VIVO reúne piezas cotidianas hechas a mano en cerámica gres, vidrio soplado y madera maciza. Colaboramos con talleres y artesanos locales para crear objetos serenos que elevan cada espacio del hogar.',
      location: 'Colegiales, Buenos Aires · Tienda y envíos seguros',
      hours: 'Martes a Sábados de 11:00 a 19:30 hs',
      phone: '+54 9 11 3845-6604',
      instagram: '@objetovivo.diseno',
      email: 'objetovivo.hola@gmail.com'
    },
    items: [
      {
        id: 'o1',
        name: 'Florero Gres Orgánico',
        category: 'Cerámica',
        price: 32500,
        stock: 7,
        badge: 'Hecho en torno',
        artType: 'vase',
        image: 'assets/products/o1.jpg',
        desc: 'Cerámica gres horneada a 1240°C con esmalte mineral mate y textura táctil natural.',
        optionsLabel: 'Altura',
        options: ['18 cm', '26 cm'],
        colors: [
          { name: 'Arena', hex: '#D7CBB8' },
          { name: 'Salvia', hex: '#7A8C7D' },
          { name: 'Arcilla', hex: '#B9785D' }
        ]
      },
      {
        id: 'o2',
        name: 'Lámpara Globo Opalina',
        category: 'Iluminación',
        price: 64000,
        stock: 3,
        badge: 'Best Seller',
        artType: 'globe_lamp',
        image: 'assets/products/o2.jpg',
        desc: 'Esfera de vidrio opalino soplado sobre base cilíndrica de travertino o metal cepillado.',
        optionsLabel: 'Base',
        options: ['Travertino', 'Bronce Mate'],
        colors: [
          { name: 'Opalina Cálida', hex: '#EDE7DA' },
          { name: 'Ámbar Suave', hex: '#D9AE7E' },
          { name: 'Humo', hex: '#8F8E89' }
        ]
      },
      {
        id: 'o3',
        name: 'Bandeja Escritorio Nogal',
        category: 'Escritorio',
        price: 27900,
        stock: 10,
        badge: 'Madera Maciza',
        artType: 'tray',
        image: 'assets/products/o3.jpg',
        desc: 'Tallada en una sola pieza de nogal aceitado para ordenar lapiceras, relojes y llaves.',
        optionsLabel: 'Acabado',
        options: ['Aceite natural', 'Ahumado'],
        colors: [
          { name: 'Nogal', hex: '#6F4E37' },
          { name: 'Roble Claro', hex: '#C6A67D' },
          { name: 'Ébano', hex: '#2D2B29' }
        ]
      },
      {
        id: 'o4',
        name: 'Vela Soja Cedro & Higo',
        category: 'Aromas',
        price: 19500,
        stock: 16,
        badge: '50h de duración',
        artType: 'candle',
        image: 'assets/products/o4.jpg',
        desc: 'Cera vegetal pura en vaso de cerámica reutilizable con notas amaderadas e higo verde.',
        optionsLabel: 'Aroma',
        options: ['Cedro & Higo', 'Té Blanco & Bergamota'],
        colors: [
          { name: 'Piedra', hex: '#D6D0C4' },
          { name: 'Oliva', hex: '#6B7B6E' },
          { name: 'Terracota', hex: '#C48B71' }
        ]
      },
      {
        id: 'o5',
        name: 'Set 2 Tazas Espresso Gres',
        category: 'Cerámica',
        price: 24800,
        stock: 8,
        badge: 'Set x2',
        artType: 'cup',
        image: 'assets/products/o5.jpg',
        desc: 'Sin asa, de paredes gruesas para conservar la temperatura exacta del café de especialidad.',
        optionsLabel: 'Capacidad',
        options: ['90 ml (Espresso)', '210 ml (Flat White)'],
        colors: [
          { name: 'Salvia', hex: '#6B7B6E' },
          { name: 'Crema', hex: '#E4DDD1' },
          { name: 'Pizarra', hex: '#3E4140' }
        ]
      },
      {
        id: 'o6',
        name: 'Reloj de Mesa Silencioso',
        category: 'Escritorio',
        price: 39200,
        stock: 4,
        badge: 'Minimal',
        artType: 'clock',
        image: 'assets/products/o6.jpg',
        desc: 'Cuerpo en aluminio anodizado con mecanismo sweep completamente silencioso y cuadrante limpio.',
        optionsLabel: 'Edición',
        options: ['Numerales sutiles', 'Sin números'],
        colors: [
          { name: 'Aluminio', hex: '#B8B8B2' },
          { name: 'Negro Mate', hex: '#262624' },
          { name: 'Salvia', hex: '#6B7B6E' }
        ]
      }
    ]
  }
];
