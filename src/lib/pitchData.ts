/** Blacknook yatırımcı pitch — içerik kaynağı */

export const PITCH_CONTACT = {
  site: 'blacknook.com',
  siteUrl: 'https://blacknook.com',
  email: 'contact@blacknook.com',
  year: '2026',
  tagline: 'İşletmenin otonom operasyon paneli',
} as const;

/** Hero ön söz — Pazar Problemi ve Dönüşüm İhtiyacı */
export const FOREWORD = {
  badge: 'Ön söz',
  title: 'Pazar Problemi ve Dönüşüm İhtiyacı',
  paragraphs: [
    'Küresel ölçekte yaşanan sosyoekonomik ve jeopolitik dönüşümler, şirketler için operasyonel verimliliği ve dijital adaptasyonu bir tercih olmaktan çıkarıp hayatta kalma şartı haline getirmiştir. Teknolojik dönüşüme ayak uyduramayan işletmeler; artan maliyet baskıları ve daralan pazar payları nedeniyle ciddi finansal risklerle karşı karşıya kalmaktadır. Mevcut kurumsal teknoloji sağlayıcılarının sunduğu çözümler ise yüksek yatırım bütçeleri ve aylar süren geliştirme döngüleri nedeniyle sahadaki acil operasyonel ihtiyaçlara çevik yanıt verememektedir.',
  ],
} as const;

/** Hero sonrası — Blacknook Çözüm ve Operasyon Modeli */
export const OPS_MODEL = {
  badge: 'Çözüm & Operasyon',
  title: 'Blacknook Çözüm ve Operasyon Modeli',
  steps: [
    {
      id: 'discover',
      index: '01',
      title: 'Keşif ve Seçim',
      body: 'Şirketler, Blacknook platformunda doğal dil ile ihtiyaçlarını arar; örneğin "şantiye için fatura sistemi". Doğrulanmış ajanları inceler ve doğrudan sonuca odaklanan çözümü seçer.',
    },
    {
      id: 'deploy',
      index: '02',
      title: 'Otomatik Dağıtım ve Entegrasyon',
      body: 'Kurulum talebiyle birlikte, önceden hazırlanmış ve optimize edilmiş otomasyon scriptleri devreye girer. Modüler mimariler ve hazır dağıtım şablonları sayesinde haftalar süren entegrasyon süreçleri saatler içine indirgenir.',
    },
    {
      id: 'secure',
      index: '03',
      title: 'Mühendislik ve Güvenlik Denetimi',
      body: 'Süreç, Blacknook mühendisleri ve onaylı uzman ağı tarafından denetlenir. Şirketin faaliyet gösterdiği coğrafi lokasyona ve veri egemenliği standartlarına (KVKK vb.) göre sunucu altyapısı optimize edilerek güvenlik ve regülasyon kontrolleri eksiksiz tamamlanır.',
    },
    {
      id: 'operate',
      index: '04',
      title: 'Merkezi Yönetim ve Proaktif Büyüme',
      body: 'Kurumlar, çalışan yapay zekâ sistemlerini Ajan Yönetim Konsolu üzerinden gerçek zamanlı olarak izleyip yönetebilir. Sistem, yalnızca mevcut işi yürütmekle kalmaz; şirketin operasyonel verimini artıracak tamamlayıcı optimizasyon önerilerini proaktif olarak sunmaya devam eder.',
    },
  ],
} as const;

/** Pitch ekip — Arda en sonda; Hüseyin ile aynı unvan (AI DevOps Engineer) */
export const PITCH_TEAM = [
  {
    id: 'mustafa',
    name: 'Mustafa Bilek',
    title: 'Kurucu',
    gender: 'male' as const,
    accent: '#7DD3FC',
  },
  {
    id: 'huseyin',
    name: 'Hüseyin Alav',
    title: 'AI DevOps Engineer',
    gender: 'male' as const,
    accent: '#5EEAD4',
  },
  {
    id: 'irem',
    name: 'Ayşe İrem Çolak',
    title: 'AI Engineer',
    gender: 'female' as const,
    accent: '#F9A8D4',
  },
  {
    id: 'demircan',
    name: 'Demircan Başaran',
    title: 'Marketing Ops',
    gender: 'male' as const,
    accent: '#C4B5FD',
  },
  {
    id: 'duygu',
    name: 'Duygu Tabaklı',
    title: 'Marketing Ops',
    gender: 'female' as const,
    accent: '#FDA4AF',
  },
  {
    id: 'arda',
    name: 'Arda Atasoy',
    title: 'AI DevOps Engineer',
    gender: 'male' as const,
    accent: '#FCD34D',
  },
] as const;

/** Finansal strateji planlaması — yol haritası */
export const PITCH_FINANCIAL_STRATEGY = [
  {
    id: 'infra',
    title: 'Altyapı Maliyetlerinin Optimizasyonu ve Yerel Model Entegrasyonu',
    summary: 'AWS · Google Cloud · RunPod kredileri + NVIDIA Inception',
    body: 'Operasyonun ilk fazında, dışa bağımlı işlem gücü ve servis maliyetlerini asgariye indirmek amaçlanmaktadır. Müşterilere sunulacak otonom altyapı için, önceden ince ayarı yapılmış yerel modellerin kullanılması hedeflenmektedir. Bu modellerin barındırma ve hesaplama giderleri için halihazırda onaylanmış olan 25.000 Dolar AWS, Google Cloud ve 5.000 Dolar RunPod altyapı kredileri kullanılacaktır. Ayrıca NVIDIA Inception programına dahil olunarak sunulan donanım avantajlarından yararlanılması ve teknik maliyetlerin kontrol altında tutulması planlanmaktadır.',
  },
  {
    id: 'teknopark',
    title: 'Teknoloji Geliştirme Bölgelerinde Konumlanma ve Vergi Optimizasyonu',
    summary: 'Bilişim Vadisi · İTÜ Çekirdek · BTM',
    body: 'Şirketin hukuki ve operasyonel yapısının Bilişim Vadisi, İTÜ Çekirdek veya BTM gibi teknoloji kuluçka merkezleri bünyesinde kurulması planlanmaktadır. Bu yapı ile, üretilecek yazılım lisans gelirlerinin Kurumlar Vergisi ve KDV istisnası kapsamına alınması, personel tarafındaki yasal prim teşvikleriyle birlikte şirketin net kârlılığının korunması hedeflenmektedir.',
  },
  {
    id: 'ito',
    title: 'İstanbul Ticaret Odası ve Kurumsal Ağlar Üzerinden Dağıtım',
    summary: 'İTO 900.000 işletme · kurumsal ağ etkisi',
    body: 'Müşteri edinme maliyetini düşürmek amacıyla bireysel saha aramaları yerine doğrudan kurumsal ağ etkisinden faydalanılması hedeflenmektedir. İTO bünyesinde yer alan 900.000 kayıtlı işletmeye ve teknoloji geliştirme merkezlerinin kurumsal paydaşlarına, sektörel işbirlikleri ve iş dünyası buluşmaları aracılığıyla doğrudan erişim sağlanarak yayılma sürecinin başlatılması öngörülmektedir.',
  },
  {
    id: 'pricing',
    title: 'Fiyatlandırma Stratejisi ve İlk Gelir Akışının Sağlanması',
    summary: 'Kurulum: 50.000 · 100.000 · 180.000 TL',
    body: 'Sistemi ilk aşamada benimseyecek müşteri grubuna yönelik kademelendirilmiş bir fiyatlandırma modelinin uygulanması planlanmaktadır. Müşterinin veri büyüklüğü ve entegrasyon derinliğine bağlı olarak 50.000 TL, 100.000 TL veya 180.000 TL seviyelerinde tek seferlik kurulum bedelleri belirlenerek, başlangıç dönemindeki operasyonel nakit ihtiyacının doğrudan satış gelirleriyle karşılanması hedeflenmektedir.',
  },
  {
    id: 'hiring',
    title: 'Gelire Dayalı İstihdam ve Bütçe Disiplini',
    summary: 'Çekirdek bütçe · İŞKUR · kademeli büyüme',
    body: 'Elde edilmesi öngörülen ilk kurulum gelirlerinin, şirketin personel bütçesinin temel kaynağını oluşturması planlanmaktadır. Organizasyon yapısının ilk günden yüksek bordro yüküyle kurulmaması benimsenmiştir. Sürecin çekirdek bütçe ile başlatılması; İŞKUR eğitim programları desteğiyle, aktif müşteri sayısı ve aylık düzenli gelir artışına paralel olarak kademeli bir istihdam genişlemesi hedeflenmektedir.',
  },
  {
    id: 'sectors',
    title: 'Sektörel Dernek İşbirlikleri ve Portföy Genişletme',
    summary: 'Üretim · perakende · sağlık · e-ticaret',
    body: 'İlk müşteri kurulumlarının tamamlanması ve ölçülebilir verimlilik çıktılarının elde edilmesinin ardından büyüme stratejisinin sektörel alanlara kaydırılması planlanmaktadır. Üretim, perakende, sağlık ve e-ticaret alanlarında faaliyet gösteren kurumsal dernekler ve çatı kuruluşlarla temaslar kurularak çözümün kurumsal bir standart olarak yaygınlaşması amaçlanmaktadır.',
  },
  {
    id: 'public-funds',
    title: 'Kamu Destek ve Fon Süreçlerinin Planlanması',
    summary: 'TÜBİTAK 1507 · 1711 Yapay Zekâ Ekosistem',
    body: 'Kurumsal entegrasyon taleplerinin getireceği Ar-Ge ve geliştirme maliyetlerinin dengelenmesi adına kamu destek programlarına başvuru yapılması planlanmaktadır. Proje mimarisinin TÜBİTAK 1507 ile 1711 Yapay Zekâ Ekosistem Çağrısı gibi mekanizmalara dahil edilmesi ve onaylanması durumunda personel ile donanım giderlerine hibe katkısı sağlanması hedeflenmektedir.',
  },
  {
    id: 'breakeven',
    title: 'Operasyonel Başa Baş Noktasına Ulaşılması',
    summary: '30–40 müşteri · aylık ~18.500 TL retainer',
    body: 'Müşteri portföyünün 30 ila 40 işletme seviyesine ulaşması senaryosunda, her işletmeden tahsil edilecek aylık ortalama 18.500 TL tutarındaki düzenli lisans ve altyapı bedelinin, şirketin tüm sabit operasyonel giderlerini karşılayacak seviyeye gelmesi öngörülmektedir. Bu aşama ile şirketin dış kaynağa ihtiyaç duymadan operasyonlarını sürdürebilir hale gelmesi hedeflenmektedir.',
  },
  {
    id: 'standardize',
    title: 'Kurulum Süreçlerinin Standardizasyonu ve Ölçeklenme',
    summary: '200+ protokol · günler içinde kurulum',
    body: 'Artan kurumsal talebi karşılayabilmek adına teknik devreye alma adımlarının otomatikleştirilmesi planlanmaktadır. Sisteme dahil edilmiş 200 üzeri hazır bağlantı protokolü ve yapılandırılmış veri şablonları sayesinde, yeni bir kurumsal müşterinin kurulum süresinin günler seviyesine indirilmesi hedeflenmektedir. Bu standardizasyonun, teknik iş yükünü düşürürken operasyonel verimliliği artırması öngörülmektedir.',
  },
  {
    id: 'year1',
    title: 'İlk Faaliyet Yılı Hedefleri ve Finansal Görünüm',
    summary: '12 ay · 100 aktif kurumsal müşteri',
    body: 'İlk 12 aylık faaliyet dönemi sonunda toplam 100 aktif kurumsal müşteri portföyüne ulaşılması planlanmaktadır. Bu çerçevede, aylık düzenli lisans gelirleri üzerinden öngörülebilir ve sürdürülebilir bir ciro tabanı oluşturulması amaçlanmaktadır. Altyapı giderlerinin onaylanan hibelerle dengelendiği ve istihdamın kademeli büyütüldüğü bu modelin, yatırımcı açısından düzenli nakit akışı ve istikrarlı bir değer artışı potansiyeli sunması öngörülmektedir.',
  },
] as const;

/** Daha önce geliştirilen Ar-Ge projeleri (pitch video / canlı demo kartları) */
export const PITCH_ARGE_PROJECTS = [
  {
    id: 'percepta',
    title: 'Percepta',
    subtitle: 'Siber Güvenlik',
    body: 'Nikto, nmap ve dirb ile web güvenlik açıklarını otomatik tespit eden kullanıcı dostu bir tarama platformu.',
    src: '/pitch/arge/percepta.mp4' as string | null,
    href: null as string | null,
  },
  {
    id: 'genimate',
    title: 'Genimate',
    subtitle: 'Üretken Medya',
    body: 'Birden fazla yapay zekâ modelini birleştirerek film prodüksiyonunu hızlı, verimli ve ekonomik hale getiren içerik üretim aracı.',
    src: '/pitch/arge/genimate.mp4' as string | null,
    href: null as string | null,
  },
  {
    id: 'mapeg',
    title: 'Mapeg',
    subtitle: 'Harita & Konum',
    body: 'Harita ve konum verilerini operasyonel kararlara dönüştüren coğrafi zekâ platformu.',
    src: '/pitch/arge/mapeg.mp4' as string | null,
    href: null as string | null,
  },
  {
    id: 'hilal',
    title: 'Hilal',
    subtitle: 'Sesli Asistan',
    body: 'Kurumsal süreçlerde doğal dil ile etkileşim sağlayan sesli asistan çözümü.',
    src: '/pitch/arge/felix.mp4' as string | null,
    href: null as string | null,
  },
  {
    id: 'pastela',
    title: 'Pastela',
    subtitle: 'Kumaş Tasarım Otomasyonu',
    body: 'Yapay zekâ ile kumaş deseni oluşturup ölçekleyen ve ürüne uygulayan AI Fabric Design Studio.',
    src: null as string | null,
    href: 'https://pastela-studio.vercel.app/',
  },
] as const;

/** Ar-Ge projeleri basın yansımaları */
export const PITCH_ARGE_PRESS = [
  {
    id: 'forbes-genimate',
    label: 'Forbes',
    title: 'Google Guilty Again… Touchcast AI',
    href: 'https://www.forbes.com/sites/charliefink/2025/04/17/google-guilty-again-meta-on-trial-openai-social-ir-rolls-up-touchcast-ai/',
  },
  {
    id: 'haberler-genimate',
    label: 'Haberler.com',
    title: 'Türk teknoloji şirketi Horiar, Genimate teknolojisini tanıttı',
    href: 'https://www.haberler.com/teknoloji/turk-teknoloji-sirketi-horiar-genimate-18143249-haberi/',
  },
] as const;

/** Proje kapsamındaki hibe ve teşvik programları */
export const PITCH_GRANTS = [
  {
    id: 'tubitak-1507',
    title: 'TÜBİTAK 1507',
    subtitle: 'KOBİ Başlangıç Ar-Ge Desteği',
    body: 'İlk Ar-Ge fazındaki personel ve donanım maliyetlerini %75 oranında nakit karşılar.',
    limits: 'Alt Limit: Yok — Üst Limit: 3.500.000 TL',
  },
  {
    id: 'tubitak-1501',
    title: 'TÜBİTAK 1501',
    subtitle: 'Sanayi Ar-Ge Desteği',
    body: 'Sistemin kurumsal ölçekte büyümesini sağlayacak ileri düzey Ar-Ge faaliyetleri içindir.',
    limits:
      'Alt Limit: Yok — Proje Bütçesi Sınırı: Yok / TÜBİTAK Destek Üst Limiti: 20.000.000 TL',
  },
  {
    id: 'tubitak-1707',
    title: 'TÜBİTAK 1707',
    subtitle: 'Siparişe Dayalı Ar-Ge Desteği',
    body: 'Müşterisi hazır olan kurumsal entegrasyon projelerinde maliyeti devlet ve müşteri ile paylaştırır.',
    limits: 'Alt Limit: Yok — Üst Limit: 5.000.000 TL',
  },
  {
    id: 'kosgeb-girisimci',
    title: 'KOSGEB Girişimci Destek Programı',
    subtitle: null as string | null,
    body: 'Şirket kuruluş fazında makine, bilgisayar, sunucu ve yazılım giderlerini geri ödemesiz finanse eder.',
    limits: 'Alt Limit: Yok — Üst Limit: 2.000.000 TL / İleri Teknoloji Sınıfı',
  },
  {
    id: 'kosgeb-arge',
    title: 'KOSGEB Ar-Ge, Ür-Ge ve İnovasyon Desteği',
    subtitle: null as string | null,
    body: 'Sisteme eklenecek yeni yapay zekâ modüllerinin geliştirilme masraflarını karşılar.',
    limits: 'Alt Limit: Yok — Üst Limit: 14.000.000 TL',
  },
  {
    id: 'kosgeb-teknoyatirim',
    title: 'KOSGEB KOBİ Teknoyatırım Desteği',
    subtitle: null as string | null,
    body: 'Ticarileşmiş ürünlerin büyük ölçekli pazarlama ve donanım yatırımlarını destekler.',
    limits: 'Alt Limit: Yok — Üst Limit: 40.000.000 TL',
  },
  {
    id: 'teknopark-5746',
    title: 'Teknopark & 5746 SGK Teşvikleri',
    subtitle: 'Teknoloji Geliştirme Bölgeleri',
    body: 'Yazılım gelirlerini Kurumlar Vergisi ve KDV’den muaf tutar; personel SGK ve stopaj yükünü devlete devreder.',
    limits:
      'Alt / Üst Limit Yok: Elde edilen kâra ve istihdam edilen personel sayısına göre limitsiz %100 muafiyet',
  },
  {
    id: 'iskur-iep',
    title: 'İŞKUR İşbaşı Eğitim Programı',
    subtitle: null as string | null,
    body: 'Satış ve destek ekiplerinin ilk aylardaki maaş ve prim yükünü üstlenir.',
    limits:
      'Alt / Üst Limit Yok: Personel başına aylık net asgari ücret tutarında 6–9 aya kadar limitsiz destek',
  },
  {
    id: 'ticaret-5447',
    title: 'Ticaret Bakanlığı Bilişim Destekleri',
    subtitle: '5447 Sayılı Karar',
    body: 'Yurt dışına açılım sürecinde reklam, sunucu ve lisans giderlerinin %50–%70’ini iade eder.',
    limits: 'Alt Limit: Yok — Üst Limit: Kalem bazında yıllık 1.200.000–4.800.000 TL',
  },
  {
    id: 'nvidia-inception',
    title: 'NVIDIA Inception Programı',
    subtitle: null as string | null,
    body: 'Kurumların kendi sunucularında çalıştırılacak açık kaynak modeller için destek sağlar.',
    limits: 'Alt Limit: 10.000 $ — Üst Limit: 100.000 $ eşdeğerinde bulut ve donanım kredisi',
  },
  {
    id: 'tubitak-1711',
    title: 'TÜBİTAK 1711',
    subtitle: 'Yapay Zekâ Ekosistem Çağrısı',
    body: 'Müşterisi hazır olan yapay zekâ entegrasyonu projelerinde (Blacknook’un müşteri şirketlere özel ajan/kokpit geliştirmesi) teknoloji sağlayıcısına yüksek oranda hibe sunar.',
    limits: 'Alt Limit: Yok — Üst Limit: 5.000.000 TL',
  },
  {
    id: 'tubitak-1812',
    title: 'TÜBİTAK 1812',
    subtitle: 'Yatırım Tabanlı Girişimcilik Destek Programı / BİGG',
    body: 'Tohum aşamasındaki teknoloji tabanlı girişimlere, doğrudan TÜBİTAK BİGG Fonu üzerinden hisse karşılığı yatırım (veya hibe) yaparak sermaye enjeksiyonu sağlar.',
    limits: 'Alt Limit: Yok — Üst Limit: Aşama 2 için 1.350.000 TL / Aşama 3 için 8.000.000 TL',
  },
  {
    id: 'tubitak-1505',
    title: 'TÜBİTAK 1505',
    subtitle: 'Üniversite-Sanayi İşbirliği Destek Programı',
    body: 'Otonom kokpitin veya arama motorunun arka planındaki yapay zekâ modelini optimize etmek için bir üniversite veya akademisyen ile ortak çalışmaların bütçesini fonlar.',
    limits: 'Alt Limit: Yok — Üst Limit: 2.300.000 TL TÜBİTAK Katkısı',
  },
  {
    id: 'cloud-startup',
    title: 'AWS Activate / Google for Startups / Microsoft Founders Hub',
    subtitle: null as string | null,
    body: 'Müşteri sayısı arttıkça bulut maliyetlerinin şişmesini engellemek için, büyüme aşamasındaki yapay zekâ girişimlerine sağlanan karşılıksız kredi programlarıdır.',
    limits:
      'Alt Limit: 2.000 $ — Üst Limit: 350.000 $ bulut kredisi / Platforma ve büyüme aşamasına göre değişir',
  },
] as const;

export const VISION_TEXT =
  'Blacknook, departman ajanlarını ve MCP’leri tek kokpitte çalıştıran kurumsal otonomi katmanıdır. Keşif katmanı doğal dil aramasıyla doğru çözümü bulur; kurulum ve onboarding platform tarafından yönetilir.';

export const PROBLEM_INTRO =
  'Operasyon dağınık, ajanlar çoğalıyor, kurulum ve yönetişim ayrı birer proje haline geliyor.';

export const PROBLEM_HIGHLIGHTS = [
  {
    id: 'tools',
    title: 'Araç enflasyonu',
    text: 'Her departman kendi SaaS’ını seçiyor; entegrasyon maliyeti katlanıyor.',
  },
  {
    id: 'agents',
    title: 'Ajan kaosı',
    text: 'MCP ve AI ajanları artıyor ama tek bir işletim yüzeyi yok.',
  },
  {
    id: 'setup',
    title: 'Kurulum sürtünmesi',
    text: 'Doğru ürünü bulmak yetmiyor; güvenli kurulum ve destek eksik kalıyor.',
  },
] as const;

export const SOLUTION_INTRO =
  'Keşfet → Kur → İşlet. Doğal dil keşfi bulur; yönetilen kurulum bağlar; otonom panel işletir.';

export const SOLUTION_COMPARISON = [
  {
    pain: 'Dağınık WhatsApp, ERP, CRM, ticket araçları',
    benefit: 'Tek otonom kokpitte departman ajanları',
  },
  {
    pain: 'Hangi MCP / ajan? Keşif ve deneme maliyeti yüksek',
    benefit: 'Doğal dil arama + katalog + ürün önizlemesi',
  },
  {
    pain: 'Kurulum IT darboğazında takılıyor',
    benefit: 'Platform yönetimli anahtar teslim kurulum hattı',
  },
  {
    pain: 'Ajanlar satır satır yönetilemiyor',
    benefit: 'Studio + entegrasyon + departman yüzeyi',
  },
] as const;

export const PRODUCT_FEATURES = [
  'Departman kokpiti',
  'Agent Studio',
  'Entegrasyon yönetimi',
  'MCP / ajan kataloğu',
  'Doğal dil keşif',
  'Yönetilen kurulum',
] as const;

export const BUSINESS_MODEL = [
  {
    title: 'Yönetilen kurulum',
    bullets: [
      'Kurulum talep formu',
      'KVKK / bulut / on-prem seçenekleri',
      'Operasyon ekibi uçtan uca onboarding',
    ],
  },
  {
    title: 'Kurumsal otonomi',
    bullets: ['Panel paketi', 'Entegrasyon işletimi', 'Ajan runtime'],
  },
  {
    title: 'Platform lisansı',
    bullets: ['Aylık retainer', 'Kendi model / compute (anlatım)', 'SLA’lı hero ajanlar'],
  },
  {
    title: 'Altyapı esnekliği',
    bullets: [
      'AWS / GPU (kredi ile)',
      'KVKK uyumlu barındırma',
      'Müşteri sunucusu (on-prem)',
    ],
  },
] as const;

export const COMPETITION = {
  headers: ['Yetenek', 'AI chat', 'SaaS market', 'Tek ürün', 'Blacknook'] as const,
  rows: [
    { feature: 'Departman kokpiti', values: ['✗', '✗', '○', '✓'] as const },
    { feature: 'MCP / ajan kataloğu', values: ['○', '✓', '○', '✓'] as const },
    { feature: 'Yönetilen kurulum', values: ['✗', '○', '○', '✓'] as const },
    { feature: 'Ürün önizlemesi', values: ['✗', '○', '✓', '✓'] as const },
    { feature: 'KVKK / on-prem seçenek', values: ['✗', '○', '○', '✓'] as const },
    { feature: 'Keşfet→Kur→İşlet', values: ['✗', '○', '✗', '★'] as const },
  ],
} as const;

export const COMPETITIVE_ADVANTAGE = [
  'B ana ürün: otonom panel — A destek: keşif + yönetilen kurulum',
  '200+ MCP + 7 vitrin ajanı + canlı önizlemeler',
  'Kurulum talebinden departman işletimine tek zincir; açık pazaryeri eşleşmesi yok',
] as const;

export const TRACTION_STATS = [
  { value: 7, suffix: '', label: 'Vitrin ajanı' },
  { value: 200, suffix: '+', label: 'MCP kataloğu' },
  { value: 16, suffix: '', label: 'Departman yüzeyi' },
  { value: 1, suffix: '', label: 'Otonom kokpit' },
] as const;

export const FLOW_STEPS = [
  { layer: 'A', title: 'Keşfet', body: 'Niyet araması ve katalog' },
  { layer: 'A→B', title: 'Kur', body: 'Yönetilen kurulum talebi' },
  { layer: 'B', title: 'İşlet', body: 'Departman panelinde runtime' },
] as const;
