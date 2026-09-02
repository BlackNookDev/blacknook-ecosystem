import en from './en';

const es = {
  ...en,
  nav: {
    ...en.nav,
    openMenu: 'Abrir menú',
    closeMenu: 'Cerrar menú',
    menu: 'Menú',
    support: 'Soporte',
    ecosystem: 'Ecosistema',
    categories: 'Categorías',
    popular: 'Popular',
    featured: 'Destacado',
    browseAll: 'Explorar ecosistema',
    comingSoon: 'Pronto',
    site: 'Sitio',
    language: 'Elegir idioma',
  },
  footer: {
    ...en.footer,
    support: 'Soporte',
    learn: 'Aprender',
    developer: 'Desarrollador',
    copyright: '© {year} BlackNOOK. Todos los derechos reservados.',
    help: 'Ayuda',
    terms: 'Términos de uso',
    privacy: 'Privacidad',
    about: 'Acerca de',
    careers: 'Carreras',
    becomeDeveloper: 'Ser desarrollador',
    addProduct: 'Añadir producto',
    sell: 'Vender',
    devPortal: 'Portal de desarrollador',
  },
  home: {
    ...en.home,
    viewDetails: 'Ver detalles',
    prevProduct: 'Producto anterior',
    nextProduct: 'Siguiente producto',
    groups: {
      saas: { title: 'Software en la nube', more: 'Ver todo' },
      microSaas: { title: 'Mini software', more: 'Ver todo' },
      services: { title: 'Ecosistema', more: 'Explorar ecosistema' },
    },
  },
  account: {
    ...en.account,
    profile: 'Perfil',
    messages: 'Mensajes',
    requests: 'Solicitudes',
    products: 'Productos',
    billing: 'Pagos',
    languageTitle: 'Idioma',
    languageDescription:
      'Elige el idioma de la interfaz. Inglés por defecto; también turco, español, alemán y francés.',
    languageSaved: 'Preferencia de idioma guardada.',
    savedOnDevice: 'La preferencia se guarda en este dispositivo',
  },
  support: {
    ...en.support,
    dock: 'Soporte',
    title: 'Soporte Blacknook',
    welcome:
      'Hola, soy el asistente de soporte de Blacknook. Puedo ayudarte con instalación, seguridad, integraciones o urgencias técnicas. Cuéntame tu problema mientras te conectamos con soporte técnico.',
    placeholder: 'Describe tu problema…',
    escalate: 'Conectar con equipo técnico',
    connecting: 'Preparando respuesta…',
  },
  common: {
    ...en.common,
    loading: 'Cargando…',
    viewAll: 'Ver todo',
    soon: 'Pronto',
  },
} as const;

export default es;
