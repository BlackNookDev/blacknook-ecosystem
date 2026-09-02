export interface ServiceCatalogItem {
  slug: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  features: string[];
  about: string;
  useCases: string[];
  listingType?: 'saas' | 'micro-saas' | 'service';
  /** Canlı demo / yayın simülasyonu URL’si */
  demoUrl?: string;
}

export type ServiceCatalogEntry = ServiceCatalogItem & {
  brandColor: string;
  coverImage?: string;
  iconImage?: string;
  source?: 'catalog' | 'marketplace';
  listingType?: 'saas' | 'micro-saas' | 'service';
  verified?: boolean;
  vendorName?: string;
};

export const SERVICES: ServiceCatalogEntry[] = [
  {
    slug: 'ghost',
    name: 'Ghost',
    description: 'Yaratıcılar ve yayıncılar için modern, bağımsız içerik platformu.',
    icon: 'ghost',
    category: 'Yayın & CMS',
    brandColor: '#15171A',
    features: [
      'Markdown ve zengin editör ile yazım deneyimi',
      'Üyelik, abonelik ve Stripe ile ücretli içerik',
      'SEO ve sitemap desteği',
      'REST Content API ve Admin API',
      'ActivityPub (sosyal web) ve yerleşik analitik',
    ],
    about:
      'Ghost, 2013\'ten beri geliştirilen açık kaynaklı bir yayıncılık platformudur; blog, bülten ve üyelik tabanlı medya sitelerini tek bir Node.js uygulamasında birleştirir. Ghost 6 ile ActivityPub üzerinden Fediverse\'e yayın, Tinybird ortaklığıyla yerleşik analitik ve Stripe tabanlı üyelikler sunulur. Yerleşik newsletter/e-posta, Docker Compose ile self-host veya Ghost(Pro) / Ghost.org barındırma ile çalışabilir.',
    useCases: [
      'Bağımsız blog ve kişisel marka siteleri',
      'Ücretli abonelikli haber bültenleri',
      'Şirket içi teknik blog ve dokümantasyon',
    ],
  },
  {
    slug: 'appwrite',
    name: 'Appwrite',
    description: 'Mobil ve web uygulamaları için açık kaynak backend sunucusu.',
    icon: 'appwrite',
    category: 'Backend & BaaS',
    brandColor: '#FD366E',
    features: [
      'Kimlik doğrulama (e-posta, OAuth, telefon, anonim)',
      'Veritabanı koleksiyonları ve gerçek zamanlı abonelikler',
      'Dosya depolama ve önizleme dönüşümleri',
      'Sunucusuz fonksiyonlar ve zamanlanmış görevler',
      'REST, GraphQL ve çoklu SDK desteği',
    ],
    about:
      'Appwrite, geliştiricilerin kendi altyapılarında barındırabileceği bir Backend-as-a-Service platformudur. Auth, veritabanı, depolama ve Functions tek panelden yönetilir; REST, GraphQL ve resmi SDK\'lar ile istemci uygulamalarına bağlanır. Docker ile kurulur; veri egemenliği ve self-host önceliğiyle Firebase benzeri deneyim sunar.',
    useCases: [
      'Mobil uygulama backend\'i self-host ortamında',
      'Hızlı MVP ve prototip geliştirme',
      'KVKK/GDPR uyumu için veriyi kendi sunucusunda tutma',
    ],
  },
  {
    slug: 'supabase',
    name: 'Supabase',
    description: 'PostgreSQL tabanlı açık kaynak Firebase alternatifi.',
    icon: 'supabase',
    category: 'Backend & BaaS',
    brandColor: '#3FCF8E',
    features: [
      'Yönetilen PostgreSQL ve otomatik REST (PostgREST)',
      'Auth ve satır düzeyinde güvenlik (RLS)',
      'Realtime değişiklik dinleme',
      'Storage bucket\'ları ve Edge Functions',
      'pgvector ile vektör arama; dashboard ve migration araçları',
    ],
    about:
      'Supabase, açık kaynaklı bir geliştirici platformudur; çekirdeğinde tam özellikli PostgreSQL bulunur. Auth + RLS, Realtime, Storage, Edge Functions ve pgvector gibi modern uygulama ihtiyaçları tek ekosistemde toplanır. Self-host veya yönetilen bulut seçenekleri mevcuttur.',
    useCases: [
      'SaaS uygulamalarında kullanıcı ve veri katmanı',
      'Gerçek zamanlı işbirlikçi uygulamalar',
      'AI uygulamalarında pgvector ile embedding saklama',
    ],
  },
  {
    slug: 'plausible',
    name: 'Plausible',
    description: 'Çerezsiz, GDPR uyumlu hafif web analitiği.',
    icon: 'plausibleanalytics',
    category: 'Analitik & Ürün',
    brandColor: '#5850EC',
    features: [
      'Çerez ve kişisel veri toplamadan ziyaret istatistikleri',
      'Hafif script (~2.5 KB) ve hızlı yükleme',
      'Özel etkinlik ve hedef dönüşüm takibi',
      'E-posta/Slack haftalık raporlar',
      'Community Edition self-host veya Plausible Cloud (AB)',
    ],
    about:
      'Plausible Analytics, web sitelerinin trafiğini çerezsiz ve GDPR uyumlu şekilde ölçen Avrupa merkezli bir analitik aracıdır. Google Analytics\'e kıyasla basit paneller, şeffaf metodoloji ve AB veri koruma ilkelerine uyum hedefler. Açık kaynak Community Edition ile self-host veya Plausible Cloud kullanılabilir.',
    useCases: [
      'Kurumsal sitelerde çerez banner\'ı olmadan trafik ölçümü',
      'Blog ve landing page performans takibi',
      'Ajansların çoklu site panelleri',
    ],
  },
  {
    slug: 'n8n',
    name: 'n8n',
    description: 'Görsel düzenleyici ile kod ve no-code otomasyon platformu.',
    icon: 'n8n',
    category: 'Otomasyon & İş Akışı',
    brandColor: '#EA4B71',
    features: [
      '400+ entegrasyon düğümü',
      'JavaScript ve Python kod adımları',
      'Webhook, cron ve olay tetikleyicileri',
      'Self-host ve n8n Cloud',
      'Hata yönetimi, dallanma ve alt iş akışları',
    ],
    about:
      'n8n (nodemation), iş akışlarını düğüm tabanlı bir editörde birleştiren fair-code otomasyon aracıdır. Zapier/Make benzeri senaryoları kendi sunucunuzda veya n8n Cloud\'da çalıştırarak veri egemenliği sağlar; JS/Python kod düğümleriyle özel mantık eklenebilir.',
    useCases: [
      'CRM, e-posta ve Slack arasında veri senkronizasyonu',
      'API birleştirme ve ETL hafif senaryoları',
      'IT operasyonlarında uyarı ve on-call otomasyonu',
    ],
  },
  {
    slug: 'minio',
    name: 'MinIO',
    description: 'S3 uyumlu yüksek performanslı nesne depolama.',
    icon: 'minio',
    category: 'Depolama & Veritabanı',
    brandColor: '#C72E49',
    features: [
      'Amazon S3 API uyumluluğu',
      'Erasure coding ve sunucu kümesi ölçekleme',
      'Bucket bildirimleri ve yaşam döngüsü kuralları',
      'TLS, IAM politikaları ve KMS entegrasyonu',
      'Kubernetes ve bare-metal dağıtım',
    ],
    about:
      'MinIO, bulut nesne depolama iş yükleri için tasarlanmış S3 uyumlu yazılımdır; kaynak kodu AGPLv3 ile sunulur. Yedekleme, medya arşivleri ve veri gölleri için S3 kullanan uygulamalarla doğrudan uyumludur. Kurumsal yol AIStor (ticari) ürün ailesiyle devam eder.',
    useCases: [
      'Uygulama dosya ve medya yüklemeleri',
      'Yedekleme hedefi ve off-site replikasyon',
      'Veri gölü ve analitik ham veri depolama',
    ],
  },
  {
    slug: 'redis',
    name: 'Redis',
    description: 'Bellek içi veri yapıları, önbellek ve mesajlaşma.',
    icon: 'redis',
    category: 'Depolama & Veritabanı',
    brandColor: '#FF4438',
    features: [
      'String, hash, list, set, sorted set çekirdek tipleri',
      'TTL ile otomatik anahtar sona erdirme',
      'Pub/Sub ve Redis Streams',
      'Redis 8: JSON, Query Engine ve time series çekirdekte',
      'Cluster ve Sentinel ile yüksek erişilebilirlik',
    ],
    about:
      'Redis, bellekte çalışan bir veri deposudur; önbellek, oturum saklama, rate limiting ve gerçek zamanlı skor tabloları için endüstri standardıdır. Redis 8 ile JSON, Query Engine ve time series çekirdeğe alındı; lisans seçenekleri RSALv2, SSPLv1 ve AGPLv3\'tür. Kalıcılık (RDB/AOF) ile bellek hızı disk güvenilirliğiyle birleştirilebilir.',
    useCases: [
      'Web uygulaması oturum ve API önbelleği',
      'Sıra ve iş dağıtımı (task queue)',
      'Gerçek zamanlı liderlik tabloları ve sayaçlar',
    ],
  },
  {
    slug: 'postgresql',
    name: 'PostgreSQL',
    description: 'Gelişmiş SQL özellikleri sunan açık kaynak ilişkisel veritabanı.',
    icon: 'postgresql',
    category: 'Depolama & Veritabanı',
    brandColor: '#4169E1',
    features: [
      'ACID uyumlu transaction ve MVCC',
      'JSONB, dizi ve coğrafi (PostGIS) tipler',
      'Tam metin arama ve pgvector eklentisi',
      'Partitioning, replikasyon ve logical decoding',
      'Geniş eklenti ekosistemi',
    ],
    about:
      'PostgreSQL, 30 yılı aşkın geçmişe sahip nesne-ilişkisel bir veritabanı yönetim sistemidir. Kurumsal özellikler (foreign key, trigger, stored procedure) açık kaynak lisansla sunulur. Supabase, GitLab ve birçok SaaS ürününün varsayılan veritabanıdır.',
    useCases: [
      'Transactional iş uygulamaları ve ERP verisi',
      'Coğrafi ve analitik sorgular (PostGIS)',
      'OLTP + hafif OLAP hibrit yükler',
    ],
  },
  {
    slug: 'metabase',
    name: 'Metabase',
    description: 'Teknik olmayan ekipler için self-servis BI ve panolar.',
    icon: 'metabase',
    category: 'BI & Görselleştirme',
    brandColor: '#509EE3',
    features: [
      'Görsel sorgu oluşturucu ve native SQL',
      'Dashboard, filtre ve drill-through',
      'E-posta ve Slack ile zamanlanmış raporlar',
      'Çoklu veritabanı bağlantısı (Postgres, MySQL, BigQuery vb.)',
      'Satır düzeyinde sandbox ve SSO',
    ],
    about:
      'Metabase, şirket verilerini sorgulamak ve görselleştirmek için tasarlanmış açık kaynak bir iş zekası aracıdır. Kurulumu hızlıdır; product ve operasyon ekiplerinin SQL yazmadan metrik tüketmesini hedefler. Enterprise sürümünde gelişmiş güvenlik ve embedding sunulur.',
    useCases: [
      'Satış ve pazarlama funnel panoları',
      'Operasyonel KPI takibi',
      'Müşteriye gömülü analitik (embedded analytics)',
    ],
  },
  {
    slug: 'meilisearch',
    name: 'Meilisearch',
    description: 'Typo toleranslı, milisaniye gecikmeli arama motoru.',
    icon: 'meilisearch',
    category: 'Arama',
    brandColor: '#FF5CAA',
    features: [
      'Anında arama (search-as-you-type)',
      'Yazım hatası toleransı ve eşanlamlılar',
      'Faceted filtreleme ve sıralama kuralları',
      'REST API ve resmi SDK\'lar',
      'Tenant token ile çok kiracılı güvenlik',
    ],
    about:
      'Meilisearch, Rust ile yazılmış açık kaynak bir arama motorudur; e-ticaret katalogları ve dokümantasyon siteleri için optimize edilmiştir. Elasticsearch\'e kıyasla daha basit operasyon ve hızlı indeksleme sunar. Bulut ve self-host seçenekleri vardır.',
    useCases: [
      'E-ticaret ürün arama çubuğu',
      'Dokümantasyon ve wiki tam metin arama',
      'Medya kütüphanesi ve içerik keşfi',
    ],
  },
  {
    slug: 'wordpress',
    name: 'WordPress',
    description: 'Dünyanın en yaygın açık kaynak içerik yönetim sistemi.',
    icon: 'wordpress',
    category: 'Yayın & CMS',
    brandColor: '#21759B',
    features: [
      'Gutenberg blok editörü',
      'Tema ve eklenti ekosistemi',
      'Kullanıcı rolleri ve çoklu site (Multisite)',
      'REST API ve headless kullanım',
      'WooCommerce ile e-ticaret',
    ],
    about:
      'WordPress, PHP tabanlı açık kaynak bir CMS\'dir; internetteki sitelerin önemli bir kısmını güçlendiren lider içerik yönetim sistemidir. Blogdan kurumsal siteye, üyelik portalından mağazaya genişletilebilir. Topluluk ve ticari eklenti/tema pazarı olgunlaşmıştır.',
    useCases: [
      'Kurumsal web sitesi ve landing page',
      'Haber portalı ve dergi yayını',
      'WooCommerce ile online mağaza',
    ],
  },
  {
    slug: 'umami',
    name: 'Umami',
    description: 'Minimal, gizlilik odaklı açık kaynak web analitiği.',
    icon: 'umami',
    listingType: 'saas',
    category: 'Analitik & Ürün',
    brandColor: '#000000',
    features: [
      'Çerezsiz, anonim ziyaretçi ölçümü',
      'Özel olay ve hedef URL takibi',
      'Çoklu site ve takım paylaşımı',
      'MySQL veya PostgreSQL backend',
      'Self-host ve Umami Cloud',
    ],
    about:
      'Umami, Next.js ve açık kaynak lisansla geliştirilen hafif bir analitik uygulamasıdır. Plausible ve Fathom gibi gizlilik odaklı alternatifler arasında yer alır; kurulumu basit ve arayüzü sade tutulmuştur.',
    useCases: [
      'Kişisel blog trafik istatistikleri',
      'Startup MVP\'de hızlı analitik',
      'Çerez politikası gerektirmeyen ölçüm',
    ],
  },
  {
    slug: 'grafana',
    name: 'Grafana',
    description: 'Metrik, log ve iz için birleşik gözlemlenebilirlik panoları.',
    icon: 'grafana',
    category: 'Gözlemlenebilirlik',
    brandColor: '#F46800',
    features: [
      'Prometheus, Loki, Tempo, Elasticsearch veri kaynakları',
      'Alerting ve on-call entegrasyonları',
      'Dashboard paylaşımı ve versiyonlama',
      'Grafana Cloud ve self-host Grafana OSS',
      'Plugin ekosistemi',
    ],
    about:
      'Grafana Labs tarafından geliştirilen Grafana, zaman serisi ve log verilerini görsel panolarda birleştirir. SRE ve DevOps ekiplerinin altyapı sağlığını tek camdan izlemesini sağlar. Loki (log), Mimir (metrik) ve Tempo (trace) ile LGTM yığını oluşturulabilir.',
    useCases: [
      'Kubernetes küme ve pod metrikleri',
      'Uygulama SLA ve hata oranı panoları',
      'İş metriklerinin operasyon verisiyle birleştirilmesi',
    ],
  },
  {
    slug: 'prometheus',
    name: 'Prometheus',
    description: 'Zaman serisi metrik toplama ve PromQL sorgu motoru.',
    icon: 'prometheus',
    category: 'Gözlemlenebilirlik',
    brandColor: '#E6522C',
    features: [
      'Pull tabanlı scrape modeli',
      'PromQL ile sorgu ve aggregation',
      'Alertmanager ile uyarı yönlendirme',
      'Service discovery entegrasyonları',
      'CNCF mezuniyet projesi',
    ],
    about:
      'Prometheus, Cloud Native Computing Foundation bünyesindeki açık kaynak bir izleme sistemidir. Etiketli çok boyutlu veri modeli mikroservis ortamlarına uygundur. Genellikle Grafana ile görselleştirilir; uzun süreli depolama için Thanos veya Mimir kullanılır.',
    useCases: [
      'Mikroservis HTTP gecikme ve throughput izleme',
      'Node ve container exporter metrikleri',
      'SLO tabanlı uyarı kuralları',
    ],
  },
  {
    slug: 'directus',
    name: 'Directus',
    description: 'Herhangi bir SQL veritabanı üzerinde anında headless CMS ve API.',
    icon: 'directus',
    category: 'Yayın & CMS',
    brandColor: '#263238',
    features: [
      'Mevcut veya yeni SQL şemasına bağlanma',
      'No-code veri modeli ve ilişki yönetimi',
      'REST ve GraphQL otomatik API',
      'Dosya depolama adaptörleri',
      'Rol tabanlı erişim ve audit log',
    ],
    about:
      'Directus, veritabanınızı doğrudan içerik ve veri katmanına dönüştüren açık kaynak bir veri platformudur. Geliştiriciler şema üzerinde tam kontrolü korurken editörler dostu bir arayüzle kayıt yönetir. Self-host ve Directus Cloud seçenekleri mevcuttur.',
    useCases: [
      'Headless e-ticaret katalog yönetimi',
      'Mobil uygulama içerik API\'si',
      'Legacy veritabanını modern API ile açma',
    ],
  },
  {
    slug: 'strapi',
    name: 'Strapi',
    description: 'Node.js tabanlı özelleştirilebilir headless CMS.',
    icon: 'strapi',
    category: 'Yayın & CMS',
    brandColor: '#4945FF',
    features: [
      'Content-Type Builder ile model tanımı',
      'REST ve GraphQL API',
      'Medya kütüphanesi ve CDN entegrasyonu',
      'Plugin marketplace',
      'Rol tabanlı erişim kontrolü',
    ],
    about:
      'Strapi, JavaScript geliştiriciler için tasarlanmış açık kaynak bir headless CMS\'dir. Ön yüzü React, Vue veya mobil uygulamalardan bağımsız tutarak içerik yönetimini API üzerinden sunar. Strapi Cloud veya kendi sunucunuzda çalıştırılabilir.',
    useCases: [
      'Kurumsal web sitesi içerik hub\'ı',
      'Çok dilli pazarlama sayfaları',
      'IoT veya mobil uygulama içerik senkronizasyonu',
    ],
  },
  {
    slug: 'keycloak',
    name: 'Keycloak',
    description: 'OpenID Connect ve SAML destekli kimlik ve erişim yönetimi.',
    icon: 'keycloak',
    listingType: 'saas',
    category: 'Kimlik & Güvenlik',
    brandColor: '#4D4D4D',
    features: [
      'SSO, social login ve LDAP/AD federasyonu',
      'OAuth 2.0 ve OpenID Connect',
      'Kullanıcı federasyonu ve özel temalar',
      'Fine-grained authorization (authorization services)',
      'Red Hat tarafından desteklenen açık kaynak proje',
    ],
    about:
      'Keycloak, kurumsal uygulamalara merkezi kimlik doğrulama eklemek için kullanılan açık kaynak bir IAM çözümüdür. Realm, client ve rol kavramlarıyla çoklu uygulamada tek oturum açma (SSO) deneyimi sağlar. Quarkus tabanlı modern sürümler yüksek ölçeklenebilirlik hedefler.',
    useCases: [
      'Şirket içi uygulamalarda SSO',
      'B2B müşteri portalı kimlik yönetimi',
      'Mikroservislerde JWT tabanlı yetkilendirme',
    ],
  },
  {
    slug: 'vaultwarden',
    name: 'Vaultwarden',
    description: 'Bitwarden sunucu API\'si ile uyumlu hafif parola kasası.',
    icon: 'vaultwarden',
    category: 'Kimlik & Güvenlik',
    brandColor: '#000000',
    features: [
      'Bitwarden istemcileri ile tam uyumluluk',
      'Rust ile düşük kaynak tüketimi',
      'Organizasyon, koleksiyon ve paylaşım',
      '2FA ve WebAuthn desteği (istemci üzerinden)',
      'SQLite, MySQL veya PostgreSQL backend',
    ],
    about:
      'Vaultwarden (eski adıyla bitwarden_rs), resmi Bitwarden sunucusunun Bitwarden API uyumlu alternatifi olarak geliştirilen açık kaynak bir uygulamadır. Kişisel veya küçük ekip parola yönetimini kendi altyapınızda barındırmanızı sağlar; resmi Bitwarden mobil ve tarayıcı eklentileriyle çalışır.',
    useCases: [
      'Aile ve küçük ekip parola paylaşımı',
      'Self-host gizlilik odaklı kasa',
      'Düşük RAM\'li VPS\'te kurumsal kasa',
    ],
  },
  {
    slug: 'gitea',
    name: 'Gitea',
    description: 'Hafif, self-host Git barındırma ve birleşik kod platformu.',
    icon: 'gitea',
    category: 'Kaynak Kodu & DevOps',
    brandColor: '#609926',
    features: [
      'Git repository, pull request ve code review',
      'Issues, projeler ve wiki',
      'Actions ile CI (Gitea Actions)',
      'LDAP ve OAuth ile kimlik',
      'Düşük sistem gereksinimleri',
    ],
    about:
      'Gitea, Go ile yazılmış açık kaynak bir Git servisidir; GitHub/GitLab\'a hafif bir self-host alternatifi sunar. Tek ikili veya Docker ile kurulur; binlerce repository barındırmak için tasarlanmıştır. Gitea Ltd. topluluk ve ticari destek sağlar.',
    useCases: [
      'Şirket içi kaynak kod barındırma',
      'Açık kaynak proje forge\'u',
      'Air-gapped ortamda sürüm kontrolü',
    ],
  },
  {
    slug: 'gitlab',
    name: 'GitLab',
    description: 'Git, CI/CD, güvenlik ve DevSecOps tek platformda.',
    icon: 'gitlab',
    category: 'Kaynak Kodu & DevOps',
    brandColor: '#FC6D26',
    features: [
      'Git repository ve merge request akışı',
      'GitLab CI/CD pipeline tanımları',
      'Container Registry ve Package Registry',
      'SAST/DAST ve dependency scanning',
      'Self-managed ve GitLab.com SaaS',
    ],
    about:
      'GitLab, yazılım yaşam döngüsünü tek uygulamada toplayan DevOps platformudur. Planlama, kaynak kodu, test, dağıtım ve izleme adımları entegre edilir. Community Edition açık kaynak; Enterprise sürümünde gelişmiş güvenlik ve uyumluluk özellikleri bulunur.',
    useCases: [
      'Tam pipeline ile sürekli teslimat',
      'Regüle sektörlerde on-prem DevOps',
      'Monorepo ve çoklu proje yönetimi',
    ],
  },
  {
    slug: 'portainer',
    name: 'Portainer',
    description: 'Docker, Swarm ve Kubernetes için görsel konteyner yönetimi.',
    icon: 'portainer',
    listingType: 'saas',
    category: 'Konteyner & Ağ',
    brandColor: '#13BEF9',
    features: [
      'Container, image, volume ve network yönetimi',
      'Stack ve compose dağıtımı',
      'Kubernetes cluster bağlantısı',
      'RBAC ve activity log',
      'Edge agent ile uzak cihaz yönetimi',
    ],
    about:
      'Portainer, konteyner ortamlarını tek web arayüzünden yönetmeyi kolaylaştıran bir platformdur. Community Edition açık kaynak olup homelab\'dan kurumsal edge senaryolarına kadar kullanılır. CLI yerine görsel işlemlerle operasyon hatalarını azaltmayı hedefler.',
    useCases: [
      'Homelab Docker sunucu yönetimi',
      'Ekip içi self-servis konteyner dağıtımı',
      'Çoklu Kubernetes cluster görünürlüğü',
    ],
  },
  {
    slug: 'traefik',
    name: 'Traefik',
    description: 'Cloud-native dinamik reverse proxy ve yük dengeleyici.',
    icon: 'traefikproxy',
    category: 'Konteyner & Ağ',
    brandColor: '#24A1C1',
    features: [
      'Docker, Kubernetes ve Consul service discovery',
      'Otomatik Let\'s Encrypt TLS',
      'HTTP, TCP ve UDP routing',
      'Middleware: rate limit, auth, compress',
      'Observability: metrics, tracing, access log',
    ],
    about:
      'Traefik Proxy, mikroservis ve konteyner ortamları için tasarlanmış modern bir edge yönlendiricisidir. Etiket veya CRD ile yapılandırma güncellenir; statik nginx config dosyalarına kıyasla dinamik keşif sunar. Traefik Labs ayrıca API gateway ve mesh ürünleri geliştirir.',
    useCases: [
      'Docker Compose ile çoklu servis SSL terminasyonu',
      'Kubernetes Ingress controller',
      'Blue-green ve canary trafik bölme',
    ],
  },
  {
    slug: 'nginx-proxy-manager',
    name: 'Nginx Proxy Manager',
    description: 'Nginx reverse proxy ve SSL için web tabanlı yönetim arayüzü.',
    icon: 'nginxproxymanager',
    category: 'Konteyner & Ağ',
    brandColor: '#F15833',
    features: [
      'Host bazlı proxy host tanımları',
      'Let\'s Encrypt sertifika otomasyonu',
      'Access list ve temel HTTP auth',
      'Stream (TCP/UDP) proxy desteği',
      'Docker ile kolay kurulum',
    ],
    about:
      'Nginx Proxy Manager, Nginx\'i teknik olmayan kullanıcılar için sadeleştiren açık kaynak bir yönetim katmanıdır. Homelab ve küçük sunucularda çoklu web uygulamasını tek IP üzerinden yönlendirmek için yaygın kullanılır. Arka planda OpenResty/Nginx çalışır.',
    useCases: [
      'Ev sunucusunda çoklu subdomain yönlendirme',
      'Internal servislere güvenli dış erişim',
      'Hızlı SSL sertifika yenileme',
    ],
  },
  {
    slug: 'uptime-kuma',
    name: 'Uptime Kuma',
    description: 'Self-host uptime, ping ve SSL süresi izleme.',
    icon: 'uptimekuma',
    listingType: 'saas',
    category: 'İzleme & Güvenilirlik',
    brandColor: '#5CDD8B',
    features: [
      'HTTP(s), TCP, ping, DNS ve daha fazla monitor tipi',
      'Durum sayfası (status page) oluşturma',
      'Telegram, Slack, e-posta bildirimleri',
      'Docker tabanlı basit kurulum',
      'Çoklu kullanıcı ve 2FA',
    ],
    about:
      'Uptime Kuma, Louis Lam tarafından geliştirilen açık kaynak bir izleme aracıdır. Pingdom ve UptimeRobot benzeri deneyimi kendi sunucunuzda sunar. Modern arayüzü ve geniş bildirim kanalı desteği ile homelab ve KOBİ\'lerde popülerdir.',
    useCases: [
      'Web sitesi ve API erişilebilirlik kontrolü',
      'Müşteriye açık durum sayfası',
      'Ev otomasyonu ve NAS servis izleme',
    ],
  },
  {
    slug: 'sentry',
    name: 'Sentry',
    description: 'Uygulama hata takibi, performans ve session replay.',
    icon: 'sentry',
    listingType: 'saas',
    category: 'Gözlemlenebilirlik',
    brandColor: '#362D59',
    features: [
      'Exception grouping ve stack trace zenginleştirme',
      'Performance monitoring (transaction tracing)',
      'Release health ve deploy takibi',
      'Çoklu dil SDK (JS, Python, Java, mobile)',
      'Self-host ve Sentry SaaS',
    ],
    about:
      'Sentry, yazılım ekiplerinin production hatalarını gerçek zamanlı yakalamasını sağlayan bir uygulama izleme platformudur. Kaynak haritası ile minified JavaScript hataları okunabilir hale gelir. Açık kaynak self-host sürümü ve bulut hizmeti birlikte sunulur.',
    useCases: [
      'Frontend ve backend exception alerting',
      'Mobil uygulama crash raporlama',
      'Deploy sonrası regresyon tespiti',
    ],
  },
  {
    slug: 'posthog',
    name: 'PostHog',
    description: 'Ürün analitiği, feature flag, A/B test ve session replay.',
    icon: 'posthog',
    category: 'Analitik & Ürün',
    brandColor: '#000000',
    features: [
      'Olay tabanlı product analytics',
      'Feature flags ve multivariate deneyler',
      'Session replay ve heatmap',
      'ClickHouse tabanlı analitik motor',
      'Açık kaynak self-host ve PostHog Cloud',
    ],
    about:
      'PostHog, mühendis odaklı ekipler için birleşik bir ürün analitiği platformudur: product analytics, feature flags, session replay ve experiments tek yerde toplanır. ClickHouse tabanlı motor yüksek hacimli olayları işler; self-host veya bulut seçenekleri vardır.',
    useCases: [
      'Feature rollout ve kill switch',
      'Dönüşüm hunisi ve retention analizi',
      'Self-host product analytics (GDPR)',
    ],
  },
  {
    slug: 'cal-com',
    name: 'Cal.com',
    description: 'Açık kaynak randevu planlama ve toplantı altyapısı.',
    icon: 'caldotcom',
    listingType: 'saas',
    category: 'Planlama & Randevu',
    brandColor: '#292929',
    features: [
      'Takvim entegrasyonları (Google, Outlook, CalDAV)',
      'Özelleştirilebilir booking linkleri',
      'Ekip round-robin ve kolektif etkinlikler',
      'Ödeme (Stripe) ve workflow otomasyonu',
      'API ve embed widget',
    ],
    about:
      'Cal.com (eski Calendso), Calendly\'nin açık kaynak alternatifidir. Toplantı slotlarını paylaşarak planlama sürtünmesini azaltır. Self-host veya Cal.com bulut hizmeti ile kullanılabilir; white-label kurumsal planlar mevcuttur.',
    useCases: [
      'Satış demo ve keşif görüşmesi randevuları',
      'Destek ve danışmanlık slot yönetimi',
      'Web sitesine gömülü rezervasyon formu',
    ],
  },
  {
    slug: 'outline',
    name: 'Outline',
    description: 'Ekip wiki, bilgi tabanı ve gerçek zamanlı dokümanlar.',
    icon: 'outline',
    category: 'Dokümantasyon & Wiki',
    brandColor: '#000000',
    features: [
      'Markdown tabanlı zengin doküman editörü',
      'Koleksiyon, izin ve paylaşım linkleri',
      'Slack ve Google ile SSO',
      'Tam metin arama',
      'Self-host ve Outline Cloud',
    ],
    about:
      'Outline, ekiplerin iç bilgisini düzenlemek için tasarlanmış açık kaynak bir wiki uygulamasıdır. Notion benzeri deneyimi kurumsal SSO ve self-host ile birleştirir. Node.js backend ve React arayüzü kullanır.',
    useCases: [
      'Mühendislik runbook ve SOP dokümantasyonu',
      'Onboarding bilgi merkezi',
      'Proje wiki ve karar kayıtları',
    ],
  },
  {
    slug: 'notion',
    name: 'Notion',
    description: 'Blok tabanlı notlar, wiki, veritabanı ve proje yönetimi.',
    icon: 'notion',
    category: 'Dokümantasyon & Wiki',
    brandColor: '#000000',
    features: [
      'Blok editörü: metin, tablo, kanban, takvim',
      'İlişkili veritabanları ve formüller',
      'Şablon galerisi',
      'API ve entegrasyonlar',
      'Ekip workspace ve granular izinler',
    ],
    about:
      'Notion, all-in-one çalışma alanı olarak doküman, görev ve veritabanını tek arayüzde birleştirir. Bulut hizmeti olarak sunulur; API ile üçüncü taraf otomasyon mümkündür. Startup\'lardan kurumsal ekiplere kadar geniş kullanıcı tabanı vardır.',
    useCases: [
      'Ürün roadmap ve sprint panosu',
      'CRM hafif müşteri takibi',
      'Kişisel bilgi yönetimi (PKM)',
    ],
  },
  {
    slug: 'chatwoot',
    name: 'Chatwoot',
    description: 'Omnichannel müşteri destek ve canlı sohbet platformu.',
    icon: 'chatwoot',
    listingType: 'saas',
    category: 'İletişim & Destek',
    brandColor: '#1F93FF',
    features: [
      'Web widget, e-posta, WhatsApp, Facebook kanalları',
      'Agent inbox, atama ve etiketler',
      'Canned responses ve makrolar',
      'Captain AI ile yardımcı yanıtlar',
      'Self-host ve Chatwoot Cloud',
    ],
    about:
      'Chatwoot, açık kaynak bir müşteri engagement suite\'idir; Intercom ve Zendesk\'e alternatif olarak konumlanır. Ruby on Rails ile geliştirilir. Çok kanallı konuşmaları tek panelde toplar ve CRM entegrasyonlarına açıktır.',
    useCases: [
      'E-ticaret canlı destek',
      'SaaS uygulama içi chat',
      'WhatsApp Business destek hattı',
    ],
  },
  {
    slug: 'mattermost',
    name: 'Mattermost',
    description: 'Self-host ekip mesajlaşması ve iş birliği.',
    icon: 'mattermost',
    category: 'İletişim & Destek',
    brandColor: '#0058CC',
    features: [
      'Kanallar, thread ve DM',
      'Dosya paylaşımı ve arama',
      'Plugin ve webhook entegrasyonları',
      'LDAP, SAML ve compliance export',
      'Mattermost Calls (ses/görüntü)',
    ],
    about:
      'Mattermost, güvenlik ve veri residency odaklı kurumlar için açık kaynak bir Slack alternatifidir. Go backend ile yüksek eşzamanlı kullanıcıya ölçeklenir. DevOps ekipleri CI bildirimleri ve runbook otomasyonu için sık kullanır.',
    useCases: [
      'Regüle sektörde on-prem chat',
      'DevOps alert kanalları',
      'Mühendislik ve proje iletişimi',
    ],
  },
  {
    slug: 'rocketchat',
    name: 'Rocket.Chat',
    description: 'Omnichannel takım sohbeti ve müşteri iletişim merkezi.',
    icon: 'rocketchat',
    listingType: 'saas',
    category: 'İletişim & Destek',
    brandColor: '#F5455C',
    features: [
      'Kanallar, thread, ses ve video konferans',
      'Livechat widget ve WhatsApp köprüsü',
      'Bot framework ve App Marketplace',
      'Federation ve air-gapped dağıtım',
      'Enterprise: omnichannel ve audit',
    ],
    about:
      'Rocket.Chat, Brezilya kökenli açık kaynak bir iletişim platformudur. İç ekip mesajlaşması ile müşteri canlı sohbetini aynı üründe birleştirebilir. Kubernetes ve Docker ile cluster kurulumu desteklenir.',
    useCases: [
      'Call center omnichannel inbox',
      'Şirket içi güvenli mesajlaşma',
      'Topluluk forumu ve destek birleşimi',
    ],
  },
  {
    slug: 'mailcow',
    name: 'Mailcow',
    description: 'Docker ile tam özellikli self-host e-posta sunucusu paketi.',
    icon: 'mailcow',
    category: 'E-posta Altyapısı',
    brandColor: '#D01C3B',
    features: [
      'Postfix, Dovecot, SOGo groupware',
      'Rspamd spam filtreleme ve ClamAV antivirüs',
      'Web admin paneli ve API',
      'DKIM, DMARC ve Let\'s Encrypt desteği',
      'Kolay yedekleme ve domain alias',
    ],
    about:
      'Mailcow, dockerized mail server olarak bilinen açık kaynak bir e-posta yığınıdır. Tek komutla kurulan bileşenler kurumsal posta kutusu, takvim ve adres defteri sunar. Kendi domain\'inizde tam posta kontrolü isteyen KOBİ\'ler tarafından tercih edilir.',
    useCases: [
      'Şirket @domain.com posta kutuları',
      'Gizlilik odaklı kişisel e-posta barındırma',
      'Test ortamı SMTP/IMAP sunucusu',
    ],
  },
  {
    slug: 'listmonk',
    name: 'Listmonk',
    description: 'Yüksek hacimli bülten ve transactional e-posta yönetimi.',
    icon: 'listmonk',
    category: 'E-posta & Pazarlama',
    brandColor: '#0055D4',
    features: [
      'Abone listeleri ve segmentasyon',
      'HTML ve Markdown kampanya şablonları',
      'SMTP relay ve bounce yönetimi',
      'REST API ile programmatic gönderim',
      'Go + PostgreSQL ile performans',
    ],
    about:
      'Listmonk, tek geliştirici topluluğu tarafından sürdürülen açık kaynak bir e-posta listesi yöneticisidir. Mailchimp benzeri pazarlama e-postalarını kendi SMTP altyapınız üzerinden göndermenizi sağlar; abone verisi sizde kalır.',
    useCases: [
      'Ürün güncelleme bültenleri',
      'Topluluk duyuru listeleri',
      'Transactional şablon test ortamı',
    ],
  },
  {
    slug: 'typesense',
    name: 'Typesense',
    description: 'Typo toleranslı, kolay operasyonlu arama motoru.',
    icon: 'typesense',
    category: 'Arama',
    brandColor: '#1035F5',
    features: [
      'Milisaniye altı arama gecikmesi',
      'Faceting, filtering ve sorting',
      'Geo search ve vector arama',
      'Raft tabanlı yüksek erişilebilirlik kümesi',
      'Typesense Cloud ve self-host',
    ],
    about:
      'Typesense, C++ ile yazılmış açık kaynak bir arama ve vektör veritabanıdır. Algolia benzeri geliştirici deneyimi sunarken self-host seçeneği verir. Basit REST API ve resmi SDK\'lar ile hızlı entegrasyon hedeflenir.',
    useCases: [
      'Marketplace ürün arama',
      'Dokümantasyon instant search',
      'Semantik benzer içerik önerisi (vector)',
    ],
  },
  {
    slug: 'elasticsearch',
    name: 'Elasticsearch',
    description: 'Dağıtık arama, analitik ve log indeksleme motoru.',
    icon: 'elasticsearch',
    category: 'Arama',
    brandColor: '#005571',
    features: [
      'Apache Lucene tabanlı inverted index ve full-text sorgular',
      'Aggregations ile analitik',
      'Elastic Stack: Kibana, Logstash, Beats',
      'Cluster sharding ve replikasyon',
      'Elastic Cloud ve self-managed',
    ],
    about:
      'Elasticsearch, Elastic tarafından geliştirilen Lucene tabanlı dağıtık bir arama ve analitik motorudur. Log analytics (ELK), site search ve güvenlik SIEM senaryolarında yaygındır. Elastic License ve source-available bileşenlerle yönetilir; yığının tamamı saf OSS değildir.',
    useCases: [
      'Merkezi uygulama log arama',
      'E-ticaret katalog indeksleme',
      'Güvenlik olay korelasyonu',
    ],
  },
  {
    slug: 'mongodb',
    name: 'MongoDB',
    description: 'Esnek şema ile doküman odaklı NoSQL veritabanı.',
    icon: 'mongodb',
    category: 'Depolama & Veritabanı',
    brandColor: '#47A248',
    features: [
      'BSON doküman modeli',
      'Aggregation pipeline',
      'Replica set ve sharded cluster',
      'Community Server ve MongoDB Atlas',
      'Change streams ve transaction desteği',
    ],
    about:
      'MongoDB, JSON benzeri dokümanları doğrudan saklayan popüler bir NoSQL veritabanıdır. Community Server güncel sürümleri SSPL ile lisanslanır; yönetilen yol MongoDB Atlas\'tır. Hızlı iterasyon gerektiren uygulamalarda esnek şema avantajı sağlar.',
    useCases: [
      'İçerik yönetimi ve katalog verisi',
      'IoT telemetri ve time-series benzeri yükler',
      'Mobil backend sync verisi',
    ],
  },
  {
    slug: 'mysql',
    name: 'MySQL',
    description: 'Yaygın açık kaynak ilişkisel veritabanı sunucusu.',
    icon: 'mysql',
    category: 'Depolama & Veritabanı',
    brandColor: '#4479A1',
    features: [
      'InnoDB ACID transaction',
      'Replikasyon ve Group Replication',
      'JSON sütun tipi',
      'MySQL 8 window functions ve CTE',
      'Oracle tarafından geliştirilen topluluk sürümü',
    ],
    about:
      'MySQL, web uygulamalarının uzun yıllardır kullandığı açık kaynak RDBMS\'dir. WordPress, Drupal ve birçok SaaS ürününün varsayılan veritabanıdır. MariaDB ile fork ilişkisi tarihsel olarak önemlidir.',
    useCases: [
      'LAMP/LEMP web uygulamaları',
      'Okuma ağırlıklı raporlama replikası',
      'Geleneksel OLTP iş yükleri',
    ],
  },
  {
    slug: 'clickhouse',
    name: 'ClickHouse',
    description: 'Sütun bazlı OLAP analitik veritabanı.',
    icon: 'clickhouse',
    category: 'Depolama & Veritabanı',
    brandColor: '#FFCC01',
    features: [
      'Sütun tabanlı depolama ve vektörleştirilmiş sorgular',
      'Gerçek zamanlı veri ingest',
      'Materialized view ve projection',
      'Replikasyon ve sharding',
      'SQL arayüzü ve geniş format desteği',
    ],
    about:
      'ClickHouse, Yandex kökenli açık kaynak bir analitik DBMS\'dir. Petabyte ölçeğinde olay ve log verisini saniyeler içinde sorgulayabilir. PostHog, Plausible self-host ve birçok observability ürününün arka planında kullanılır.',
    useCases: [
      'Web analitik olay depolama',
      'Finans ve IoT zaman serisi analizi',
      'Log ve trace uzun süreli arşiv',
    ],
  },
  {
    slug: 'rabbitmq',
    name: 'RabbitMQ',
    description: 'AMQP protokollü güvenilir mesaj aracısı.',
    icon: 'rabbitmq',
    category: 'Mesaj Kuyruğu & Akış',
    brandColor: '#FF6600',
    features: [
      'Queue, exchange ve routing key modeli',
      'Publisher confirm ve consumer ack',
      'Dead letter ve delayed message',
      'Management UI ve Prometheus metrikleri',
      'Stream ve quorum queue tipleri',
    ],
    about:
      'RabbitMQ, VMware/Broadcom ekosisteminde gelişen açık kaynak bir message broker\'dır. İş yüklerini asenkron hale getirerek mikroservisler arası gevşek bağlılık sağlar. Erlang OTP üzerinde yüksek erişilebilirlik cluster\'ları kurulabilir.',
    useCases: [
      'E-posta ve bildirim kuyruğu',
      'Sipariş işleme arka plan görevleri',
      'Event-driven mikroservis entegrasyonu',
    ],
  },
  {
    slug: 'kafka',
    name: 'Kafka',
    description: 'Dağıtık commit log ve yüksek throughput olay akışı.',
    icon: 'apachekafka',
    category: 'Mesaj Kuyruğu & Akış',
    brandColor: '#231F20',
    features: [
      'Topic partition ve consumer group',
      'Dayanıklı disk üzerinde log saklama',
      'Kafka Connect ile entegrasyon',
      'Kafka Streams ile stream processing',
      'Apache Software Foundation projesi',
    ],
    about:
      'Apache Kafka, LinkedIn kökenli dağıtık bir event streaming platformudur. Gerçek zamanlı pipeline, activity tracking ve log aggregation için tasarlanmıştır. Confluent ve diğer vendor\'lar yönetilen hizmetler sunar.',
    useCases: [
      'Mikroservisler arası olay bus',
      'Clickstream ve kullanıcı aktivite akışı',
      'CDC (change data capture) pipeline',
    ],
  },
  {
    slug: 'ollama',
    name: 'Ollama',
    description: 'Yerel makinede büyük dil modellerini çalıştırma aracı.',
    icon: 'ollama',
    category: 'Yapay Zeka',
    brandColor: '#000000',
    features: [
      'Llama, Mistral, Gemma, Phi vb. model çekme ve çalıştırma',
      'REST API ile chat ve generate',
      'Modelfile ile özelleştirme',
      'macOS, Linux ve Windows desteği',
      'GPU hızlandırma (CUDA, Metal)',
    ],
    about:
      'Ollama, geliştiricilerin LLM\'leri CLI ve API ile yerel olarak indirip çalıştırmasını sağlayan açık kaynak bir araçtır. Llama, Mistral, Gemma gibi yaygın modeller tek komutla çekilir. Verinin cihazdan çıkmadan AI denemeleri yapılmasına olanak tanır.',
    useCases: [
      'Offline kod asistanı ve chatbot',
      'Geliştirme ortamında prompt testi',
      'Gizli veri ile yerel RAG prototipi',
    ],
  },
  {
    slug: 'openwebui',
    name: 'Open WebUI',
    description: 'Ollama ve OpenAI uyumlu modeller için ChatGPT benzeri arayüz.',
    icon: 'openwebui',
    category: 'Yapay Zeka',
    brandColor: '#000000',
    features: [
      'Ollama ve OpenAI uyumlu sağlayıcı desteği',
      'RAG: doküman yükleme ve vektör arama',
      'Kullanıcı rolleri ve paylaşımlı sohbetler',
      'Python function calling ve araç entegrasyonu',
      'Docker ile self-host',
    ],
    about:
      'Open WebUI, yerel ve uzak LLM backend\'lerine tek web arayüzünden erişim sağlayan açık kaynak bir projedir. Ollama ve OpenAI uyumlu API\'lerle çalışır; RAG ile doküman sohbeti destekler. Kurumsal ekiplerin internal AI portalı olarak dağıtılır.',
    useCases: [
      'Şirket içi ChatGPT alternatifi',
      'PDF ve wiki üzerinde RAG sohbet',
      'Model karşılaştırma ve prompt kütüphanesi',
    ],
  },
  {
    slug: 'langfuse',
    name: 'Langfuse',
    description: 'LLM uygulamaları için gözlemlenebilirlik ve değerlendirme.',
    icon: 'langfuse',
    category: 'Yapay Zeka',
    brandColor: '#000000',
    features: [
      'Trace, span ve generation loglama',
      'Prompt versiyonlama ve playground',
      'Kullanıcı geri bildirimi ve skorlama',
      'Dataset ile eval ve regression test',
      'Self-host ve Langfuse Cloud',
    ],
    about:
      'Langfuse, Almanya merkezli açık kaynak bir LLM observability platformudur. Production\'daki izler (traces), prompt yönetimi ve değerlendirme (evals) ile token maliyeti ve gecikmeyi görünür kılar. LangChain, OpenAI SDK ve diğer framework\'lerle entegre olur.',
    useCases: [
      'Chatbot kalite izleme',
      'Prompt A/B test ve versiyon yönetimi',
      'Maliyet ve latency dashboard',
    ],
  },
  {
    slug: 'flowise',
    name: 'Flowise',
    description: 'Görsel sürükle-bırak LLM agent ve RAG pipeline oluşturucu.',
    icon: 'flowise',
    listingType: 'saas',
    category: 'Yapay Zeka',
    brandColor: '#7C3AED',
    features: [
      'LangChain tabanlı node editörü',
      'Vector store ve retriever bağlantıları',
      'Agent, tool ve memory yapılandırması',
      'REST API ile chatflow deploy',
      'Self-host ve Flowise Cloud',
    ],
    about:
      'FlowiseAI, kod yazmadan LLM iş akışları tasarlamak için açık kaynak bir low-code aracıdır. LangChain bileşenlerini görselleştirir; hızlı POC ve internal otomasyon için kullanılır.',
    useCases: [
      'Müşteri destek RAG botu',
      'Doküman Q&A internal aracı',
      'Çok adımlı agent prototipi',
    ],
    demoUrl: '/service/flowise/simulasyon',
  },
  {
    slug: 'coolify',
    name: 'Coolify',
    description: 'Self-host PaaS: Heroku/Vercel alternatifi dağıtım paneli.',
    icon: 'coolify',
    category: 'Platform & Dağıtım',
    brandColor: '#6B16ED',
    features: [
      'Git push ile otomatik deploy',
      'Docker Compose ve Dockerfile desteği',
      'Let\'s Encrypt, wildcard domain (SSL)',
      'Sunucu ve multi-server yönetimi',
      'Veritabanı ve servis one-click kurulum',
    ],
    about:
      'Coolify, Andras Bacsai tarafından geliştirilen açık kaynak bir self-host PaaS\'tır. Git deploy, Docker ve SSL ile kendi VPS veya bare-metal sunucunuzda uygulama barındırmayı Heroku deneyimine yaklaştırır. DigitalOcean, Hetzner ve diğer sağlayıcılarda yaygın kullanılır.',
    useCases: [
      'Freelancer müşteri projelerini tek panelden host etme',
      'Startup MVP production deploy',
      'Self-host SaaS altyapısı',
    ],
  },
  {
    slug: 'dokku',
    name: 'Dokku',
    description: 'Tek sunucuda git-push ile PaaS deneyimi (mini-Heroku).',
    icon: 'dokku',
    category: 'Platform & Dağıtım',
    brandColor: '#D95656',
    features: [
      'Heroku buildpack uyumluluğu',
      'Plugin ile Postgres, Redis, Letsencrypt',
      'Zero-downtime deploy (dokku ps)',
      'Docker scheduler alternatifi',
      'Açık kaynak, tek bash/Go bileşenleri',
    ],
    about:
      'Dokku, Jeff Lindsay tarafından başlatılan açık kaynak bir mini PaaS\'tır. `git push dokku main` ile uygulama build ve release edilir. Küçük VPS\'lerde düşük maliyetli production ortamı kurmak isteyen geliştiriciler için klasik çözümdür.',
    useCases: [
      'Side project production hosting',
      'Staging ortamı hızlı klonlama',
      'Buildpack tabanlı legacy uygulama deploy',
    ],
  },
  {
    slug: 'pocketbase',
    name: 'PocketBase',
    description: 'Tek ikili dosyada gömülü veritabanı ve gerçek zamanlı API.',
    icon: 'pocketbase',
    listingType: 'saas',
    category: 'Backend & BaaS',
    brandColor: '#B8DBE4',
    features: [
      'SQLite tabanlı embedded DB',
      'Auth, OAuth2 ve admin kullanıcı yönetimi',
      'Realtime subscriptions (SSE)',
      'Dosya storage ve thumb generation',
      'Go ile tek binary dağıtım',
    ],
    about:
      'PocketBase, Gani Georgiev tarafından geliştirilen açık kaynak bir backend\'dir. Firebase benzeri özellikleri minimal footprint ile sunar; prototip ve küçük üretim uygulamaları için idealdir. Admin UI dahili gelir.',
    useCases: [
      'Mobil uygulama hızlı backend',
      'Internal tool ve form uygulamaları',
      'Offline-first sync prototipi',
    ],
  },
  {
    slug: 'hasura',
    name: 'Hasura',
    description: 'PostgreSQL (ve diğer DB) üzerinde anında GraphQL API.',
    icon: 'hasura',
    category: 'Backend & BaaS',
    brandColor: '#1EB4D4',
    features: [
      'Schema introspection ile otomatik GraphQL',
      'Satır düzeyinde güvenlik (RLS benzeri)',
      'Remote schema ve action ile özel mantık',
      'Event trigger ve scheduled trigger',
      'Hasura Cloud ve self-host engine',
    ],
    about:
      'Hasura GraphQL Engine, mevcut veritabanını saniyeler içinde GraphQL endpoint\'ine dönüştürür. Real-time subscription ve birleşik veri grafı sorguları sunar. Startup\'lardan kurumsal ekiplere kadar API katmanını hızlandırır.',
    useCases: [
      'Mobil ve web frontend için tek GraphQL gateway',
      'Legacy SQL verisini modern API ile açma',
      'Real-time dashboard ve bildirim feed\'i',
    ],
  },
  {
    slug: 'hoppscotch',
    name: 'Hoppscotch',
    description: 'Tarayıcı ve self-host açık kaynak API geliştirme istemcisi.',
    icon: 'hoppscotch',
    category: 'Geliştirme Araçları',
    brandColor: '#09090B',
    features: [
      'REST, GraphQL ve WebSocket istekleri',
      'Koleksiyon, ortam değişkenleri ve paylaşım',
      'Mock sunucu ve interceptor',
      'CLI ve CI entegrasyonu (Hoppscotch CLI)',
      'Self-host community edition',
    ],
    about:
      'Hoppscotch (eski adı Postwoman), Postman\'a açık kaynak alternatif olarak gelişmiştir. Verilerin tarayıcıda kalması ve self-host seçeneği gizlilik odaklı ekiplere hitap eder. Hafif arayüzü ile hızlı API testi sağlar.',
    useCases: [
      'Backend API geliştirme ve debug',
      'Ekip koleksiyon paylaşımı (self-host)',
      'GraphQL sorgu deneme',
    ],
  },
  {
    slug: 'activepieces',
    name: 'Activepieces',
    description: 'Yapay zeka ajanları ve yüzlerce uygulamayı bağlayan görsel otomasyon platformu.',
    icon: 'activepieces',
    listingType: 'saas',
    category: 'Otomasyon & İş Akışı',
    brandColor: '#6E41E2',
    features: [
      'Sürükle-bırak akış editörü',
      'AI ajanları ve MCP sunucu bağlantıları',
      'Slack, Gmail ve yüzlerce uygulama entegrasyonu',
      'Self-host ve bulut dağıtımı',
      'Zapier / Make alternatifi açık kaynak lisans',
    ],
    about:
      'Activepieces, görsel arayüzle yapay zeka ajanlarını ve iş uygulamalarını birbirine bağlayan otomasyon platformudur. Kod yazmadan Slack, Gmail ve benzeri araçları zincirleyebilir; self-host ile veriyi kendi sunucunuzda tutabilirsiniz.',
    useCases: [
      'Satış ve destek süreçlerini otomatikleştirme',
      'AI ajanlarını şirket araçlarına bağlama',
      'Zapier yerine self-host otomasyon',
    ],
  },
  {
    slug: 'dify',
    name: 'Dify',
    description: 'RAG, ajan ve sohbet botlarını tek çalışma alanında kuran AI geliştirici platformu.',
    icon: 'dify',
    listingType: 'saas',
    category: 'Yapay Zeka',
    brandColor: '#1C64F2',
    features: [
      'Kod yazmadan RAG ve ajan iş akışları',
      'Kendi belgelerinizle bilgi tabanı',
      'Model ve araç entegrasyonları',
      'Bulut, VPC veya self-host dağıtım',
      'LangChain alternatifi üretim ortamı',
    ],
    about:
      'Dify, kendi verilerinizle çalışan yapay zeka asistanları, RAG sistemleri ve sohbet botları üretmenizi sağlar. Prototipten üretime tek bir collaborative workspace içinde geçiş hedeflenir.',
    useCases: [
      'Şirket içi doküman asistanı',
      'Müşteri destek botu ve RAG pipeline',
      'Ekipçe ajan iş akışı tasarımı',
    ],
  },
  {
    slug: 'jan',
    name: 'Jan',
    description: 'Tamamen çevrimdışı çalışan açık kaynak ChatGPT masaüstü alternatifi.',
    icon: 'jan',
    listingType: 'saas',
    category: 'Yapay Zeka',
    brandColor: '#F4B400',
    features: [
      'Yerel LLM çalıştırma, internet gerekmez',
      'Masaüstü ve sunucu kurulumu',
      'Model indirme ve sohbet arayüzü',
      'Gizlilik odaklı, veri cihazda kalır',
      'Açık kaynak lisans',
    ],
    about:
      'Jan, ChatGPT benzeri bir arayüzü kendi bilgisayarınızda veya sunucunuzda çalıştırır. Model çıkarımı yereldir; bağlantı kesikken de asistan kullanılabilir.',
    useCases: [
      'İnternetsiz yerel yapay zeka asistanı',
      'Hassas belgelerle çevrimdışı sohbet',
      'Ekipler için self-host LLM arayüzü',
    ],
  },
  {
    slug: 'anything-llm',
    name: 'AnythingLLM',
    description: 'PDF ve şirket belgelerinizle güvenle sohbet eden yerel bilgi bankası.',
    icon: 'anythingllm',
    listingType: 'saas',
    category: 'Yapay Zeka',
    brandColor: '#3B82F6',
    features: [
      'PDF, Word ve metin belgesi yükleme',
      'Yerel veya kendi modelinizle RAG',
      'Çoklu çalışma alanı ve ajan deneyimi',
      'Self-host, veri dışarı çıkmaz',
      'ChatPDF alternatifi açık kaynak',
    ],
    about:
      'AnythingLLM, şirket içi belgeleri yükleyip verilerinizle sohbet etmenizi sağlar. Amaç kiralık zeka yerine kendi altyapınızda çalışan bir bilgi bankası kurmaktır.',
    useCases: [
      'İç prosedür ve PDF arşiviyle soru-cevap',
      'Hukuk veya finans doküman asistanı',
      'Yerel-first ajan deneyimi',
    ],
  },
  {
    slug: 'stagehand',
    name: 'Stagehand',
    description: 'Yapay zeka ajanlarının web’de insan gibi gezinmesini sağlayan tarayıcı SDK’sı.',
    icon: 'stagehand',
    listingType: 'saas',
    category: 'Yapay Zeka',
    brandColor: '#F03603',
    features: [
      'Doğal dil ile sayfa aksiyonları',
      'Form doldurma ve veri çıkarma',
      'Browserbase bulut tarayıcı entegrasyonu',
      'Tekrarlanabilir, önbellekli iş akışları',
      'TypeScript SDK',
    ],
    about:
      'Stagehand (Browserbase), ajanların sitelerde gezinmesi, form doldurması ve veri toplaması için tarayıcı otomasyon altyapısıdır. AI ile kodu birleştirerek kırılgan selector’lara daha az bağımlı otomasyon yazar.',
    useCases: [
      'Ajan tabanlı web kazıma',
      'Form ve kayıt akışlarını otomatikleştirme',
      'Tarayıcı ajanı ürünleri',
    ],
  },
  {
    slug: 'mastra',
    name: 'Mastra',
    description: 'TypeScript ile ajan, iş akışı ve RAG kurmak için modern AI çerçevesi.',
    icon: 'mastra',
    listingType: 'saas',
    category: 'Yapay Zeka',
    brandColor: '#00C853',
    features: [
      'Ajan, workflow ve bellek primitive’leri',
      'RAG ve araç entegrasyonu',
      'TypeScript-first API',
      'Stagehand ile tarayıcı otomasyonu',
      'Üretim ortamına yönelik gözlemlenebilirlik',
    ],
    about:
      'Mastra, TypeScript geliştiricilerinin hazır ajanlar, iş akışları ve RAG sistemleri kurması için yazılmış bir çerçevedir. Model, araç ve veri kaynaklarını tek arayüzde birleştirir.',
    useCases: [
      'Ürün içi AI ajanı',
      'Şirket verisiyle RAG asistanı',
      'Tarayıcı ve API araçlı otomasyon ajanı',
    ],
  },
  {
    slug: 'typebot',
    name: 'Typebot',
    description: 'Siteye gömülen adım adım anket ve sohbet botu oluşturucu.',
    icon: 'typebot',
    listingType: 'saas',
    category: 'İletişim & Destek',
    brandColor: '#0042DA',
    features: [
      'Görsel bot ve form akışı',
      'Web sitesine gömme',
      'Dinamik soru ve dallanma',
      'Self-host açık kaynak',
      'Typeform alternatifi',
    ],
    about:
      'Typebot, web sitelerine gömülen etkileşimli sohbet botları ve dinamik anketler üretir. Adım adım akışlarla lead toplama veya destek yönlendirmesi kurulur.',
    useCases: [
      'Landing page lead formu',
      'Ürün onboarding sohbeti',
      'Müşteri memnuniyet anketi',
    ],
  },
  {
    slug: 'krayin',
    name: 'Krayin CRM',
    description: 'Müşteri, lead ve satış hattı yönetimi için açık kaynak Laravel CRM.',
    icon: 'krayin',
    listingType: 'saas',
    category: 'İletişim & Destek',
    brandColor: '#0284C7',
    features: [
      'Lead, fırsat ve pipeline takibi',
      'Müşteri kartları ve aktivite geçmişi',
      'Laravel tabanlı, genişletilebilir',
      'Self-host, peşin lisans maliyeti yok',
      'Pipedrive alternatifi hafif CRM',
    ],
    about:
      'Krayin CRM, B2B ekipler için müşteri ilişkileri, satış kanalları ve fırsat takibi sunan modüler bir açık kaynak CRM’dir. Laravel ile gelir; kendi sunucunuzda çalışır.',
    useCases: [
      'KOBİ satış pipeline’ı',
      'Lead ve teklif takibi',
      'Self-host müşteri veritabanı',
    ],
  },
  {
    slug: 'corteza',
    name: 'Corteza',
    description: 'Kendi satış süreçlerinizi tasarlamanıza izin veren düşük kodlu CRM platformu.',
    icon: 'corteza',
    listingType: 'saas',
    category: 'İletişim & Destek',
    brandColor: '#4A90D9',
    features: [
      'Low-code uygulama ve form tasarımı',
      'Özel müşteri kartları ve iş akışları',
      'Rol tabanlı erişim',
      'Self-host açık kaynak',
      'Salesforce alternatifi esneklik',
    ],
    about:
      'Corteza, ekiplerin kendi satış süreçlerini, müşteri kartlarını ve iş akışlarını kod yazmadan tasarlamasına olanak tanıyan düşük kodlu bir platformdur.',
    useCases: [
      'Kuruma özel CRM',
      'İç süreç ve onay akışları',
      'Salesforce yerine self-host CRM',
    ],
  },
  {
    slug: 'dokploy',
    name: 'Dokploy',
    description: 'Kendi sunucunuzda Vercel / Netlify / Heroku alternatifi dağıtım paneli.',
    icon: 'dokploy',
    listingType: 'saas',
    category: 'Platform & Dağıtım',
    brandColor: '#5B4DFF',
    features: [
      'Git’ten tek tıkla canlıya alma',
      'Veritabanı ve uygulama yönetimi',
      'Docker tabanlı self-host PaaS',
      'Vercel, Netlify ve Heroku alternatifi',
      'Açık kaynak panel',
    ],
    about:
      'Dokploy, kendi sunucunuza kurarak veritabanlarını ve web uygulamalarını tek tıkla yayınlamanızı sağlayan bulut yönetim panelidir.',
    useCases: [
      'Startup self-host PaaS',
      'Ajans müşteri sitelerini tek panelden yayınlama',
      'Vercel yerine kendi altyapı',
    ],
  },
  {
    slug: 'caprover',
    name: 'CapRover',
    description: 'Docker + nginx ile ölçeklenebilir self-host PaaS (Heroku alternatifi).',
    icon: 'caprover',
    listingType: 'saas',
    category: 'Platform & Dağıtım',
    brandColor: '#ED5B2D',
    features: [
      'Tek tıkla Node, Python, PHP ve veritabanı',
      'Let’s Encrypt SSL',
      'Ölçeklenebilir Docker + nginx',
      'Web arayüzü ve CLI',
      'One-click uygulama kataloğu',
    ],
    about:
      'CapRover, kendi Docker sunucunuza saniyeler içinde uygulama ve veritabanı kurmanızı sağlayan ölçeklenebilir bir PaaS’tır. Heroku benzeri deneyimi kendi makinenizde sunar.',
    useCases: [
      'Küçük ekip self-host Heroku',
      'Hızlı staging ortamı',
      'Tek VPS’te çoklu uygulama',
    ],
  },
  {
    slug: 'appsmith',
    name: 'Appsmith',
    description: 'Veritabanı ve API’lere bağlı iç araç ve admin paneli oluşturucu.',
    icon: 'appsmith',
    listingType: 'saas',
    category: 'Geliştirme Araçları',
    brandColor: '#E15615',
    features: [
      '25+ veritabanı ve herhangi bir API',
      'Sürükle-bırak admin paneli',
      'JS ile iş mantığı',
      'Self-host açık kaynak',
      'Retool alternatifi',
    ],
    about:
      'Appsmith, veritabanlarınıza bağlanarak şirket içi yönetim panelleri ve iç araçlar tasarlamanızı sağlar. Operasyon ekipleri için hızlı dahili yazılım üretir.',
    useCases: [
      'Müşteri destek admin paneli',
      'Stok ve sipariş iç aracı',
      'Retool yerine self-host internal tools',
    ],
  },
  {
    slug: 'strix',
    name: 'Strix',
    description: 'Yapay zeka ile web açıklarını bulan açık kaynak sızma testi aracı.',
    icon: 'strix',
    listingType: 'saas',
    category: 'Kimlik & Güvenlik',
    brandColor: '#7C3AED',
    features: [
      'AI destekli zafiyet tarama',
      'Web uygulama sızma testi',
      'Bulunan açıklar için düzeltme yönlendirmesi',
      'Açık kaynak, self-host edilebilir',
      'Geliştirici odaklı güvenlik',
    ],
    about:
      'Strix, yapay zeka ile web uygulamalarındaki güvenlik açıklarını otomatik tespit etmeyi hedefler. Penetrasyon testi ihtiyacını geliştirme döngüsüne yaklaştırır.',
    useCases: [
      'Sprint öncesi güvenlik taraması',
      'Staging ortamında zafiyet avı',
      'Küçük ekipler için pentest yardımcısı',
    ],
  },
  {
    slug: 'superset',
    name: 'Apache Superset',
    description: 'Büyük veri kaynaklarına bağlanan kurumsal görselleştirme ve BI platformu.',
    icon: 'superset',
    listingType: 'saas',
    category: 'BI & Görselleştirme',
    brandColor: '#20A7C9',
    features: [
      'SQL Lab ve görsel grafik oluşturucu',
      'Çoklu veri kaynağı bağlantısı',
      'Dashboard paylaşımı ve rol tabanlı erişim',
      'Self-host Apache lisansı',
      'Power BI / Tableau alternatifi',
    ],
    about:
      'Apache Superset, büyük veri kaynaklarına bağlanıp gelişmiş görselleştirmeler ve paneller hazırlayan kurumsal iş zekası platformudur.',
    useCases: [
      'Şirket metrik panosu',
      'SQL ekibi için self-servis BI',
      'Tableau yerine açık kaynak BI',
    ],
  },
  {
    slug: 'lightdash',
    name: 'Lightdash',
    description: 'Kod hızında metrik, grafik ve ajan tabanlı iş zekası.',
    icon: 'lightdash',
    listingType: 'saas',
    category: 'BI & Görselleştirme',
    brandColor: '#0D0D0D',
    features: [
      'dbt semantik katmanıyla uyum',
      'Hızlı grafik ve metrik tanımlama',
      'Self-host açık kaynak',
      'Looker alternatifi analitik',
      'Geliştirici dostu BI',
    ],
    about:
      'Lightdash, veri ekiplerinin hızlıca grafikler, metrikler ve iş zekası panelleri oluşturmasını sağlar. Analitiği kod ve depo ile aynı hızda tutmayı hedefler.',
    useCases: [
      'dbt kullanan ekiplerde self-servis BI',
      'Ürün metrik panosu',
      'Looker yerine açık kaynak katman',
    ],
  },
  {
    slug: 'redash',
    name: 'Redash',
    description: 'SQL ile grafik ve paylaşılabilir rapor panoları üreten veri aracı.',
    icon: 'redash',
    listingType: 'saas',
    category: 'BI & Görselleştirme',
    brandColor: '#FF7964',
    features: [
      'Herhangi bir veri kaynağına SQL',
      'Grafik ve dashboard paylaşımı',
      'Zamanlanmış sorgular ve uyarılar',
      'Self-host açık kaynak',
      'Metabase alternatifi sorgu odaklı BI',
    ],
    about:
      'Redash, veritabanlarınıza SQL atarak hızlıca grafikler ve paylaşılabilir rapor panelleri oluşturmanızı sağlar. Şirketi veri odaklı hale getirmeyi kolaylaştırır.',
    useCases: [
      'Operasyon SQL raporları',
      'Paylaşılan sorgu kütüphanesi',
      'Hafif self-host BI',
    ],
  },
  {
    slug: 'medusa',
    name: 'Medusa',
    description: 'Headless, modüler ve özelleştirilebilir açık kaynak e-ticaret altyapısı.',
    icon: 'medusa',
    listingType: 'saas',
    category: 'E-ticaret',
    brandColor: '#000000',
    features: [
      'Headless commerce API',
      'Modüler sepet, ödeme ve stok',
      'Ajan ve geliştirici odaklı uzantılar',
      'Self-host açık kaynak',
      'Shopify alternatifi esneklik',
    ],
    about:
      'Medusa, özelleştirilebilir ve ön yüzü bağımsız (headless) bir e-ticaret platformudur. Kendi vitrininizi bağlayıp ticaret mantığını API üzerinden yönetirsiniz.',
    useCases: [
      'Özel vitrinli D2C mağaza',
      'Headless commerce backend',
      'Shopify yerine kod kontrolü',
    ],
  },
  {
    slug: 'btcpay',
    name: 'BTCPay Server',
    description: 'Aracısız, self-host Bitcoin ve kripto ödeme işlemcisi.',
    icon: 'btcpay',
    listingType: 'saas',
    category: 'E-ticaret',
    brandColor: '#51B13E',
    features: [
      'Doğrudan kendi cüzdanınıza ödeme',
      'Komisyonsuz Bitcoin tahsilatı',
      'Self-host açık kaynak',
      'Fatura ve POS',
      'Stripe alternatifi kripto tahsilat',
    ],
    about:
      'BTCPay Server, aracı komisyonu ödemeden Bitcoin ve kripto ödemesi almanızı sağlayan serbest ödeme işlemcisidir. Fonlar sizin cüzdanınızda kalır.',
    useCases: [
      'E-ticarette Bitcoin checkout',
      'Bağış ve fatura tahsilatı',
      'Self-host ödeme altyapısı',
    ],
  },
  {
    slug: 'freecodecamp',
    name: 'freeCodeCamp',
    description: 'İnteraktif kodlama müfredatı ve topluluk sunan açık kaynak eğitim platformu.',
    icon: 'freecodecamp',
    listingType: 'saas',
    category: 'Dokümantasyon & Wiki',
    brandColor: '#0A0A23',
    features: [
      'Ücretsiz programlama müfredatı',
      'İnteraktif alıştırmalar',
      'Topluluk ve sertifika yapısı',
      'Açık kaynak kod tabanı',
      'Self-host edilebilir eğitim altyapısı',
    ],
    about:
      'freeCodeCamp, interaktif kodlama dersleri, müfredat ve topluluk yönetimi sunan açık kaynak bir eğitim platformudur. Kendi eğitim deneyiminizi bu kod tabanı üzerine kurabilirsiniz.',
    useCases: [
      'İç eğitim akademisi',
      'Açık kaynak müfredat yayını',
      'Topluluk öğrenme portalı',
    ],
  },
  {
    slug: 'nook-muhasebe-mcp',
    name: 'NOOK MCP',
    description:
      'Şantiye WhatsApp masraflarını Logo Tiger ve Mikro ERP’ye otomatik fiş olarak işleyen otonom muhasebe asistanı.',
    icon: 'nook-muhasebe-mcp',
    listingType: 'saas',
    category: 'Otomasyon & İş Akışı',
    brandColor: '#14B8A6',
    demoUrl: '/service/nook-muhasebe-mcp/simulasyon',
    features: [
      'WhatsApp üzerinden şantiye masraf girişi',
      'Logo Tiger / Mikro ERP taslak fiş entegrasyonu',
      'Yönetici onay akışı ve WhatsApp özeti',
      'Vade ve çek ödeme uyarıları',
      'Proje ve tedarikçi bazlı masraf takibi',
    ],
    about:
      'NOOK MCP, inşaat ve saha ekiplerinin WhatsApp üzerinden ilettiği masrafları yapay zeka ile ayrıştırır; cari, KDV ve proje bilgilerini Logo Tiger veya Mikro ERP taslak fişlerine dönüştürür. Yöneticiler tek ekrandan onaylar, vade risklerini görür ve günlük özetleri WhatsApp’tan alır. Blacknook ekosisteminde bulut yazılım olarak sunulur; canlı yayın simülasyonunu hemen deneyebilirsiniz.',
    useCases: [
      'Şantiye grubundan gelen fiş ve masraf mesajlarını ERP’ye aktarma',
      'Muhasebe ekibinin taslak fiş onay sürecini hızlandırma',
      'Yarın vadesi gelen çek ve ödemeler için erken uyarı',
    ],
  },
];

export type ServiceDealMeta = {
  price: number;
  originalPrice: number;
  reviews: number;
};

/** Fiyat / inceleme — henüz gerçek deal verisi yok; sıfır döner */
export function getServiceDealMeta(_slug: string, _index = 0): ServiceDealMeta {
  return {
    price: 0,
    originalPrice: 0,
    reviews: 0,
  };
}

export function asOfficialCatalog(service: ServiceCatalogEntry): ServiceCatalogEntry {
  return {
    ...service,
    listingType: service.listingType || 'service',
    verified: true,
    vendorName: 'BlackNook',
    source: 'catalog',
  };
}

export function getFeaturedServices(limit = 12): ServiceCatalogEntry[] {
  return SERVICES.slice(0, limit).map(asOfficialCatalog);
}

export function getServiceBySlug(slug: string): ServiceCatalogEntry | undefined {
  return SERVICES.find((service) => service.slug === slug);
}

export function getAllServiceSlugs(): string[] {
  return SERVICES.map((service) => service.slug);
}
