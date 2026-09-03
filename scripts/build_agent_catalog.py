#!/usr/bin/env python3
"""Build 100 enterprise agent catalog entries from real MCP repos (mcp.so / GitHub)."""

from __future__ import annotations

import json
import re
import urllib.parse
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "src" / "data" / "mcp-integrations.json"

ALLOWED = {"MIT", "Apache-2.0", "BSD-3-Clause", "BSD-2-Clause", "ISC"}

MCP_SERVER_FEATURES: dict[str, list[str]] = {
    "src/postgres": ["Salt-okunur SQL sorguları", "Veritabanı şema keşfi", "Güvenli veri erişimi", "PostgreSQL entegrasyonu"],
    "src/github": ["Depo ve dosya yönetimi", "Pull request işlemleri", "Kod arama", "GitHub API entegrasyonu"],
    "src/slack": ["Kanal listeleme", "Mesaj gönderme", "Bildirim otomasyonu", "Slack workspace erişimi"],
    "src/gitlab": ["Proje ve dosya yönetimi", "Dal oluşturma", "GitLab API entegrasyonu", "Sürüm işlemleri"],
    "src/brave-search": ["Web araması", "Yerel işletme araması", "Sonuç filtreleme", "Brave Search API"],
    "src/filesystem": ["Dosya okuma ve yazma", "Dizin listeleme", "Erişim kontrolü", "Yerel dosya işlemleri"],
    "src/memory": ["Kalıcı bellek grafiği", "Oturumlar arası bağlam", "Bilgi saklama", "İlişkisel hafıza"],
    "src/fetch": ["Web içeriği çekme", "HTML'den Markdown dönüşümü", "URL tabanlı okuma", "LLM için içerik hazırlama"],
}

MCP_SERVER_BLURBS: dict[str, str] = {
    "src/postgres": "PostgreSQL veritabanlarına salt-okunur erişim sağlar; şema inceleme ve güvenli SQL sorguları çalıştırır.",
    "src/github": "GitHub API üzerinden depo yönetimi, dosya işlemleri ve kod arama yetenekleri sunar.",
    "src/slack": "Slack çalışma alanlarında kanal listeleme, mesajlaşma ve bildirim işlemlerini otomatikleştirir.",
    "src/gitlab": "GitLab projelerinde dosya, dal ve sürüm işlemlerini MCP arayüzüyle yönetir.",
    "src/brave-search": "Brave Search API ile web ve yerel arama sonuçlarını yapılandırılmış biçimde döndürür.",
    "src/filesystem": "Yapılandırılabilir erişim kontrolleriyle güvenli dosya okuma, yazma ve dizin işlemleri yapar.",
    "src/memory": "Yerel bilgi grafiği ile oturumlar arası kalıcı bellek ve bağlam saklama sağlar.",
    "src/fetch": "Web sayfalarından içerik çekip HTML'i LLM'ler için Markdown'a dönüştürür.",
}

REPO_PRODUCT_INFO: dict[str, dict[str, list[str] | str]] = {
    "trsdn/markitdown-mcp": {
        "about": "MarkItDown MCP, PDF, Word, Excel, PowerPoint, görsel ve ses dosyalarını yapılandırılmış Markdown'a dönüştürür; sözleşme, fatura ve raporları yapay zeka için okunabilir hale getirir.",
        "features": ["29+ dosya formatı desteği", "PDF ve Office belge dönüşümü", "Görsel OCR ve meta veri çıkarımı", "Ses dosyasından metin üretimi", "MCP istemcileriyle doğrudan entegrasyon"],
    },
    "stripe/agent-toolkit": {
        "about": "Stripe Agent Toolkit, ödeme, fatura, abonelik ve müşteri işlemlerini Stripe API üzerinden yapay zeka ajanlarına güvenli araçlar olarak sunar.",
        "features": ["Ödeme ve fatura yönetimi", "Abonelik ve müşteri sorgulama", "Stripe API araçları", "Kurumsal ödeme otomasyonu", "Güvenli API anahtarı yönetimi"],
    },
    "fiddlecube/compliant-llm": {
        "about": "Compliant LLM, KVKK ve kurumsal güvenlik gereksinimlerine uygun yapay zeka ajan altyapısı sunar; hassas verilerin politika tabanlı korunmasını sağlar.",
        "features": ["Veri gizliliği kontrolleri", "Politika tabanlı erişim", "Denetim izi", "Uyum odaklı ajan çalıştırma", "MCP sunucu entegrasyonu"],
    },
    "MFYDev/ghost-mcp": {
        "about": "Ghost MCP, Ghost CMS üzerinde yazı oluşturma, düzenleme, etiketleme ve yayınlama işlemlerini yapay zeka ajanlarına bağlar.",
        "features": ["Yazı oluşturma ve düzenleme", "Taslak ve yayın yönetimi", "Etiket ve kategori işlemleri", "İçerik arama", "CMS otomasyonu"],
    },
    "elastic/mcp-server-elasticsearch": {
        "about": "Elasticsearch MCP, log, metrik ve arama indekslerine doğal dil ile sorgu göndermeyi ve sonuçları özetlemeyi sağlar.",
        "features": ["Elasticsearch sorgulama", "Log ve metrik analizi", "İndeks keşfi", "Arama sonucu özetleme", "Operasyonel veri erişimi"],
    },
    "aptro/superset-mcp": {
        "about": "Superset MCP, Apache Superset panolarına ve SQL sorgularına ajan erişimi sağlar; 50'den fazla veri kaynağından rapor çekmeyi kolaylaştırır.",
        "features": ["Dashboard sorgulama", "50+ veri kaynağı", "SQL ve görsel sorgu desteği", "Metrik ve KPI erişimi", "Self-servis BI entegrasyonu"],
    },
    "patsnap/patent-literature-search-mcp": {
        "about": "Patent Literature Search MCP, patent ve teknik literatür veritabanlarında semantik arama yaparak ilgili buluş ve yayınları bulur.",
        "features": ["Patent literatür araması", "Semantik sorgulama", "Teknik doküman keşfi", "Atıf ve benzerlik analizi", "Araştırma raporu desteği"],
    },
    "Tencent/AI-Infra-Guard": {
        "about": "AI-Infra-Guard, AI altyapısı, MCP sunucuları ve ajan becerileri için güvenlik taraması, zafiyet analizi ve jailbreak testleri sunar.",
        "features": ["MCP sunucu güvenlik taraması", "CVE ve zafiyet eşleştirme", "Ajan beceri denetimi", "Jailbreak değerlendirmesi", "AI altyapı risk analizi"],
    },
    "assafelovic/gpt-researcher": {
        "about": "GPT Researcher, web ve yerel kaynaklardan otonom derin araştırma yapan açık kaynak bir araştırma ajanıdır; kaynaklı raporlar üretir.",
        "features": ["Otonom web araştırması", "Kaynaklı rapor üretimi", "Çoklu kaynak sentezi", "Derin araştırma modu", "Özelleştirilebilir araştırma görevleri"],
    },
    "ctxfile/ctxfile": {
        "about": "Ctxfile, birden fazla yapay zeka ajanı arasında paylaşılan çalışma bağlamını dosya tabanlı olarak saklar; plan, karar ve proje durumunu korur.",
        "features": ["Ortak ajan bağlamı", "Proje durumu saklama", "Git durumu ve karar kaydı", "Çoklu ajan uyumu", "Yerel bağlam dosyası"],
    },
    "mysleekdesigns/crawlforge-mcp": {
        "about": "CrawlForge MCP, web sitelerinden yapılandırılmış veri toplar; fiyat, stok ve içerik değişikliklerini izlemek için tarama araçları sunar.",
        "features": ["Web sayfası okuma", "Site haritalama", "Yapılandırılmış veri çıkarma", "Toplu tarama", "Değişiklik izleme"],
    },
    "stippi/code-assistant": {
        "about": "Code Assistant, kod tabanını analiz eden ve otonom geliştirme görevleri yürüten bir MCP/ACP kod asistanıdır.",
        "features": ["Kod tabanı analizi", "Otonom kod üretimi", "Refactoring desteği", "Test ve dokümantasyon", "MCP ve ACP modu"],
    },
    "zapier/zapier-mcp": {
        "about": "Zapier MCP, yapay zeka ajanlarının Zapier üzerinden 8.000'den fazla uygulama ve servisle otomatik iş akışı kurmasını sağlar.",
        "features": ["8.000+ uygulama entegrasyonu", "Tetikleyici ve aksiyon otomasyonu", "Çok adımlı iş akışları", "Kurumsal SaaS bağlantıları", "Kodsuz entegrasyon"],
    },
    "awslabs/mcp": {
        "about": "AWS MCP sunucuları, yapay zeka ajanlarına AWS kaynakları, maliyet, güvenlik ve altyapı yönetimi için resmi araçlar sağlar.",
        "features": ["AWS kaynak yönetimi", "Maliyet ve kullanım analizi", "Altyapı otomasyonu", "Güvenlik ve IAM sorguları", "Bulut operasyon araçları"],
    },
    "microsoft/playwright-mcp": {
        "about": "Playwright MCP, tarayıcı otomasyonu ile web sayfalarını test eder, form doldurur ve kullanıcı akışlarını simüle eder.",
        "features": ["Tarayıcı otomasyonu", "E2E test senaryoları", "Form ve tıklama simülasyonu", "Ekran görüntüsü alma", "Web QA otomasyonu"],
    },
    "stickerdaniel/linkedin-mcp-server": {
        "about": "LinkedIn MCP, oturum açmış LinkedIn hesabınız üzerinden profil, şirket, iş ilanı arama ve ağ verilerine güvenli erişim sağlar.",
        "features": ["Profil ve şirket araması", "İş ilanı sorgulama", "Bağlantı ve ağ verisi", "Satış araştırması", "Yerel oturum güvenliği"],
    },
    "ClickHouse/mcp-clickhouse": {
        "about": "ClickHouse MCP, yüksek hacimli analitik veritabanına SQL sorguları göndermeyi ve sonuçları yapay zeka için yapılandırmayı sağlar.",
        "features": ["ClickHouse SQL sorguları", "Yüksek hacimli analitik", "Şema keşfi", "Metrik ve log analizi", "Hızlı OLAP erişimi"],
    },
    "qdrant/mcp-server-qdrant": {
        "about": "Qdrant MCP, vektör veritabanında semantik arama, benzerlik eşleştirme ve RAG tabanlı bilgi erişimi sağlar.",
        "features": ["Semantik vektör araması", "Benzerlik eşleştirme", "RAG bilgi erişimi", "Koleksiyon yönetimi", "Anlamsal geri bildirim analizi"],
    },
    "googleapis/genai-toolbox": {
        "about": "Google GenAI Toolbox, Google'ın üretken yapay zeka modellerine ve araçlarına standart MCP arayüzü üzerinden erişim sağlar.",
        "features": ["Google AI model erişimi", "Çok dilli içerik üretimi", "Uzun doküman analizi", "Görsel anlama", "Kurumsal AI entegrasyonu"],
    },
    "dbt-labs/dbt-mcp": {
        "about": "dbt MCP, dbt projelerinde model, test ve lineage bilgilerine erişerek veri dönüşümü ve analitik iş akışlarını yönetir.",
        "features": ["dbt model sorgulama", "Veri lineage görünürlüğü", "Test ve kalite kontrol", "Analitik iş akışı", "Metrik ve KPI erişimi"],
    },
    "cloudflare/mcp-server-cloudflare": {
        "about": "Cloudflare MCP, DNS, CDN, Workers ve güvenlik ayarlarını Cloudflare hesabınız üzerinden yönetmeyi sağlar.",
        "features": ["DNS ve alan adı yönetimi", "CDN ve önbellek kontrolü", "Workers dağıtımı", "Güvenlik ve WAF ayarları", "Trafik analizi"],
    },
    "chroma-core/chroma-mcp": {
        "about": "Chroma MCP, gömülü bellek ve vektör arama ile geçmiş teklifler, vaka çalışmaları ve kurumsal bilgiyi anlamsal olarak eşleştirir.",
        "features": ["Vektör bellek deposu", "Semantik doküman araması", "Bilgi eşleştirme", "RAG destekli yanıtlar", "Kurumsal arşiv erişimi"],
    },
    "redis/mcp-redis": {
        "about": "Redis MCP, önbellek ve anahtar-değer deposuna gerçek zamanlı erişim sağlayarak oturum, stok ve olay verilerini yönetir.",
        "features": ["Gerçek zamanlı veri erişimi", "Anahtar-değer sorgulama", "Önbellek yönetimi", "Olay ve oturum takibi", "Düşük gecikmeli veri"],
    },
    "supabase-community/supabase-mcp": {
        "about": "Supabase MCP, PostgreSQL tabanlı Supabase projelerinde tablo sorgulama, veri okuma ve backend işlemlerini ajanlara açar.",
        "features": ["PostgreSQL tablo erişimi", "Satır düzeyinde sorgular", "Şema keşfi", "Backend veri işlemleri", "Gerçek zamanlı veri"],
    },
    "faulkj/legion-mcp": {
        "about": "Legion MCP, birden fazla yapay zeka modelinin tartışarak ve oylayarak ortak karar üretmesini sağlayan konsey tabanlı bir sistemdir.",
        "features": ["Çoklu model konseyi", "Oylama ve konsensüs", "Kalite değerlendirmesi", "Konuşma analizi", "Karar destek çıktıları"],
    },
    "evalstate/mcp-hfspace": {
        "about": "Hugging Face Spaces MCP, Hugging Face üzerindeki demo uygulamalara ve modellere MCP arayüzüyle erişim sağlar.",
        "features": ["HF Spaces erişimi", "Model demo çalıştırma", "Proje değerlendirme", "Hızlı prototipleme", "Açık model entegrasyonu"],
    },
    "faulkj/fhirhydrant": {
        "about": "FHIR Hydrant MCP, FHIR uyumlu sağlık kayıtlarına güvenli sorgu ve terminoloji araması yaparak klinik veri entegrasyonu sağlar.",
        "features": ["FHIR kayıt sorgulama", "Klinik veri erişimi", "Terminoloji araması", "Güvenli sayfalama", "Sağlık veri entegrasyonu"],
    },
    "BlazingCDN/blazingcdn-mcp": {
        "about": "BlazingCDN MCP, içerik dağıtım ağındaki önbellek, trafik metrikleri ve alan adı ayarlarını yönetmeyi sağlar.",
        "features": ["CDN önbellek yönetimi", "Trafik metrikleri", "Alan adı kontrolü", "Medya dağıtımı", "Performans optimizasyonu"],
    },
}

REPO_LOGO_SLUGS: dict[str, str] = {
    "trsdn/markitdown-mcp": "microsoft",
    "stripe/agent-toolkit": "stripe",
    "fiddlecube/compliant-llm": "letsencrypt",
    "MFYDev/ghost-mcp": "ghost",
    "elastic/mcp-server-elasticsearch": "elastic",
    "aptro/superset-mcp": "apache",
    "patsnap/patent-literature-search-mcp": "wikipedia",
    "Tencent/AI-Infra-Guard": "tencentqq",
    "assafelovic/gpt-researcher": "arxiv",
    "ctxfile/ctxfile": "notion",
    "mysleekdesigns/crawlforge-mcp": "googlechrome",
    "stippi/code-assistant": "githubcopilot",
    "zapier/zapier-mcp": "zapier",
    "awslabs/mcp": "amazonwebservices",
    "microsoft/playwright-mcp": "playwright",
    "stickerdaniel/linkedin-mcp-server": "linkedin",
    "ClickHouse/mcp-clickhouse": "clickhouse",
    "qdrant/mcp-server-qdrant": "qdrant",
    "googleapis/genai-toolbox": "google",
    "dbt-labs/dbt-mcp": "dbt",
    "cloudflare/mcp-server-cloudflare": "cloudflare",
    "chroma-core/chroma-mcp": "semanticui",
    "redis/mcp-redis": "redis",
    "supabase-community/supabase-mcp": "supabase",
    "faulkj/legion-mcp": "openai",
    "evalstate/mcp-hfspace": "huggingface",
    "faulkj/fhirhydrant": "openmrs",
    "BlazingCDN/blazingcdn-mcp": "cloudflare",
    "modelcontextprotocol/servers": "modelcontextprotocol",
}

MCP_SUBPATH_LOGO_SLUGS: dict[str, str] = {
    "src/postgres": "postgresql",
    "src/github": "github",
    "src/slack": "slack",
    "src/gitlab": "gitlab",
    "src/brave-search": "brave",
    "src/filesystem": "protondrive",
    "src/memory": "neo4j",
    "src/fetch": "firefox",
}

REPO_LOGO_INITIALS: dict[str, str] = {}

# (id, agent_name, problem, repo, subpath?, category, color)
AGENTS: list[tuple] = [
    ("sql-readonly-reporting", "SQL Salt-Okunur Raporlama Ajanı", "Finans/pazarlama ekiplerine teknik ekibe gitmeden doğal dille veritabanından veri çeker.", "modelcontextprotocol/servers", "src/postgres", "Veri & Raporlama", "#336791"),
    ("contract-nda-auditor", "Sözleşme & NDA Risk Denetçisi", "Tedarikçi/müşteri sözleşmelerinde şirketi riske atan cezai şart ve gizlilik açıklarını tespit eder.", "trsdn/markitdown-mcp", None, "Hukuk & Uyum", "#7C3AED"),
    ("invoice-delivery-matcher", "Tedarikçi Fatura & İrsaliye Eşleştirici", "Gelen faturalar ile depo irsaliyelerini satır bazlı karşılaştırıp farkları muhasebeye bildirir.", "stripe/agent-toolkit", None, "Muhasebe & Finans", "#635BFF"),
    ("kvkk-pii-masker", "Şirket İçi KVKK/PII Maskeleme Ajanı", "LLM'lere gönderilmeden önce müşteri T.C., telefon ve kart verilerini bellekten uçurur.", "fiddlecube/compliant-llm", None, "Güvenlik & Uyum", "#1E40AF"),
    ("employee-onboarding", "Yeni Personel Onboarding Ajanı", "Yeni çalışanın ilk 30 gününde sistem izinleri, oryantasyon takvimi ve doküman erişimini yönetir.", "MFYDev/ghost-mcp", None, "İnsan Kaynakları", "#15171A"),
    ("sentry-error-triage", "Canlı Sistem Hata & Sentry Triyajcısı", "Yazılım çöktüğünde hatanın hangi kod satırından ve commit'ten çıktığını anında özetler.", "elastic/mcp-server-elasticsearch", None, "Yazılım & DevOps", "#005571"),
    ("churn-early-warning", "Müşteri Kayıp (Churn) Erken Uyarı Ajanı", "Kullanım sıklığı düşen kurumsal müşterileri CRM'de saptayıp satış temsilcisine bildirim atar.", "aptro/superset-mcp", None, "Satış & CRM", "#20A6C9"),
    ("tender-spec-analyst", "Kamu İhale & Şartname Analisti", "EKAP/ihale bültenlerindeki yüzlerce sayfalık teknik şartnameleri şirket yeterliliğiyle kıyaslar.", "patsnap/patent-literature-search-mcp", None, "Satın Alma", "#005587"),
    ("oss-license-auditor", "Yazılım Bağımlılık & Lisans Denetçisi", "Kod tabanındaki açık kaynak kütüphanelerin AGPL/GPL gibi şirket için riskli lisanslarını tarar.", "Tencent/AI-Infra-Guard", None, "Güvenlik & Uyum", "#B91C1C"),
    ("rfp-response-agent", "B2B Teklif & RFP Yanıt Ajanı", "Gelen teknik şartname sorularını şirketin geçmiş başarılı teklif arşivini tarayarak yanıtlar.", "assafelovic/gpt-researcher", None, "Satış & CRM", "#2563EB"),
    ("hr-benefits-qa", "Bordro & Yan Hak Soru-Cevap Ajanı", "Çalışanların izin bakiyesi, prim ve yan hak sorularını İK yerine anında yanıtlar.", "ctxfile/ctxfile", None, "İnsan Kaynakları", "#14B8A6"),
    ("competitor-price-monitor", "Rakip Fiyat & Stok Monitörü", "Rakiplerin e-ticaret sitelerindeki fiyat değişikliklerini anlık tarayıp dinamik fiyat önerir.", "mysleekdesigns/crawlforge-mcp", None, "Pazarlama & Analiz", "#10B981"),
    ("github-pr-reviewer", "Şirket İçi Git PR İnceleme Asistanı", "Yazılımcıların açtığı pull request'leri şirket kodlama standartlarına ve güvenliğe göre inceler.", "modelcontextprotocol/servers", "src/github", "Yazılım & DevOps", "#24292F"),
    ("expense-receipt-approver", "Gider Fişi & Masraf Onay Ajanı", "Çalışanların yüklediği fişleri kategorize eder, şirket harcama politikasını aşanları yakalar.", "stripe/agent-toolkit", None, "Muhasebe & Finans", "#635BFF"),
    ("ticket-prioritizer", "Çok Kanallı Bilet Önceliklendirici", "Gelen müşteri destek biletlerini aciliyet ve VIP statüsüne göre doğru birime yönlendirir.", "modelcontextprotocol/servers", "src/slack", "Müşteri Destek", "#4A154B"),
    ("meeting-to-jira", "Toplantı Kararları & Jira Çevirici", "Yönetim kurulu veya proje toplantısı ses kayıtlarından otomatik Jira/Linear görevleri üretir.", "modelcontextprotocol/servers", "src/memory", "Operasyon", "#7C3AED"),
    ("social-crisis-detector", "Sosyal Medya Kriz Dedektörü", "Marka hakkında sosyal medyada aniden artan negatif yorumları filtreleyip PR ekibini uyarır.", "mysleekdesigns/crawlforge-mcp", None, "Pazarlama & Analiz", "#10B981"),
    ("legacy-code-documenter", "Eski Kod (Legacy) Dokümantasyon Ajanı", "Dokümantasyonu olmayan eski backend kodlarını tarayıp mimari şema ve iş mantığı çıkarır.", "stippi/code-assistant", None, "Yazılım & DevOps", "#374151"),
    ("supplier-sla-tracker", "Tedarikçi SLA & Teslimat Takipçisi", "Tedarikçilerin teslim tarihlerini ve gecikme cezası haklarını sözleşmeye göre hesaplar.", "zapier/zapier-mcp", None, "Satın Alma", "#FF4A00"),
    ("cloud-cost-optimizer", "Bulut (AWS/GCP) Maliyet Optimizatörü", "Kullanılmayan sanal makineleri ve atıl depolama alanlarını tespit edip kapatma listesi sunar.", "awslabs/mcp", None, "Sunucu ve altyapı", "#FF9900"),
    ("email-campaign-qa", "E-Posta Kampanya A/B Metin Denetçisi", "Pazarlama bültenlerindeki spam tetikleyici kelimeleri ve bozuk bağlantıları gönderimden önce yakalar.", "microsoft/playwright-mcp", None, "Pazarlama & Analiz", "#2EAD33"),
    ("it-asset-tracker", "Ofis Envanter & Donanım Takipçisi", "Personele zimmetlenen laptop, telefon ve lisansların yenilenme takvimini izler.", "modelcontextprotocol/servers", "src/filesystem", "IT & Operasyon", "#F59E0B"),
    ("case-law-researcher", "Dava Dosyası & İçtihat Tarama Ajanı", "Hukuk departmanının davaları için ilgili Yargıtay kararlarını ve emsal davaları özetler.", "patsnap/patent-literature-search-mcp", None, "Hukuk & Uyum", "#005587"),
    ("cold-email-personalizer", "B2B Soğuk Satış E-posta Kişiselleştirici", "Hedef şirketin son haberlerini tarayarak satış temsilcisine özel açılış cümleleri hazırlar.", "stickerdaniel/linkedin-mcp-server", None, "Satış & CRM", "#0A66C2"),
    ("offboarding-agent", "Çalışan Ayrılış (Offboarding) Ajanı", "Ayrılan personelin tüm SaaS hesaplarını, VPN yetkilerini ve şirket erişimlerini anında kapatır.", "zapier/zapier-mcp", None, "İnsan Kaynakları", "#FF4A00"),
    ("slow-query-hunter", "Veritabanı İndeks & Yavaş Sorgu Avcısı", "Veritabanında darboğaz yaratan SQL sorgularını bulup optimizasyon önerisi getirir.", "ClickHouse/mcp-clickhouse", None, "Veri & Raporlama", "#FFCC00"),
    ("feedback-synthesizer", "Müşteri Geri Bildirim Sentezleyicisi", "Destek biletleri ve anketlerdeki en çok tekrarlanan 5 ürün hatasını haftalık raporlar.", "qdrant/mcp-server-qdrant", None, "Müşteri Destek", "#DC244C"),
    ("seo-content-auditor", "SEO İçerik Sapma & Bozulma Ajanı", "Şirket blogundaki arama sıralaması düşen içerikleri bulup güncelleme noktalarını çıkarır.", "modelcontextprotocol/servers", "src/brave-search", "Pazarlama & Analiz", "#FB542B"),
    ("soc2-evidence-collector", "ISO/SOC2 Denetim Kanıt Toplayıcı", "Güvenlik denetimleri için gerekli log, ekran görüntüsü ve erişim kanıtlarını otomatik derler.", "Tencent/AI-Infra-Guard", None, "Güvenlik & Uyum", "#B91C1C"),
    ("catalog-localizer", "Çok Dilli Katalog & Ürün Çevirmeni", "E-ticaret ürün açıklamalarını sektörel terminolojiyi bozmadan hedef dillere yerelleştirir.", "googleapis/genai-toolbox", None, "Pazarlama & Analiz", "#4285F4"),
    ("investor-relations-brief", "Yatırımcı İlişkileri Aylık Bülten Ajanı", "Finansal ve operasyonel KPI'ları çekerek hissedarlar için aylık metrik raporunu taslaklar.", "aptro/superset-mcp", None, "Muhasebe & Finans", "#20A6C9"),
    ("reorder-stock-agent", "Depo Stok Seviyesi & Yeniden Sipariş Ajanı", "Kritik eşiğin altına inen ürünleri tedarik süresine göre hesaplayıp sipariş taslağı açar.", "supabase-community/supabase-mcp", None, "Operasyon", "#3FCF8E"),
    ("api-changelog-writer", "API Dokümantasyon & Değişim Günlüğü Ajanı", "Kod değişikliklerinden geliştiriciler için güncel API dokümanı ve release notes üretir.", "modelcontextprotocol/servers", "src/gitlab", "Yazılım & DevOps", "#FC6D26"),
    ("gtip-classifier", "E-İhracat Gümrük Tarife (GTİP) Kodlayıcı", "Satılan ürünlerin teknik özelliklerine göre doğru GTİP gümrük kodlarını eşleştirir.", "assafelovic/gpt-researcher", None, "Operasyon", "#2563EB"),
    ("saas-waste-detector", "SaaS Abonelik İsraf Dedektörü", "Şirket çalışanlarının kullanmadığı veya mükerrer ödenen yazılım aboneliklerini raporlar.", "zapier/zapier-mcp", None, "IT & Operasyon", "#FF4A00"),
    ("executive-weekly-brief", "Haftalık Yönetim Özeti (Executive Brief)", "Satış, destek, finans ve yazılım ekiplerinin haftalık çıktılarını 1 sayfalık CEO özetine dönüştürür.", "dbt-labs/dbt-mcp", None, "Yönetim", "#FF694A"),
    ("waf-log-analyst", "Kötü Niyetli İstek (WAF) Log İnceleyici", "Şirket web sitesine gelen olağandışı trafik ve brute-force saldırılarını analiz eder.", "cloudflare/mcp-server-cloudflare", None, "Güvenlik & Uyum", "#F38020"),
    ("retail-visit-reporter", "Perakende Mağaza Ziyaret Raporlayıcısı", "Saha ekiplerinin sesli veya metin notlarını standart mağaza denetim formuna işler.", "trsdn/markitdown-mcp", None, "Operasyon", "#7C3AED"),
    ("trademark-researcher", "Patent & Marka Benzerlik Araştırmacısı", "Yeni çıkarılacak marka/ürün isimlerinin tescil veritabanlarında çakışma riskini sorgular.", "patsnap/patent-literature-search-mcp", None, "Hukuk & Uyum", "#005587"),
    ("sales-objection-coach", "Satış İtirazı Yanıt Asistanı", "Potansiyel müşterilerin fiyat itirazlarına en uygun vaka çalışmalarını getirir.", "chroma-core/chroma-mcp", None, "Satış & CRM", "#FF6442"),
    ("return-fraud-detector", "E-Ticaret İade Sahtekarlığı Dedektörü", "Sürekli hileli iade talep eden şüpheli müşteri profillerini operasyon paneline taşır.", "redis/mcp-redis", None, "Operasyon", "#FF4438"),
    ("cash-reconciliation", "Çok Şubeli Nakit Mutabakat Ajanı", "Farklı şubelerden gelen gün sonu Z raporları ile banka pos hareketlerini karşılaştırır.", "ClickHouse/mcp-clickhouse", None, "Muhasebe & Finans", "#FFCC00"),
    ("l1-it-support", "Teknik Destek L1 Otomasyonu", "Şifremi unuttum ve bağlantı koptu gibi temel IT destek taleplerini insan müdahalesiz çözer.", "zapier/zapier-mcp", None, "IT & Operasyon", "#FF4A00"),
    ("wiki-knowledge-updater", "Şirket İçi Bilgi Bankası (Wiki) Güncelleyici", "Slack/Teams'te konuşulup çözülen yeni konuları otomatik şirket dokümanına ekler.", "MFYDev/ghost-mcp", None, "Operasyon", "#15171A"),
    ("field-service-router", "Saha Servis Rota & Görev Atayıcı", "Teknik servis teknisyenlerine konum ve işin aciliyetine göre günlük görev dağıtır.", "modelcontextprotocol/servers", "src/fetch", "Operasyon", "#0284C7"),
    ("influencer-verifier", "Influencer & Reklam İş Birliği Doğrulayıcı", "Anlaşma yapılacak profillerin sahte takipçi ve etkileşim oranlarını filtreler.", "mysleekdesigns/crawlforge-mcp", None, "Pazarlama & Analiz", "#10B981"),
    ("credit-risk-intel", "Kredi & Müşteri Risk İstihbaratçısı", "Vadeli satış yapılacak şirketlerin vergi borcu, protesto ve konkordato geçmişini sorgular.", "assafelovic/gpt-researcher", None, "Muhasebe & Finans", "#2563EB"),
    ("qa-test-generator", "Yazılım Test Senaryosu (QA) Üreticisi", "Ürün yöneticisinin yazdığı user story'lerden uçtan uca otomatik test senaryoları yazar.", "microsoft/playwright-mcp", None, "Yazılım & DevOps", "#2EAD33"),
    ("event-lead-classifier", "Etkinlik & Fuar Lead Sınıflandırıcısı", "Fuarda toplanan kartvizit fotoğraflarını tarayıp CRM'e aktarır ve ilgi puanı verir.", "trsdn/markitdown-mcp", None, "Satış & CRM", "#7C3AED"),
    ("regulation-tracker", "Yönetmelik & Mevzuat Değişim Takipçisi", "Resmi Gazete ve sektör regülasyonlarını tarayıp şirketi ilgilendiren maddeleri özetler.", "modelcontextprotocol/servers", "src/brave-search", "Hukuk & Uyum", "#FB542B"),
    ("return-reason-analyst", "Ürün İade Sebebi Analiz Ajanı", "E-ticaretteki iade notlarını analiz edip hatalı üretim veya yanıltıcı görsel sorunlarını bulur.", "qdrant/mcp-server-qdrant", None, "Operasyon", "#DC244C"),
    ("logistics-delay-tracker", "Konteyner & Lojistik Gecikme Takipçisi", "Deniz/kara taşımacılığındaki gemi konumlarını izleyip tedarik zinciri aksamalarını öngörür.", "modelcontextprotocol/servers", "src/fetch", "Operasyon", "#0284C7"),
    ("call-quality-auditor", "Çağrı Merkezi Kalite & Ton Denetçisi", "Temsilcilerin müşteri konuşma kayıtlarını empati, çözüm hızı ve şirket kuralına göre puanlar.", "faulkj/legion-mcp", None, "Müşteri Destek", "#8B5CF6"),
    ("review-response-writer", "Restoran/Otel Yorum Yanıtlama Ajanı", "Google Maps ve TripAdvisor yorumlarına kurumsal dille kişiselleştirilmiş yanıtlar hazırlar.", "googleapis/genai-toolbox", None, "Müşteri Destek", "#4285F4"),
    ("job-posting-optimizer", "İlan Metni & İş Tanımı Optimizatörü", "Şirket iş ilanlarındaki taraflı dili temizler ve doğru aday profilini çekecek şekilde düzenler.", "googleapis/genai-toolbox", None, "İnsan Kaynakları", "#4285F4"),
    ("secret-leak-scanner", "Gizli API Anahtarı & Sızıntı Tarayıcısı", "GitHub'a yanlışlıkla push edilen AWS/OpenAI anahtarlarını anında yakalayıp iptal eder.", "Tencent/AI-Infra-Guard", None, "Güvenlik & Uyum", "#B91C1C"),
    ("lease-contract-tracker", "Kira & Gayrimenkul Sözleşme Takipçisi", "Şirketin kiraladığı ofis/depoların TEFE-TÜFE artış ve sözleşme fesih sürelerini uyarır.", "modelcontextprotocol/servers", "src/filesystem", "Muhasebe & Finans", "#F59E0B"),
    ("microservice-rca", "Mikroservis Kesinti Kök Neden Analisti", "Çöken bir servis için dağıtık tracing kayıtlarını inceleyip ilk kopan noktayı bulur.", "elastic/mcp-server-elasticsearch", None, "Yazılım & DevOps", "#005571"),
    ("appointment-confirmation", "Tıbbi/Klinik Randevu Teyit Ajanı", "Sağlık merkezlerinde hastaları arayıp/yazıp gelmeme oranını düşüren teyitler alır.", "zapier/zapier-mcp", None, "Müşteri Destek", "#FF4A00"),
    ("winback-campaign", "Eski Müşteri Yeniden Etkinleştirici", "6 aydır alışveriş yapmayan kurumsal müşterilere geçmiş tercihlerine göre özel kampanya yazar.", "chroma-core/chroma-mcp", None, "Satış & CRM", "#FF6442"),
    ("fraud-anomaly-detector", "Finansal Anomali & Dolandırıcılık Tespiti", "Şirket hesaplarından yapılan olağandışı yüksek veya gece yarısı para çıkışlarını dondurur/uyarır.", "stripe/agent-toolkit", None, "Muhasebe & Finans", "#635BFF"),
    ("cve-matcher", "Yazılım Güvenlik Zafiyeti (CVE) Eşleştirici", "Şirketin kullandığı sunucu paketlerini ulusal güvenlik zafiyeti veritabanlarıyla kıyaslar.", "Tencent/AI-Infra-Guard", None, "Güvenlik & Uyum", "#B91C1C"),
    ("marketplace-price-sync", "Satıcı Pazar Yeri Fiyat Çakışma Ajanı", "Trendyol, Hepsiburada, Amazon fiyatları arasındaki tutarsızlıkları satıcı paneline raporlar.", "mysleekdesigns/crawlforge-mcp", None, "Operasyon", "#10B981"),
    ("training-quiz-builder", "Şirket İçi Eğitim & Quiz Üreticisi", "İç prosedür dokümanlarından çalışanlar için interaktif mini eğitim ve sınavlar çıkarır.", "MFYDev/ghost-mcp", None, "İnsan Kaynakları", "#15171A"),
    ("customs-declaration-auditor", "Gümrük Beyannamesi Hata Denetçisi", "Beyanname verileriyle fatura tutarları arasındaki matrah uyuşmazlıklarını gümrükten önce bulur.", "trsdn/markitdown-mcp", None, "Operasyon", "#7C3AED"),
    ("supplier-quote-matrix", "Tedarikçi Teklif Karşılaştırma Matrisi", "5 farklı tedarikçiden gelen PDF teklifleri tek bir Excel karşılaştırma tablosuna döker.", "trsdn/markitdown-mcp", None, "Satın Alma", "#7C3AED"),
    ("cv-screening-agent", "Aday Ön Değerlendirme & CV Eleme Ajanı", "Pozisyona başvuran adayların özgeçmişlerini doğrudan iş gereksinimleriyle puanlar.", "stickerdaniel/linkedin-mcp-server", None, "İnsan Kaynakları", "#0A66C2"),
    ("payment-reminder-agent", "Müşteri Ödeme Hatırlatma & Tahsilat Ajanı", "Vadesi geçen faturalar için müşterinin muhasebe birimine kademeli, nazik hatırlatmalar yapar.", "stripe/agent-toolkit", None, "Muhasebe & Finans", "#635BFF"),
    ("social-dm-sales", "Sosyal Medya DM Satış Temsilcisi", "Instagram/WhatsApp üzerinden gelen ürün sorularını cevaplayıp doğrudan ödeme linkine yönlendirir.", "zapier/zapier-mcp", None, "Satış & CRM", "#FF4A00"),
    ("schema-migration-tester", "Yazılım Veri Şeması (Migration) Testçisi", "Veritabanı şema güncellemelerinin üretim verisini bozup bozmayacağını simüle eder.", "modelcontextprotocol/servers", "src/postgres", "Yazılım & DevOps", "#336791"),
    ("franchise-auditor", "Franchise Şube Standart Denetçisi", "Şubelerin gönderdiği haftalık satış ve hijyen kontrol listelerini değerlendirir.", "aptro/superset-mcp", None, "Operasyon", "#20A6C9"),
    ("competitor-feature-tracker", "Rakip Ürün Değişim Takipçisi", "Rakiplerin fiyatlandırma sayfalarındaki ve özellik listelerindeki değişiklikleri yakalar.", "mysleekdesigns/crawlforge-mcp", None, "Pazarlama & Analiz", "#10B981"),
    ("contract-renewal-reminder", "B2B Sözleşme Yenileme Hatırlatıcısı", "Yıllık sözleşmelerin bitişine 60 gün kala hesap yöneticisine yenileme planı açar.", "modelcontextprotocol/servers", "src/memory", "Satış & CRM", "#7C3AED"),
    ("cross-sell-engine", "Çapraz Satış (Cross-Sell) Öneri Motoru", "Sepetinde X ürünü olan kurumsal alıcıya tamamlayıcı endüstriyel sarf malzemeleri önerir.", "chroma-core/chroma-mcp", None, "Satış & CRM", "#FF6442"),
    ("equity-vesting-tracker", "Hisse Opsiyon & Vesting Takipçisi", "Şirket çalışanlarının hisse hakediş takvimlerini sözleşme şartlarına göre hesaplar.", "modelcontextprotocol/servers", "src/filesystem", "İnsan Kaynakları", "#F59E0B"),
    ("export-certificate-checker", "İhracat Menşe Şahadetnamesi Denetçisi", "İhracat belgelerindeki ülke kuralları ve dolaşım sertifikası uyumunu kontrol eder.", "trsdn/markitdown-mcp", None, "Operasyon", "#7C3AED"),
    ("agent-coaching", "Müşteri Temsilcisi Eğitim Koçu", "Yeni temsilcinin canlı çağrısını dinleyip konuşma biter bitmez geliştirmesi gereken 2 noktayı iletir.", "faulkj/legion-mcp", None, "Müşteri Destek", "#8B5CF6"),
    ("broken-link-detector", "Web Sitesi Bozuk Link & 404 Dedektörü", "Şirket portallarındaki kırık sayfaları ve çalışmayan formları düzenli test eder.", "microsoft/playwright-mcp", None, "Pazarlama & Analiz", "#2EAD33"),
    ("fleet-fuel-auditor", "Şirket Aracı & Filo Yakıt Takipçisi", "Taşıt tanıma sistemi fişleri ile kilometre kayıtlarını kıyaslayıp yakıt suiistimalini saptar.", "ClickHouse/mcp-clickhouse", None, "Operasyon", "#FFCC00"),
    ("budget-overrun-alert", "Proje Bütçe Aşım Erken Uyarıcısı", "Harcanan adam/saat maliyetini projenin tamamlanma yüzdesiyle kıyaslayıp bütçe alarmı verir.", "dbt-labs/dbt-mcp", None, "Yönetim", "#FF694A"),
    ("unsubscribe-analyst", "E-Bülten Unsubscribe Analisti", "Bülten aboneliğinden çıkanların gerekçelerini analiz edip içerik ekibine aksiyon çıkarır.", "aptro/superset-mcp", None, "Pazarlama & Analiz", "#20A6C9"),
    ("permission-matrix-auditor", "Kullanıcı İzin & Yetki Matrisi Denetçisi", "Şirket içi araçlarda gereksiz yere Admin yetkisine sahip kullanıcıları listeler.", "Tencent/AI-Infra-Guard", None, "Güvenlik & Uyum", "#B91C1C"),
    ("bilingual-contract-aligner", "Çok Dilli Sözleşme Hizalama Ajanı", "Sözleşmenin İngilizce ve Türkçe metinleri arasında anlam ve madde kayması olup olmadığını denetler.", "trsdn/markitdown-mcp", None, "Hukuk & Uyum", "#7C3AED"),
    ("warranty-serial-verifier", "Ürün Garanti & Seri No Doğrulayıcı", "Müşterinin gönderdiği arızalı ürünün garanti süresini ve yetkili satış kanalını teyit eder.", "supabase-community/supabase-mcp", None, "Müşteri Destek", "#3FCF8E"),
    ("warehouse-picking-route", "Depo İçi Toplama (Picking) Rota Ajanı", "E-ticaret siparişleri toplanırken depo çalışanına en kısa yürüme rotasını çizer.", "redis/mcp-redis", None, "Operasyon", "#FF4438"),
    ("vat-refund-calculator", "Yurtdışı KDV / VAT İade Hesaplayıcı", "Şirket çalışanlarının yurtdışı seyahat harcamalarındaki geri alınabilir vergi kalemlerini ayıklar.", "stripe/agent-toolkit", None, "Muhasebe & Finans", "#635BFF"),
    ("user-manual-generator", "Kullanım Kılavuzu & FAQ Üretici", "Yeni bir donanım veya yazılım modülünden son kullanıcı için sorun giderme kılavuzu hazırlar.", "stippi/code-assistant", None, "Operasyon", "#374151"),
    ("ethics-hotline-classifier", "Etik Hat & İhbar Sınıflandırıcı", "Şirket iç ihbar hattına gelen suiistimal bildirimlerini gizlilikle analiz edip yönetim kuruluna iletir.", "fiddlecube/compliant-llm", None, "Hukuk & Uyum", "#1E40AF"),
    ("ad-roas-guardian", "Reklam Bütçesi RoAS Koruyucusu", "Beklenen dönüşüm oranının altına düşen Meta/Google reklam setlerini otomatik durdurur.", "zapier/zapier-mcp", None, "Pazarlama & Analiz", "#FF4A00"),
    ("intern-project-scorer", "Stajyer Başvuru & Görev Değerlendirici", "Stajyer adaylarının gönderdiği deneme projelerini temel kriterlere göre ön elemeden geçirir.", "evalstate/mcp-hfspace", None, "İnsan Kaynakları", "#FFD21E"),
    ("price-list-converter", "Katalog Fiyat Liste Dönüştürücü", "Tedarikçiden gelen karmaşık Excel tablolarını şirketin ERP formatına hatasız haritalar.", "trsdn/markitdown-mcp", None, "Satın Alma", "#7C3AED"),
    ("esign-reminder", "E-İmza Bekleyen Belge Takipçisi", "İmzaya gönderilen sözleşmelerde imzalamayan taraflara akıllı aralıklarla hatırlatma çıkarır.", "zapier/zapier-mcp", None, "Hukuk & Uyum", "#FF4A00"),
    ("rfp-answer-matcher", "Teknik RFP Soru Eşleştirici", "Banka/kamu şartnamelerindeki sorulara şirketin daha önce verdiği onaylı cevapları eşler.", "chroma-core/chroma-mcp", None, "Satış & CRM", "#FF6442"),
    ("travel-coordinator", "Şirket Etkinlik & Seyahat Koordinatörü", "Çoklu ekip seyahatlerinde uçak/otel seçeneklerini şirket harcama limitine göre optimize eder.", "zapier/zapier-mcp", None, "Operasyon", "#FF4A00"),
    ("packaging-compliance", "Ürün Barkod & Paketleme Uyum Ajanı", "Ürün etiketlerindeki yasal zorunlu uyarıların doğruluğunu denetler.", "trsdn/markitdown-mcp", None, "Operasyon", "#7C3AED"),
    ("cart-abandonment-recovery", "E-Ticaret Sepet Terk Kurtarma Ajanı", "Sepeti bırakan kullanıcıya ilgilendiği ürünün stok durumuna göre kişisel mesaj kurgular.", "chroma-core/chroma-mcp", None, "Satış & CRM", "#FF6442"),
    ("security-patch-notifier", "Açık Kaynak Güvenlik Yama Bildiricisi", "Şirketin kullandığı framework'ler için çıkan acil güvenlik yamalarını yazılım liderine bildirir.", "Tencent/AI-Infra-Guard", None, "Güvenlik & Uyum", "#B91C1C"),
    ("kyc-kyb-verifier", "Müşteri Onay (KYC/KYB) Doğrulama Ajanı", "Kaydolan kurumsal müşterilerin vergi levhası ve ticaret sicil gazetesi belgelerini kontrol eder.", "trsdn/markitdown-mcp", None, "Muhasebe & Finans", "#7C3AED"),
    ("carbon-footprint-reporter", "Çevreci Ayak İzi & Karbon Raporlayıcı", "Şirketin elektrik faturası, kargo ve seyahat verilerinden kurumsal karbon emisyon raporu çıkarır.", "dbt-labs/dbt-mcp", None, "Yönetim", "#FF694A"),
    ("backup-dr-auditor", "Yedekleme & Felaket Kurtarma Denetçisi", "Günlük veritabanı yedeklerinin geri yüklenebilirliğini simüle eder.", "modelcontextprotocol/servers", "src/postgres", "IT & Operasyon", "#336791"),
    ("healthcare-fhir-agent", "Sağlık Veri Entegrasyon Ajanı", "FHIR uyumlu klinik kayıtlara güvenli erişim ve sorgulama sağlar.", "faulkj/fhirhydrant", None, "Sektörel Çözümler", "#0EA5E9"),
    ("deep-research-analyst", "Otonom Derin Araştırma Ajanı", "Herhangi bir konuda kaynaklı derin araştırma raporu üretir.", "assafelovic/gpt-researcher", None, "Yapay Zeka", "#2563EB"),
    ("cdn-performance-agent", "CDN Performans Yönetim Ajanı", "CDN önbellek, trafik metrikleri ve alan adı yönetimi sağlar.", "BlazingCDN/blazingcdn-mcp", None, "Sunucu ve altyapı", "#FF6B00"),
]


def fetch_text(url: str) -> str:
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "blacknook-catalog/2.0"})
        with urllib.request.urlopen(req, timeout=20) as resp:
            return resp.read().decode("utf-8", errors="replace")
    except Exception:
        return ""


def license_from_text(text: str) -> str | None:
    t = text.lower()
    if "agpl" in t or ("gnu general public" in t and "library" not in t):
        return "GPL"
    if "sspl" in t:
        return "SSPL"
    if "apache license" in t and "version 2" in t:
        return "Apache-2.0"
    if "mit license" in t or "permission is hereby granted" in t:
        return "MIT"
    if "isc license" in t:
        return "ISC"
    return None


def resolve_license(owner: str, repo: str) -> str | None:
    if owner == "modelcontextprotocol" and repo == "servers":
        return "Apache-2.0"
    for branch in ("main", "master"):
        for path in ("LICENSE", "LICENSE.md", "LICENSE.txt"):
            lic = license_from_text(fetch_text(f"https://raw.githubusercontent.com/{owner}/{repo}/{branch}/{path}"))
            if lic:
                return lic
        pkg = fetch_text(f"https://raw.githubusercontent.com/{owner}/{repo}/{branch}/package.json")
        if pkg:
            try:
                data = json.loads(pkg)
                lic = str(data.get("license", "")).strip()
                if lic.upper() in ALLOWED or lic in ALLOWED:
                    return lic if lic != "ISC" else "ISC"
            except json.JSONDecodeError:
                pass
    return None


def fetch_github_description(owner: str, repo: str) -> str:
    try:
        req = urllib.request.Request(
            f"https://api.github.com/repos/{owner}/{repo}",
            headers={"User-Agent": "blacknook-catalog/2.0", "Accept": "application/vnd.github+json"},
        )
        with urllib.request.urlopen(req, timeout=20) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            return str(data.get("description") or "").strip()
    except Exception:
        return ""


def fetch_readme(owner: str, repo: str, subpath: str | None) -> str:
    branches = ("main", "master")

    if subpath:
        repos = [repo]
        if owner == "modelcontextprotocol" and repo == "servers":
            repos.append("servers-archived")
        for repo_name in repos:
            for branch in branches:
                text = fetch_text(
                    f"https://raw.githubusercontent.com/{owner}/{repo_name}/{branch}/{subpath}/README.md"
                )
                if text and len(text) > 60:
                    return text
        return ""

    for branch in branches:
        for path in ("README.md", "readme.md"):
            text = fetch_text(f"https://raw.githubusercontent.com/{owner}/{repo}/{branch}/{path}")
            if text and len(text) > 60:
                return text
    return ""


def clean_md(text: str) -> str:
    text = re.sub(r"<[^>]+>", "", text)
    text = re.sub(r"!\[[^\]]*\]\([^)]+\)", "", text)
    text = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", text)
    text = re.sub(r"`([^`]+)`", r"\1", text)
    text = re.sub(r"#+\s*", "", text)
    text = re.sub(r"\*{1,2}([^*]+)\*{1,2}", r"\1", text)
    return re.sub(r"\n{3,}", "\n\n", text).strip()


def is_bad_about(text: str) -> bool:
    if not text or len(text.strip()) < 40:
        return True
    lower = text.lower()
    bad_markers = (
        "disclaimer",
        "not affiliated",
        "registered trademark",
        "documentation",
        "🇨🇳",
        "reference implementations",
        "this repository is a collection",
        "if you are looking for a list of mcp servers",
        "typically, each mcp server is implemented",
        "website · docs",
        "quickstart · clients",
        "the .ctxfile convention",
        "quickstart",
        "give us a star",
        "user feedback survey",
        "stdio",
        "streamable http",
        "uvx",
        "docker setup",
        "installation methods",
        "pypi.org",
        "important>",
        "this is not microsoft",
        "independent community project",
    )
    if any(marker in lower for marker in bad_markers):
        return True
    if text.strip().startswith(">"):
        return True
    if re.search(r"https?://", text):
        return True
    return False


def extract_about(readme: str) -> str:
    text = clean_md(readme.replace("\r\n", "\n"))
    if not text:
        return ""
    for pat in (
        r"Overview\s*\n+([\s\S]*?)(?:\n##|\Z)",
        r"About\s*\n+([\s\S]*?)(?:\n##|\Z)",
        r"Description\s*\n+([\s\S]*?)(?:\n##|\Z)",
    ):
        m = re.search(pat, text, re.I)
        if m:
            block = m.group(1).strip()
            paras = [p.strip() for p in block.split("\n\n") if len(p.strip()) > 40 and not p.startswith("-")]
            for para in paras:
                if not is_bad_about(para):
                    return para[:900]
    paras = [p.strip() for p in text.split("\n\n") if len(p.strip()) > 50 and not p.startswith("-")]
    for para in paras:
        if not is_bad_about(para):
            return para[:900]
    return ""


def extract_features(readme: str) -> list[str]:
    features: list[str] = []
    text = readme.replace("\r\n", "\n")
    in_features = False
    skip_prefixes = ("default", "streamable", "docker", "uvx", "login", "installation", "license", "transport")
    for line in text.splitlines():
        if re.match(r"^#+\s*(features|capabilities|tools|what it does)", line, re.I):
            in_features = True
            continue
        if in_features and re.match(r"^#+\s", line):
            break
        m = re.match(r"^[-*]\s+(.+)$", line.strip())
        if m:
            item = clean_md(m.group(1)).strip()
            item = re.sub(r"^\*\*([^*]+)\*\*:?", r"\1", item)
            if 8 < len(item) < 120 and not item.lower().startswith(skip_prefixes):
                features.append(item)
    if len(features) < 3:
        for m in re.finditer(r"^\s*[-*]\s+\*\*([^*]+)\*\*\s*[-–:]\s*(.+)$", text, re.M):
            item = f"{m.group(1).strip()}: {clean_md(m.group(2)).strip()}"
            if 8 < len(item) < 120 and item not in features:
                features.append(item)
    return features[:6] if features else []


def logo_url(repo_path: str, subpath: str | None, brand_color: str) -> str:
    hex_color = brand_color.lstrip("#")
    if len(hex_color) != 6:
        hex_color = "0F766E"

    if repo_path == "modelcontextprotocol/servers" and subpath:
        slug = MCP_SUBPATH_LOGO_SLUGS.get(subpath, "modelcontextprotocol")
        return f"https://cdn.simpleicons.org/{slug}/{hex_color}"

    slug = REPO_LOGO_SLUGS.get(repo_path)
    if slug:
        return f"https://cdn.simpleicons.org/{slug}/{hex_color}"

    initials = REPO_LOGO_INITIALS.get(repo_path, repo_path.split("/")[-1][:2].upper())
    return (
        "https://ui-avatars.com/api/?name="
        + urllib.parse.quote(initials)
        + f"&background={hex_color}&color=fff&size=128&bold=true&format=png"
    )


def build_entry(agent: tuple) -> dict | None:
    aid, name, problem, repo_path, subpath, category, color = agent
    owner, repo = repo_path.split("/", 1)
    lic = resolve_license(owner, repo)
    if not lic or lic not in ALLOWED:
        print(f"SKIP {aid} license={lic}", flush=True)
        return None

    readme = fetch_readme(owner, repo, subpath)
    repo_key = repo_path
    product_info = REPO_PRODUCT_INFO.get(repo_key, {})
    factual_about = str(product_info.get("about") or "")
    if subpath and subpath in MCP_SERVER_BLURBS:
        factual_about = MCP_SERVER_BLURBS[subpath]
    if not factual_about:
        factual_about = extract_about(readme)

    features: list[str] = []
    if subpath and subpath in MCP_SERVER_FEATURES:
        features = MCP_SERVER_FEATURES[subpath]
    elif product_info.get("features"):
        features = list(product_info["features"])  # type: ignore[arg-type]
    else:
        features = extract_features(readme)

    github_desc = fetch_github_description(owner, repo)

    if not features:
        features = [
            problem.rstrip(".") if problem else "Kurumsal iş akışı otomasyonu",
            "MCP protokolü ile mevcut araçlara bağlanır",
            "Kendi altyapınızda veya bulutta çalıştırılabilir",
        ]
    else:
        features = features[:5]

    about_candidates = [problem, factual_about, github_desc]
    about = next((candidate for candidate in about_candidates if candidate and not is_bad_about(candidate)), problem)
    about = re.sub(r"NOOK Agent['\u2019]?[ıi]?(nız|niz|ınız|iniz)?\s*(üzerinden|ile)?\s*", "", about, flags=re.I)
    about = re.sub(r"\s+", " ", about).strip()

    use_cases: list[str] = []
    if problem:
        use_cases.append(problem.rstrip("."))
    for feature in features[:2]:
        if feature and feature not in use_cases and len(feature) < 120:
            use_cases.append(feature.rstrip("."))
    if factual_about and factual_about not in use_cases and len(factual_about) < 120:
        use_cases.append(factual_about.rstrip("."))
    if not use_cases:
        use_cases = [problem or name]

    repo_url = f"https://github.com/{owner}/{repo}"
    if subpath:
        repo_url += f"/tree/main/{subpath}"

    return {
        "id": aid,
        "name": name,
        "category": category,
        "description": problem,
        "about": about,
        "features": features,
        "useCases": use_cases[:3],
        "brandColor": color,
        "logoUrl": logo_url(repo_path, subpath, color),
        "license": lic,
        "repo": repo_url,
    }


def main() -> None:
    results: list[dict] = []
    with ThreadPoolExecutor(max_workers=12) as pool:
        futures = {pool.submit(build_entry, a): a[0] for a in AGENTS}
        for fut in as_completed(futures):
            entry = fut.result()
            if entry:
                results.append(entry)
                print(f"OK {entry['id']}", flush=True)

    results.sort(key=lambda x: x["name"].lower())
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(results, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {len(results)} agents to {OUT}", flush=True)


if __name__ == "__main__":
    main()
