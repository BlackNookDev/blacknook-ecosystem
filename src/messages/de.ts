import en from './en';

const de = {
  ...en,
  nav: {
    ...en.nav,
    openMenu: 'Menü öffnen',
    closeMenu: 'Menü schließen',
    menu: 'Menü',
    support: 'Support',
    ecosystem: 'Ökosystem',
    categories: 'Kategorien',
    popular: 'Beliebt',
    featured: 'Empfohlen',
    browseAll: 'Ökosystem entdecken',
    comingSoon: 'Bald',
    site: 'Website',
    language: 'Sprache wählen',
  },
  footer: {
    ...en.footer,
    support: 'Support',
    learn: 'Lernen',
    developer: 'Entwickler',
    copyright: '© {year} BlackNOOK. Alle Rechte vorbehalten.',
    help: 'Hilfe',
    terms: 'Nutzungsbedingungen',
    privacy: 'Datenschutz',
    about: 'Über uns',
    careers: 'Karriere',
    becomeDeveloper: 'Entwickler werden',
    addProduct: 'Produkt hinzufügen',
    sell: 'Verkaufen',
    devPortal: 'Entwicklerportal',
  },
  home: {
    ...en.home,
    viewDetails: 'Details ansehen',
    prevProduct: 'Vorheriges Produkt',
    nextProduct: 'Nächstes Produkt',
    groups: {
      saas: { title: 'Cloud-Software', more: 'Alle anzeigen' },
      microSaas: { title: 'Mini-Software', more: 'Alle anzeigen' },
      services: { title: 'Ökosystem', more: 'Ökosystem entdecken' },
    },
  },
  account: {
    ...en.account,
    profile: 'Profil',
    messages: 'Nachrichten',
    requests: 'Anfragen',
    products: 'Produkte',
    billing: 'Zahlungen',
    languageTitle: 'Sprache',
    languageDescription:
      'Wählen Sie die Oberflächensprache. Englisch ist Standard; Türkisch, Spanisch, Deutsch und Französisch verfügbar.',
    languageSaved: 'Spracheinstellung gespeichert.',
    savedOnDevice: 'Einstellung wird auf diesem Gerät gespeichert',
  },
  support: {
    ...en.support,
    dock: 'Support',
    title: 'Blacknook Support',
    welcome:
      'Hallo, ich bin der Blacknook-Support-Assistent. Ich helfe bei Installation, Sicherheit, Integrationen oder dringenden technischen Themen. Beschreiben Sie Ihr Problem, während wir Sie mit dem technischen Team verbinden.',
    placeholder: 'Beschreiben Sie Ihr Problem…',
    escalate: 'Mit Technik-Team verbinden',
    connecting: 'Antwort wird vorbereitet…',
  },
  common: {
    ...en.common,
    loading: 'Wird geladen…',
    viewAll: 'Alle anzeigen',
    soon: 'Bald',
  },
} as const;

export default de;
