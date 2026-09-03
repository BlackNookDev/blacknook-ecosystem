import en from './en';

const fr = {
  ...en,
  nav: {
    ...en.nav,
    openMenu: 'Ouvrir le menu',
    closeMenu: 'Fermer le menu',
    menu: 'Menu',
    support: 'Support',
    ecosystem: 'Écosystème',
    categories: 'Catégories',
    popular: 'Populaire',
    featured: 'À la une',
    browseAll: 'Explorer l’écosystème',
    comingSoon: 'Bientôt',
    site: 'Site',
    language: 'Choisir la langue',
  },
  footer: {
    ...en.footer,
    support: 'Support',
    learn: 'Apprendre',
    developer: 'Développeur',
    copyright: '© {year} Blacknook. Tous droits réservés.',
    help: 'Aide',
    terms: 'Conditions d’utilisation',
    privacy: 'Confidentialité',
    about: 'À propos',
    careers: 'Carrières',
    becomeDeveloper: 'Devenir développeur',
    addProduct: 'Ajouter un produit',
    sell: 'Vendre',
    devPortal: 'Portail développeur',
  },
  home: {
    ...en.home,
    viewDetails: 'Voir les détails',
    prevProduct: 'Produit précédent',
    nextProduct: 'Produit suivant',
    groups: {
      saas: { title: 'Logiciel cloud', more: 'Tout voir' },
      microSaas: { title: 'Mini logiciel', more: 'Tout voir' },
      services: { title: 'Écosystème', more: 'Explorer l’écosystème' },
    },
  },
  account: {
    ...en.account,
    profile: 'Profil',
    notifications: 'Notifications',
    requests: 'Demandes',
    products: 'Produits',
    billing: 'Paiements',
    languageTitle: 'Langue',
    languageDescription:
      'Choisissez la langue de l’interface. L’anglais est par défaut ; turc, espagnol, allemand et français disponibles.',
    languageSaved: 'Préférence de langue enregistrée.',
    savedOnDevice: 'La préférence est enregistrée sur cet appareil',
  },
  support: {
    ...en.support,
    dock: 'Support',
    title: 'Support Blacknook',
    welcome:
      'Bonjour, je suis l’assistant support Blacknook. Je peux vous aider pour l’installation, la sécurité, les intégrations ou les urgences techniques. Décrivez votre problème pendant que nous vous connectons au support technique.',
    placeholder: 'Décrivez votre problème…',
    escalate: 'Contacter l’équipe technique',
    connecting: 'Préparation de la réponse…',
  },
  common: {
    ...en.common,
    loading: 'Chargement…',
    viewAll: 'Tout voir',
    soon: 'Bientôt',
  },
} as const;

export default fr;
