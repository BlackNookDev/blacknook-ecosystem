export type HelpArticle = {
  id: string;
  title: string;
  /** Liste ve aramada görünen kısa alt açıklama */
  summary: string;
  body: string;
};

export type HelpCategory = {
  slug: string;
  title: string;
  description: string;
  articles: HelpArticle[];
};

export const HELP_CATEGORIES: HelpCategory[] = [
  {
    slug: 'genel',
    title: 'Genel bilgiler',
    description: 'Blacknook nedir, nasıl iletişim kurulur ve hangi yüzeyler canlıdır.',
    articles: [
      {
        id: 'what-is',
        title: 'Blacknook nedir?',
        summary: 'Otonom panel, katalog ve yönetilen kurulum.',
        body: 'Blacknook; departman ajanlarını ve MCP’leri tek kokpitte çalıştıran kurumsal otonomi katmanıdır. Katalogdan keşfeder, “Kurulum Talep Et” ile KVKK / bulut / kendi sunucunuz seçeneklerinden biriyle yönetilen onboarding başlatırsınız. Ana işletim yüzeyi /agent departman panelidir.',
      },
      {
        id: 'contact',
        title: 'Bize nasıl ulaşırım?',
        summary: 'E-posta, WhatsApp topluluğu ve yardım makaleleri.',
        body: 'Platform soruları için contact@blacknook.com adresine yazın. Giriş yaptıktan sonra sağ alttaki yüzen Destek balonu ile sohbet açabilirsiniz. Kurulum talepleri “Kurulum Talep Et” ile açılır; operasyon ekibine e-posta ve admin paneline düşer. Acil hesap güvenliği için e-posta konu satırına “Hesap güvenliği” yazın.',
      },
      {
        id: 'channels',
        title: 'Hangi yüzeyler canlı?',
        summary: 'Katalog, kurulum, departman paneli.',
        body: 'Canlı: ajan kataloğu (/services), ürün detayı ve simülasyonlar, Kurulum Talep Et, departman paneli (/agent), Studio ve entegrasyon yönetimi. Destek balonu yalnızca giriş sonrası görünür. Yardım merkezi ve hesap sayfaları da açıktır.',
      },
      {
        id: 'tos',
        title: 'Kullanım koşulları ve gizlilik',
        summary: 'Yasal metinlerin nerede olduğu.',
        body: 'Platformu kullanarak Kullanım Koşulları ve Gizlilik Politikası’nı kabul etmiş sayılırsınız. Güncel metinler /terms ve /privacy sayfalarındadır.',
      },
    ],
  },
  {
    slug: 'servisler',
    title: 'Keşif ve kurulum',
    description: 'Katalog, kurulum talebi ve takip.',
    articles: [
      {
        id: 'browse',
        title: 'Kataloğu nasıl gezerim?',
        summary: 'Arama, kategori filtreleri ve ürün kartları.',
        body: '/services sayfasında arama ve kategorilerle ajanları süzebilirsiniz. Ana sayfadaki doğal dil araması da aynı kataloğu tarar. Bir karta tıklayınca ürün detayına gidersiniz.',
      },
      {
        id: 'install-request',
        title: 'Kurulum talebi nasıl gönderilir?',
        summary: 'Kurulum Talep Et → Hesap → Talepler.',
        body: 'Ana sayfa, katalog veya ürün sayfasındaki “Kurulum Talep Et” ile önce kayıt / giriş yaparsınız; ardından Hesap → detaylı kurulum formunu doldurursunuz. Ortam seçimi: KVKK uyumlu sistem, bulut veya kendi sunucunuz. Talepler Hesap → Talepler’de listelenir.',
      },
      {
        id: 'support-chat',
        title: 'Destek sohbeti nedir?',
        summary: 'Giriş sonrası yüzen Destek balonu — AI asistan + e-posta.',
        body: 'Destek sohbeti yalnızca giriş yaptıktan sonra sağ alttaki yüzen balondan açılır. Önce yapay zeka asistanı yanıtlar; gerekirse ekibe e-posta ile iletilir. Destek, kurulum kuyruğuna yazılmaz. Ürün kurulumu için “Kurulum Talep Et” (giriş sonrası detay form) kullanın.',
      },
      {
        id: 'track-requests',
        title: 'Kurulum taleplerimi nereden takip ederim?',
        summary: 'Hesap → Talepler.',
        body: 'Giriş yaptıktan sonra Hesap → Talepler’den kurulum taleplerinizi görürsünüz. Yeni talep için katalogdan bir ajan seçip Kurulum Talep Et kullanın.',
      },
      {
        id: 'cart-notifications',
        title: 'Sepet ve bildirimler',
        summary: 'Hesap kısayolları.',
        body: 'Navbar’daki sepet hesap ürünlerinize giden kısayoldur. Bildirim zili kurulum ve platform mesajlarını gösterir.',
      },
    ],
  },
  {
    slug: 'panel',
    title: 'Departman paneli',
    description: '/agent kokpiti, Studio ve entegrasyonlar.',
    articles: [
      {
        id: 'agent-overview',
        title: '/agent nedir?',
        summary: 'Otonom departman kokpiti.',
        body: 'Giriş sonrası /agent, şirket departmanlarına göre ajanları görmenizi ve yönetmenizi sağlar. Genel bakış, departman çalışma alanları, Studio ve entegrasyon yönetimi buradadır.',
      },
      {
        id: 'studio',
        title: 'Agent Studio ne işe yarar?',
        summary: 'Prompt ile ajan / dosya üretimi.',
        body: '/agent/studio üzerinden doğal dil ile ajan yapılandırması veya dosya üretimi başlatabilirsiniz. Üretim sonucu önizleme ve (yapılandırıldıysa) workspace bağlantısı sunar.',
      },
      {
        id: 'integrations',
        title: 'Entegrasyonlar',
        summary: 'Kurumsal uygulamaları bağlama.',
        body: '/agent/manage/integrations altında WhatsApp, ERP ve diğer uygulamaları departmanlara bağlama yüzeyi vardır. Bazı bağlantılar kurulum randevusu veya IT delege akışıyla ilerler.',
      },
    ],
  },
  {
    slug: 'hesap',
    title: 'Hesap yönetimi',
    description: 'Kayıt, şifre sıfırlama ve profil.',
    articles: [
      {
        id: 'create',
        title: 'Hesap nasıl oluşturulur?',
        summary: 'Kayıt, giriş ve ilk adımlar.',
        body: '/register ile e-posta ve şifrenizle hesap açın. Google ile giriş yapılandırıldıysa kullanılabilir. Giriş sonrası katalogdan kurulum talep edebilir ve /agent paneline geçebilirsiniz.',
      },
      {
        id: 'password',
        title: 'Şifremi unuttum',
        summary: 'E-posta ile sıfırlama linki.',
        body: 'Giriş sayfasındaki “Şifrenizi mi unuttunuz?” bağlantısından e-postanıza sıfırlama linki isteyin. Mail gelmezse spam klasörünü kontrol edin veya contact@blacknook.com yazın.',
      },
      {
        id: 'profile',
        title: 'Profilimi nereden düzenlerim?',
        summary: 'Hesap menüsü.',
        body: 'Sağ üst hesap menüsünden Profil’e gidin. Talepler ve mesajlar canlıdır. Ödeme ekranları kartlı satın alma açılana kadar sınırlıdır.',
      },
    ],
  },
  {
    slug: 'odeme',
    title: 'Ödeme ve faturalama',
    description: 'Bugünkü durum.',
    articles: [
      {
        id: 'methods',
        title: 'Şu an ödeme yapılabiliyor mu?',
        summary: 'Kartlı satın alma henüz canlı değil.',
        body: 'Tek tıkla kartlı satın alma yayında değildir. Canlı deneyim: keşif, yönetilen kurulum talebi ve /agent paneli. Kurulum ve lisans fiyatlandırması operasyon ile netleştirilir.',
      },
      {
        id: 'invoice',
        title: 'Fatura ekranı',
        summary: 'Hesap → Ödeme & faturalama.',
        body: 'Hesap → Ödeme & faturalama şu an kart formu içermez. Fatura soruları için contact@blacknook.com.',
      },
      {
        id: 'refund',
        title: 'İade',
        summary: 'Kurulum süreçleri sipariş iadesi değildir.',
        body: 'Kurulum talepleri e-ticaret siparişi değildir; süreç e-posta ve operasyon ile yürür. Canlı lisans satışı açıldığında iade koşulları ürün ve kullanım metinlerinde belirtilir.',
      },
    ],
  },
  {
    slug: 'guvenlik',
    title: 'Güvenlik ve gizlilik',
    description: 'Veri koruma ve şüpheli aktivite.',
    articles: [
      {
        id: 'data',
        title: 'Verilerim nasıl korunur?',
        summary: 'Gizlilik politikası.',
        body: 'Gizlilik Politikası’nda hangi verileri neden işlediğimizi anlatıyoruz. Ödeme kartı verileri, ödeme altyapısı açıldığında üçüncü taraf sağlayıcılarda işlenir; Blacknook kart numarası saklamaz. Kurulumda KVKK / bulut / kendi sunucu seçenekleri sunulur.',
      },
      {
        id: 'breach',
        title: 'Şüpheli hesap aktivitesi',
        summary: 'Şifre değişimi ve bildirim.',
        body: 'Hemen şifrenizi değiştirin ve contact@blacknook.com adresine “Hesap güvenliği” konulu e-posta gönderin.',
      },
    ],
  },
];

export function getHelpCategory(slug: string) {
  return HELP_CATEGORIES.find((c) => c.slug === slug) ?? null;
}

export function searchHelp(query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const hits: { category: HelpCategory; article: HelpArticle }[] = [];
  for (const category of HELP_CATEGORIES) {
    for (const article of category.articles) {
      const hay = `${category.title} ${article.title} ${article.summary} ${article.body}`.toLowerCase();
      if (hay.includes(q)) hits.push({ category, article });
    }
  }
  return hits;
}
