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
    description: 'Blacknook nedir, nasıl iletişim kurulur ve hangi kanallar canlıdır.',
    articles: [
      {
        id: 'what-is',
        title: 'Blacknook nedir?',
        summary: 'Yazılım ekosistemi: keşif, kurulum ve partner yolları.',
        body: 'Blacknook; bağımsız geliştiriciler ve erken aşama ekipler için bir yazılım ekosistemidir. Bugün canlı kanal Ekosistem’dir: self-host ve iş araçlarını keşfeder, kurulum talebi gönderir veya geliştirici eşleşmesi isteyebilirsiniz. Partner programı ve Blacknook Select, ürününü pazara çıkarmak isteyen ekipler içindir (giriş gerekir). SaaS, Micro-SaaS ve Scriptler kanalları yakında açılacaktır.',
      },
      {
        id: 'contact',
        title: 'Bize nasıl ulaşırım?',
        summary: 'E-posta, WhatsApp topluluğu ve yardım makaleleri.',
        body: 'Platform soruları için contact@blacknook.com adresine yazın. Ticket sistemi yoktur; yanıt süremiz yoğunluğa göre değişebilir. Topluluk sohbeti için footer’daki WhatsApp grubuna katılabilirsiniz. Partner başvuruları /sell üzerinden yapılır. Acil hesap güvenliği için e-posta konu satırına “Hesap güvenliği” yazın. Ürün kurulumuna dair teknik destek, ilgili servis/partner tarafındadır; Blacknook arabuluculuk ve yönlendirme sağlar.',
      },
      {
        id: 'channels',
        title: 'Hangi kanallar canlı, hangileri yakında?',
        summary: 'Ekosistem hub’ı vs SaaS / Micro-SaaS / Scriptler.',
        body: 'Ekosistem hub’ı açıktır: katalogda ürünleri gezip kurulum talebi oluşturabilirsiniz. SaaS, Micro-SaaS ve Scriptler menüde “Yakında” olarak görünür; bu kanallarda henüz satın alma veya liste yayını yoktur. Partner başvurusu ve Select, giriş yaptıktan sonra ilgili sayfalardan ilerler.',
      },
      {
        id: 'tos',
        title: 'Kullanım koşulları ve gizlilik',
        summary: 'Yasal metinlerin nerede olduğu.',
        body: 'Platformu kullanarak Kullanım Koşulları ve Gizlilik Politikası’nı kabul etmiş sayılırsınız. Güncel metinler /terms ve /privacy sayfalarındadır. Partnerler ayrıca başvuru ve listeleme taahhütlerine uyar.',
      },
    ],
  },
  {
    slug: 'servisler',
    title: 'Servisler ve talepler',
    description: 'Keşif, kurulum talebi, destek hattı ve taleplerinizi takip.',
    articles: [
      {
        id: 'browse',
        title: 'Ekosistem hub’ında nasıl gezinirim?',
        summary: 'Arama, kategori filtreleri ve ürün kartları.',
        body: '/services sayfasında arama kutusu ve kategorilerle ürünleri süzebilirsiniz. Bir karta tıklayınca ürün detayına gidersiniz. Filtreler mobilde “Kategoriler” paneli üzerinden açılır. Boş bir kategoride ürün yoksa dürüst bir boş durum mesajı görürsünüz; bu, sahte listeleri doldurmadığımız anlamına gelir.',
      },
      {
        id: 'install-request',
        title: 'Kurulum talebi nasıl gönderilir?',
        summary: 'Ürün sayfasından talep; Hesap → Talepler’de takip.',
        body: 'İlgilendiğiniz servisin sayfasında kurulum talebi formunu doldurun. Giriş yapmanız gerekir; oturum yoksa girişe yönlendirilirsiniz. Gönderilen talepler Hesap → Talepler bölümünde listelenir. Talebiniz Blacknook ekibine iletilir; kurulum veya danışmanlık sürecinin ayrıntıları e-posta veya destek hattı yoluyla netleştirilir.',
      },
      {
        id: 'match',
        title: 'Destek hattı nedir?',
        summary: 'Navbar’daki Destek; AI asistan + teknik ekip ataması.',
        body: 'Destek, anlık yardıma ihtiyaç duyduğunuzda önce yapay zeka asistanıyla konuşmanızı sağlar; ardından uygun bir teknik uzmana bağlanırsınız. Navbar’daki “Destek” veya sağ alttaki yüzen buton ile sohbeti açın (misafir olarak da başlayabilirsiniz). Sistem, desteğe açık hesaplar arasından birini atar; yoksa talep ekibe düşer. Atama olursa Hesap → Mesajlar’da sohbet açılır. Talepler Hesap → Talepler’de de görünür. Destek havuzuna girmek için Profil’den “Desteğe açığım”ı işaretleyin.',
      },
      {
        id: 'track-requests',
        title: 'Taleplerimi nereden takip ederim?',
        summary: 'Hesap → Talepler.',
        body: 'Giriş yaptıktan sonra Hesap → Talepler’den kurulum ve destek taleplerinizi görürsünüz. Henüz talep yoksa boş durum mesajı çıkar. Yeni talep için /services üzerinden bir ürün seçin veya Destek sohbetini kullanın.',
      },
      {
        id: 'cart-notifications',
        title: 'Sepet ve bildirimler ne işe yarar?',
        summary: 'Yazılım sepeti ve hesap bildirimleri.',
        body: 'Navbar’daki sepet, hesap ürünlerinize / yazılım listenize giden kısayoldur (giriş gerekir). Bildirim zili, hesabınıza düşen platform mesajlarını gösterir; oturum yoksa girişe davet eder. Bunlar klasik e-ticaret sepeti veya anlık ticket sistemi değildir.',
      },
    ],
  },
  {
    slug: 'hesap',
    title: 'Hesap yönetimi',
    description: 'Kayıt, şifre sıfırlama ve profil ayarları.',
    articles: [
      {
        id: 'create',
        title: 'Hesap nasıl oluşturulur?',
        summary: 'Kayıt, giriş ve ilk adımlar.',
        body: '/register üzerinden e-posta ve şifrenizle hesap açın. Google ile giriş, yapılandırıldıysa kullanılabilir. Giriş sonrası kurulum/eşleşme talebi gönderebilirsiniz. Ürün listelemek için önce Geliştirici Başvurusu (/developers/apply) gerekir; onay sonrası Geliştirici Portal açılır.',
      },
      {
        id: 'password',
        title: 'Şifremi unuttum',
        summary: 'E-posta ile sıfırlama linki.',
        body: 'Giriş sayfasındaki “Şifrenizi mi unuttunuz?” bağlantısından e-postanıza sıfırlama linki isteyin. Bağlantı sınırlı süre geçerlidir. Mail gelmezse spam klasörünü kontrol edin veya contact@blacknook.com adresine yazın.',
      },
      {
        id: 'profile',
        title: 'Profilimi nereden düzenlerim?',
        summary: 'Hesap menüsü ve sekmeler.',
        body: 'Giriş yaptıktan sonra sağ üstteki hesap menüsünden Profil’e gidin. Talepler ve mesajlar canlıdır. Profilde dil tercihi seçebilirsiniz. Ödeme, kredi ve ödül sayfaları ödeme gelene kadar “henüz açık değil” olarak durur; kart bilgisi toplanmaz.',
      },
    ],
  },
  {
    slug: 'odeme',
    title: 'Ödeme ve faturalama',
    description: 'Bugünkü durum: faturalama ekranı ve yaklaşan ödeme akışları.',
    articles: [
      {
        id: 'methods',
        title: 'Şu an ödeme yapılabiliyor mu?',
        summary: 'Kartlı satın alma henüz canlı değil.',
        body: 'Blacknook’ta şu an tek tıkla ürün satın alma ve kart ödeme akışı yayında değildir. Canlı deneyim keşif, kurulum talebi ve eşleşmedir. Ödeme altyapısı açıldığında üçüncü taraf sağlayıcılar üzerinden işlenecek; kart bilgileri Blacknook sunucularında saklanmayacaktır. Güncel durum için bu yardım merkezi ve /services deneyimine bakın.',
      },
      {
        id: 'invoice',
        title: 'Fatura ve faturalama ekranı',
        summary: 'Hesap → Ödeme & faturalama.',
        body: 'Hesap → Ödeme & faturalama şu an kart formu içermez; satın alma henüz yok. Partner faturalandırma da gerçek sipariş gelene kadar $0 gösterir. Fatura soruları için contact@blacknook.com.',
      },
      {
        id: 'refund',
        title: 'İade politikası (gelecek satın almalar)',
        summary: 'Satın alma açılınca geçerli olacak çerçeve.',
        body: 'Canlı satın alma olmadığı için aktif bir iade kuyruğu yoktur. Satın alma ve lisans satışı açıldığında iade süreleri ürün sayfasında ve Kullanım Koşulları’nda belirtilir. Platform kötüye kullanımı sınırlayabilir. Kurulum talepleri ücretli bir “sipariş iadesi” değildir; süreç iletişimi e-posta üzerinden yürür.',
      },
    ],
  },
  {
    slug: 'urunler',
    title: 'Hesap ürünleri',
    description: 'Ürün listesi, erişim ve yeniden satış kuralları.',
    articles: [
      {
        id: 'access',
        title: 'Hesap → Ürünler ne gösterir?',
        summary: 'Liste ve erişim alanı; klasik lisans kutusu değil.',
        body: 'Hesap → Ürünler, hesabınıza bağlı yazılım / liste öğelerini gösterir. Bugün burası çoğunlukla boş veya yer tutucu olabilir; canlı akış kurulum talepleridir (Hesap → Talepler). Satın alma ve lisans teslimi açıldığında erişim bilgileri burada toplanacaktır. Teknik ürün desteği öncelikle ürün sahibinden sağlanır.',
      },
      {
        id: 'lifetime',
        title: '“Ömür boyu” ifadesi ne anlama gelir?',
        summary: 'Gelecek deal / lisans teklifleri için kapsam notu.',
        body: 'Bazı partner tekliflerinde “ömür boyu” ifadesi geçebilir. Bu, kişisel ömrünüz veya ürünün sonsuza dek aynı özelliklerle kalacağı anlamına gelmez; ürünün ilgili programda tanımlandığı süre ve kapsam için geçerlidir. Bugün Ekosistem hub’ında klasik lifetime deal satışı yoktur.',
      },
      {
        id: 'resell',
        title: 'Ürünü yeniden satabilir miyim?',
        summary: 'Yeniden satış yasağı.',
        body: 'Hayır. Blacknook üzerinden edinilen erişim, lisans veya kurulum çıktılarının yeniden satışı, takası veya ticari paylaşımı yasaktır ve hesap kısıtlamasına yol açabilir.',
      },
    ],
  },
  {
    slug: 'partner',
    title: 'Partner kaynakları',
    description: 'Başvuru, inceleme, Portal ve Select — dürüst süreç notlarıyla.',
    articles: [
      {
        id: 'why-partner',
        title: 'Neden Blacknook partneri olmalıyım?',
        summary: 'Görünürlük, erken kullanıcı ve peşin listeleme ücreti yok.',
        body: 'Blacknook, bağımsız ekiplerin yazılımını iş odaklı alıcılara ulaştırmayı hedefler. Peşin listeleme ücreti yoktur. Bugün hub’da Ekosistem öne çıkar; SaaS / Micro-SaaS / Script kanalları yakında. Select, seçilmiş ürünler için kürasyonlu lansman yoludur. Detay: /sell.',
      },
      {
        id: 'how-to-submit',
        title: 'Nasıl ortak olur ve ürünümü nasıl gönderirim?',
        summary: 'Sell → form → durum takibi (giriş gerekir).',
        body: 'Önce /developers/apply ile Geliştirici Başvurusu yapın. Onay sonrası /partners/self-submission formunu doldurun: ürün bilgisi, medya, özellikler, fiyat planları ve kurucu hikâyesi. Durumu /developers/status veya Geliştirici Portal’dan izleyin. Satış ve fatura sekmeleri onaylı geliştiriciler için açılır.',
      },
      {
        id: 'vetting',
        title: 'Başvuru inceleme süreci nasıl işler?',
        summary: 'Çalışır ürün, net vaat, medya ve destek kapasitesi.',
        body: 'İncelemede ürünün çalışır olması, dürüst değer önerisi, yeterli görsel/medya ve destek planı aranır. Vaporware, yanıltıcı iddia veya destek kanalı tanımsız gönderimler reddedilebilir. Süre dosyanın eksiksizliğine göre değişir; ek bilgi istenebilir.',
      },
      {
        id: 'rejected',
        title: 'Başvurum neden kabul edilmedi?',
        summary: 'Sık red nedenleri ve yeniden gönderme.',
        body: 'Sık nedenler: eksik ekran görüntüsü, belirsiz fiyat/plan, çalışmayan demo veya link, abartılı vaatler, tanımsız destek kanalı. Red notunu durum sayfası veya Portal’dan okuyup formu güncelleyin. Select’e uygun olmayan ürünler standart partner yoluna yine de uygun olabilir.',
      },
      {
        id: 'plan-tiers',
        title: 'Birden fazla plan kademesini nasıl tanımlarım?',
        summary: 'Başvuru formundaki fiyat adımı.',
        body: 'Ürün formundaki fiyat adımında birden fazla plan tanımlayabilirsiniz. Her planın adı, fiyatı ve özellik farkları net olsun. Ortak özellikler ile plana özel satırları ayırın. Alıcıların karşılaştırabilmesi için plan sayısını sade tutun. Canlı satın alma henüz yoksa bile net plan matrisi incelemede önemlidir.',
      },
      {
        id: 'founder-story',
        title: '“Kurucudan” hikâyesini nasıl yazarım?',
        summary: 'Kısa, somut, abartısız.',
        body: 'Kim olduğunuz, hangi sorunu neden çözdüğünüz ve ürünün bugünkü durumu yeterli. Abartmadan sosyal kanıt (kullanıcı, GitHub, lansman) ekleyebilirsiniz. Slogan yerine samimi ve ölçülebilir anlatım tercih edin.',
      },
      {
        id: 'honest-reviews',
        title: 'Dürüst geri bildirim nasıl istenir?',
        summary: 'Sahte puan ve yanıltıcı teşvik yok.',
        body: 'Yalnızca gerçek deneyime dayalı geri bildirim isteyin. İnceleme karşılığı yanıltıcı teşvik veya sahte puan yasaktır. Olumsuz geri bildirime yapıcı yanıt vermek, silmekten daha iyidir.',
      },
      {
        id: 'delivery-plan',
        title: 'Teslimat ve erişim planı nasıl olmalı?',
        summary: 'Kurulum, davet veya lisans — net adımlar yazın.',
        body: 'Başvuruda alıcının ürüne nasıl ulaşacağını netleştirin: kurulum rehberi, hesap daveti, lisans anahtarı veya self-serve aktivasyon. Adımları ürün metninde ve destek dokümanında yazın. Belirsiz teslimat planı incelemede gecikme nedeni olabilir. Bugün hub’da kurulum talebi baskındır; lisanslı deal satışı açıldığında aynı netlik beklenir.',
      },
      {
        id: 'after-approval',
        title: 'Ürünüm onaylandıktan sonra ne yapmalıyım?',
        summary: 'Destek kanalı, Portal ve Select.',
        body: 'Destek e-postanızı ve dokümantasyonu kontrol edin; ilk günler için yanıt beklentisini netleştirin. Geliştirici Portal’dan liste durumunu izleyin. Select’e uygunsa giriş yapıp /select üzerinden kürasyonlu lansmanı değerlendirin. Büyük kırıcı değişiklikleri sessizce yayınlamayın.',
      },
      {
        id: 'support-ready',
        title: 'Lansman için destek hazırlığı',
        summary: 'Bilinen hatalar, kurulum rehberi, şablon yanıtlar.',
        body: 'Yayın öncesi: bilinen hatalar listesi, kurulum rehberi ve sık sorular hazır olsun. Yoğun günlerde şablon yanıtlar kullanın. Blacknook arabuluculuk yapabilir; birinci hat ürün desteği sizdedir.',
      },
      {
        id: 'customer-comms',
        title: 'Geri bildirimlere nasıl yaklaşırım?',
        summary: 'Şeffaflık ve çözüm odaklı ton.',
        body: 'Olumlu geri bildirimlere teşekkür edin; olumsuzlarda sorunu netleştirip çözüm sunun. Tartışmayı kişisel hale getirmeyin. Tekrarlayan şikayetleri yol haritasına alın. Kullanım Koşulları’na aykırı içerikleri Blacknook’a bildirin.',
      },
      {
        id: 'update-offer',
        title: 'Listemi nasıl güncellerim?',
        summary: 'Fiyat, plan ve medya değişiklikleri.',
        body: 'Önemli değişiklikler (fiyat, özellik kaldırma, medya) yeniden incelemeye gidebilir. Daha önce verdiğiniz taahhütleri tek taraflı bozmayın. Güncellemeyi Geliştirici Portal ve ürün formu üzerinden yapın.',
      },
      {
        id: 'buyer-contacts',
        title: 'Alıcı iletişim bilgileri',
        summary: 'Teslimat için gerekli veri; spam yok.',
        body: 'Kurulum veya teslimat için gerekli iletişim bilgileri (ör. e-posta) partner ile paylaşılabilir. Bu veriyi yalnızca teslimat ve destek için kullanın; spam veya üçüncü tarafa satış yasaktır. Detaylar Gizlilik Politikası’ndadır.',
      },
      {
        id: 'listing-cost',
        title: 'Listelemek ne kadara mal olur?',
        summary: 'Peşin ücret yok; gelir paylaşımı ürüne göre.',
        body: 'Başvuru ve standart listeleme peşin ücretsizdir. Gelir paylaşımı ve plan yapısı ürüne göre belirlenir. Select peşin zorunlu maliyet olmadan kürasyon + birlikte lansman mantığıyla çalışır. Güncel koşullar: /sell ve /select.',
      },
      {
        id: 'track-sales',
        title: 'Satış ekranı ne zaman dolacak?',
        summary: 'Portal → Satış; şimdilik boş olabilir.',
        body: 'Onaylı partnerler /partners/sales ekranını görür. Sipariş entegrasyonu ve canlı satın alma tamamlanana kadar özet boş veya sınırlı kalabilir; bu beklenen davranıştır. İade ve sipariş akışları satın alma açıldıkça burada toplanır.',
      },
      {
        id: 'payouts',
        title: 'Ödemeler nasıl işleyecek?',
        summary: 'Dönemsel netleştirme; şimdilik e-posta ile soru.',
        body: 'Canlı satış sonrası partner ödemeleri dönemsel netleştirilecektir. /partners/billing altında brüt / platform payı / net özet yer alır; ödeme yöntemi bağlama satış açıldıkça devreye girer. Bugün sorularınız için contact@blacknook.com kullanın. Portal’daki destek formu arayüz denemesidir; e-posta gönderimi garanti edilmez.',
      },
      {
        id: 'refund-policy-partner',
        title: 'İade ve alıcı taahhüdü',
        summary: 'Satın alma açılınca ürün sayfası + koşullar geçerli.',
        body: 'İade süreleri ürün sayfasında ve Kullanım Koşulları’nda tanımlanır. Kaliteli ürün ve net destek iade baskısını düşürür. Canlı satın alma yokken iade kuyruğu işletilmez; kurulum anlaşmazlıklarında Blacknook arabuluculuk edebilir.',
      },
      {
        id: 'buyer-commitment',
        title: 'Alıcılara karşı taahhüdüm nedir?',
        summary: 'Dürüst özellik listesi ve makul destek.',
        body: 'Listelediğiniz özellikler ve plan kapsamı vaadinizdir. Makul destek, güvenlik yamaları ve erişim sürekliliği beklenir. Ürünü aniden kapatmayı veya erişimi tek taraflı kesmeyi planlıyorsanız önceden duyurun.',
      },
      {
        id: 'portal-nav',
        title: 'Geliştirici Portal’da nasıl gezinirim?',
        summary: 'Menü ve onay sonrası sekmeler.',
        body: 'Geliştirici Portal (/partners/overview) menüsünde kontrol paneli, listeler, satış, fatura ve destek vardır. Geliştirici başvurunuz onaylanmadan ürün ekleme ve satış panelleri kilitlidir. Onay sonrası listelerinizi yönetebilirsiniz. Select için /select; başvuru için /developers/apply.',
      },
      {
        id: 'select-vs-standard',
        title: 'Select ile standart listeleme farkı nedir?',
        summary: 'Kürasyonlu lansman vs partner başvurusu; ikisi de giriş ister.',
        body: 'Standart yol: /sell ve ürün formu ile hub’a başvurmak. Blacknook Select: sınırlı sayıda ürün için strateji ve lansman eşliği. Her iki yol da giriş gerektirir; oturum yoksa login’e yönlendirilirsiniz. Select her başvuruyu almaz; hazır değilseniz standart partner programıyla başlayın.',
      },
    ],
  },
  {
    slug: 'guvenlik',
    title: 'Güvenlik ve gizlilik',
    description: 'Veri koruma ve şüpheli hesap aktivitesi.',
    articles: [
      {
        id: 'data',
        title: 'Verilerim nasıl korunur?',
        summary: 'Gizlilik politikası ve ödeme verisi.',
        body: 'Gizlilik Politikası’nda hangi verileri neden işlediğimizi anlatıyoruz. Ödeme kartı verileri, ödeme altyapısı açıldığında doğrudan üçüncü taraf sağlayıcılarda işlenir; Blacknook kart numarası saklamaz.',
      },
      {
        id: 'breach',
        title: 'Hesabımda şüpheli aktivite görüyorum',
        summary: 'Şifre değişimi ve güvenlik bildirimi.',
        body: 'Hemen şifrenizi değiştirin ve contact@blacknook.com adresine “Hesap güvenliği” konulu bir e-posta gönderin. Mümkünse tarih ve saatleri belirtin.',
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
