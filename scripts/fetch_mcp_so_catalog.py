#!/usr/bin/env python3
"""Curate mcp.so AI & Agents category — commercial license filter + customer catalog."""

from __future__ import annotations

import json
import re
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "src" / "data" / "mcp-integrations.json"

ALLOWED = {"MIT", "Apache-2.0", "BSD-3-Clause", "BSD-2-Clause", "ISC"}

# mcp.so AI & Agents — github owner/repo, customer-facing seed
CANDIDATES: list[dict] = [
    {"id": "gpt-researcher", "repo": "assafelovic/gpt-researcher", "name": "Derin Araştırma Asistanı", "category": "Yapay Zeka", "brandColor": "#2563EB",
     "description": "Herhangi bir konuda otomatik derin araştırma yapan yapay zeka ajanı.",
     "about": "Derin Araştırma Asistanı, şirketinizin pazar analizi, rakip araştırması ve sektör raporları için saatler süren işi dakikalara indirir. NOOK Agent üzerinden doğal dil ile araştırma görevleri başlatılır; sonuçlar kaynaklı özetler halinde sunulur.",
     "features": ["Otomatik web araştırması", "Kaynaklı rapor üretimi", "Çoklu LLM desteği", "Özelleştirilebilir araştırma derinliği"],
     "useCases": ["Pazar ve rakip analizi", "Yatırım öncesi araştırma", "İçerik ve blog araştırması"]},
    {"id": "perplexity-ask", "repo": "ppl-ai/modelcontextprotocol", "name": "Perplexity Arama Asistanı", "category": "Yapay Zeka", "brandColor": "#20808D",
     "description": "Güncel web bilgisine dayalı araştırma ve dokümantasyon desteği.",
     "about": "Perplexity Arama Asistanı, NOOK Agent'ınıza güncel internet bilgisine erişim sağlar. Müşteri sorularına, sektör trendlerine ve teknik konulara kaynaklı yanıtlar üretir.",
     "features": ["Güncel web araması", "Kaynak gösterimli yanıtlar", "Hızlı araştırma sorguları"],
     "useCases": ["Müşteri destek araştırması", "Satış öncesi bilgi toplama", "Teknik dokümantasyon sorgulama"]},
    {"id": "linkedin-agent", "repo": "stickerdaniel/linkedin-mcp-server", "name": "LinkedIn Satış Asistanı", "category": "Satış & CRM", "brandColor": "#0A66C2",
     "description": "Profil, şirket ve iş ilanı verilerine ajan erişimi ile satış araştırması.",
     "about": "LinkedIn Satış Asistanı, B2B satış ekiplerinin hedef müşteri araştırmasını hızlandırır. Profil, şirket ve pozisyon bilgilerine NOOK Agent üzerinden erişim sağlar.",
     "features": ["Profil ve şirket araması", "İş ilanı sorgulama", "Satış araştırması otomasyonu"],
     "useCases": ["Hedef müşteri listesi oluşturma", "Satış öncesi şirket araştırması", "İK aday taraması"]},
    {"id": "web-research-scraper", "repo": "mysleekdesigns/crawlforge-mcp", "name": "Web Araştırma Asistanı", "category": "Otomasyon & İş Akışı", "brandColor": "#10B981",
     "description": "Web sitelerinden otomatik veri toplama ve yapılandırılmış raporlama.",
     "about": "Web Araştırma Asistanı, rakip fiyatları, sektör haberleri ve pazar verilerini otomatik toplar. Sonuçlar temiz metin ve JSON formatında NOOK Agent'a aktarılır.",
     "features": ["Web sayfası okuma", "Site haritalama", "Yapılandırılmış veri çıkarma", "Toplu tarama"],
     "useCases": ["Rakip fiyat takibi", "Pazar araştırması", "İçerik izleme"]},
    {"id": "cdn-management", "repo": "BlazingCDN/blazingcdn-mcp", "name": "CDN Yönetim Asistanı", "category": "Sunucu ve altyapı", "brandColor": "#FF6B00",
     "description": "Web sitenizin hız, önbellek ve medya dağıtımını yönetin.",
     "about": "CDN Yönetim Asistanı, içerik dağıtım ağınızdaki önbellek, trafik ve alan adı ayarlarını NOOK Agent ile yönetmenizi sağlar.",
     "features": ["Önbellek temizleme", "Trafik metrikleri", "Alan adı yönetimi", "Video CDN kontrolü"],
     "useCases": ["Yeni içerik yayını", "Trafik spike yönetimi", "Performans optimizasyonu"]},
    {"id": "healthcare-fhir", "repo": "faulkj/fhirhydrant", "name": "Sağlık Veri Asistanı", "category": "Sektörel Çözümler", "brandColor": "#0EA5E9",
     "description": "FHIR uyumlu sağlık verilerine güvenli ajan erişimi.",
     "about": "Sağlık Veri Asistanı, sağlık sektöründeki kurumlar için FHIR standardında hasta ve klinik verilere kontrollü erişim sağlar.",
     "features": ["FHIR kayıt sorgulama", "Terminoloji araması", "Denetim izi", "Güvenli sayfalama"],
     "useCases": ["Klinik veri sorgulama", "Hasta kayıt araştırması", "Sağlık raporlama"]},
    {"id": "llm-council", "repo": "faulkj/legion-mcp", "name": "Çoklu Model Değerlendirme", "category": "Yapay Zeka", "brandColor": "#8B5CF6",
     "description": "Birden fazla yapay zeka modelinin birlikte karar vermesini sağlayan konsey sistemi.",
     "about": "Çoklu Model Değerlendirme, kritik iş kararlarında birden fazla AI modelinin tartışarak sonuç üretmesini sağlar. Strateji, risk analizi ve içerik değerlendirmesi için idealdir.",
     "features": ["Çoklu model tartışması", "Oylama ve konsensüs", "Kör panel değerlendirmesi", "Özelleştirilebilir konsey"],
     "useCases": ["Strateji değerlendirmesi", "İçerik kalite kontrolü", "Risk analizi"]},
    {"id": "ghost-cms", "repo": "MFYDev/ghost-mcp", "name": "Ghost Yayın Asistanı", "category": "İçerik yönetimi", "brandColor": "#15171A",
     "description": "Blog ve bülten içeriklerinizi ajan ile yönetin.",
     "about": "Ghost Yayın Asistanı, NOOK Agent'ınızın Ghost CMS üzerinde yazı oluşturmasını, düzenlemesini ve yayınlamasını sağlar.",
     "features": ["Yazı oluşturma ve düzenleme", "Taslak yönetimi", "Etiket ve kategori", "Yayın planlama"],
     "useCases": ["Kurumsal blog yönetimi", "Bülten içerik üretimi", "SEO içerik güncelleme"]},
    {"id": "gemini-assistant", "repo": "aliargun/gemini-mcp-server", "name": "Gemini AI Asistanı", "category": "Yapay Zeka", "brandColor": "#4285F4",
     "description": "Google Gemini modellerine NOOK Agent üzerinden erişim.",
     "about": "Gemini AI Asistanı, Google'ın gelişmiş dil modellerini NOOK ekosistemine bağlar. Uzun doküman analizi, çok dilli içerik ve görsel anlama görevleri için kullanılır.",
     "features": ["Gemini Pro erişimi", "Uzun bağlam analizi", "Çok dilli destek", "Görsel anlama"],
     "useCases": ["Doküman özetleme", "Çok dilli müşteri iletişimi", "Görsel içerik analizi"]},
    {"id": "openapi-bridge", "repo": "janwilmake/openapi-mcp-server", "name": "API Bağlantı Asistanı", "category": "Veri & Entegrasyon", "brandColor": "#6366F1",
     "description": "Mevcut API dokümantasyonunuzu ajan arayüzüne dönüştürün.",
     "about": "API Bağlantı Asistanı, OpenAPI spesifikasyonlarınızı NOOK Agent'ın kullanabileceği araçlara çevirir. Yeni entegrasyon yazmadan mevcut sistemlerinize bağlanın.",
     "features": ["OpenAPI otomatik dönüşüm", "REST API çağrıları", "Dinamik araç keşfi"],
     "useCases": ["Legacy sistem entegrasyonu", "Hızlı API prototipleme", "İç sistem otomasyonu"]},
    {"id": "superset-bi", "repo": "aptro/superset-mcp", "name": "Superset BI Asistanı", "category": "BI & Görselleştirme", "brandColor": "#20A6C9",
     "description": "50+ veri kaynağına bağlı iş zekası panolarına ajan erişimi.",
     "about": "Superset BI Asistanı, Apache Superset üzerindeki panolarınıza ve sorgularınıza NOOK Agent ile erişim sağlar. Doğal dil ile rapor ve metrik sorgulama imkânı sunar.",
     "features": ["Dashboard sorgulama", "50+ veri kaynağı", "SQL ve görsel sorgu", "Zamanlanmış raporlar"],
     "useCases": ["Yönetici KPI sorguları", "Satış performans analizi", "Operasyonel raporlama"]},
    {"id": "langchain-tools", "repo": "rectalogic/langchain-mcp", "name": "LangChain Araç Köprüsü", "category": "Yapay Zeka", "brandColor": "#1C3C3C",
     "description": "LangChain tabanlı ajanlarınıza MCP araç desteği ekleyin.",
     "about": "LangChain Araç Köprüsü, mevcut LangChain ajan altyapınızı NOOK ekosistemindeki araçlarla genişletir. Kurumsal AI projelerinde hızlı entegrasyon sağlar.",
     "features": ["LangChain uyumluluğu", "MCP araç bağlama", "Çoklu araç orkestrasyonu"],
     "useCases": ["Kurumsal AI ajan geliştirme", "Araç ekosistemi genişletme"]},
    {"id": "server-panel", "repo": "1Panel-dev/1Panel", "name": "Sunucu Yönetim Paneli", "category": "Sunucu ve altyapı", "brandColor": "#0052D9",
     "description": "VPS ve sunucu yığınınızı tek panelden yönetin.",
     "about": "Sunucu Yönetim Paneli, NOOK Agent'ınıza sunucu durumu, container'lar ve AI model dağıtımı yönetimi sağlar. IT ekipleri için merkezi kontrol noktasıdır.",
     "features": ["Sunucu durumu izleme", "Container yönetimi", "AI model dağıtımı", "Web tabanlı panel"],
     "useCases": ["IT altyapı yönetimi", "Self-host AI model dağıtımı", "Sunucu bakım otomasyonu"]},
    {"id": "competitor-tracker", "repo": "Competitor-Tracker-Co/competitor-tracker-mcp", "name": "Rakip İzleme Asistanı", "category": "Pazarlama ve analiz", "brandColor": "#EF4444",
     "description": "Rakiplerinizin web sitelerindeki değişiklikleri otomatik takip edin.",
     "about": "Rakip İzleme Asistanı, rakip sitelerindeki fiyat, ürün ve mesajlaşma değişikliklerini haftalık tarar ve önemli güncellemeleri raporlar.",
     "features": ["Otomatik site tarama", "Değişiklik algılama", "Etiketli raporlama", "Haftalık özet"],
     "useCases": ["Rakip fiyat takibi", "Pazarlama mesajı analizi", "Ürün lansmanı izleme"]},
    {"id": "nero-image", "repo": "nero-com/nero-ai-mcp", "name": "Görsel İşleme Asistanı", "category": "Pazarlama ve analiz", "brandColor": "#7C3AED",
     "description": "AI destekli görsel iyileştirme, arka plan kaldırma ve restorasyon.",
     "about": "Görsel İşleme Asistanı, pazarlama ve e-ticaret ekiplerinin ürün görsellerini otomatik iyileştirmesini, arka plan temizlemesini ve renklendirmesini sağlar.",
     "features": ["Görsel kalite artırma", "Arka plan kaldırma", "Fotoğraf restorasyonu", "Toplu işleme"],
     "useCases": ["E-ticaret ürün görselleri", "Pazarlama materyali hazırlama", "Arşiv fotoğraf restorasyonu"]},
    {"id": "mcp-agent-framework", "repo": "lastmile-ai/mcp-agent", "name": "Ajan Geliştirme Çerçevesi", "category": "Yapay Zeka", "brandColor": "#059669",
     "description": "Kurumsal AI ajanları oluşturmak için hazır iş akışı kalıpları.",
     "about": "Ajan Geliştirme Çerçevesi, şirketinizin özel AI ajanlarını hızlıca oluşturmasını sağlayan Model Context Protocol tabanlı bir altyapı sunar.",
     "features": ["Hazır ajan kalıpları", "MCP entegrasyonu", "İş akışı orkestrasyonu", "Ölçeklenebilir mimari"],
     "useCases": ["Özel departman ajanları", "İş süreci otomasyonu", "AI pilot projeleri"]},
    {"id": "sequential-thinking", "repo": "FradSer/mcp-server-sequential-thinking", "name": "Stratejik Düşünme Asistanı", "category": "Yapay Zeka", "brandColor": "#A855F7",
     "description": "Karmaşık iş problemlerini adım adım çözen çoklu ajan sistemi.",
     "about": "Stratejik Düşünme Asistanı, zorlu iş kararlarını yapılandırılmış düşünme adımlarıyla analiz eder. Birden fazla AI ajanı sıralı ve paralel çalışarak kapsamlı sonuç üretir.",
     "features": ["Adım adım analiz", "Çoklu ajan işbirliği", "Yapılandırılmış çıktı", "Karar desteği"],
     "useCases": ["Stratejik planlama", "Kök neden analizi", "Proje değerlendirmesi"]},
    {"id": "compliant-ai", "repo": "fiddlecube/compliant-llm", "name": "Uyumlu AI Platformu", "category": "Güvenlik & Uyum", "brandColor": "#1E40AF",
     "description": "Güvenli ve düzenlemelere uyumlu AI ajan altyapısı.",
     "about": "Uyumlu AI Platformu, KVKK ve kurumsal güvenlik gereksinimlerini karşılayan AI ajan ve MCP sunucu altyapısı sunar. Hassas verilerle çalışan şirketler için tasarlanmıştır.",
     "features": ["Veri gizliliği kontrolleri", "Denetim izi", "Politika tabanlı erişim", "Uyum raporlama"],
     "useCases": ["Finans sektörü AI", "Sağlık verisi işleme", "Kurumsal güvenlik gereksinimleri"]},
    {"id": "multi-agent-canvas", "repo": "CopilotKit/open-multi-agent-canvas", "name": "Çoklu Ajan Panosu", "category": "Yapay Zeka", "brandColor": "#7C3AED",
     "description": "Birden fazla AI ajanını tek sohbette yönetin ve koordine edin.",
     "about": "Çoklu Ajan Panosu, farklı uzmanlık alanlarındaki AI ajanlarını tek bir arayüzde bir araya getirir. Araştırma, analiz ve üretim görevlerini paralel yürütür.",
     "features": ["Çoklu ajan sohbeti", "Dinamik görev dağıtımı", "MCP sunucu entegrasyonu", "Derin araştırma modu"],
     "useCases": ["Araştırma ekipleri", "Ürün geliştirme", "Çapraz departman projeleri"]},
    {"id": "code-assistant", "repo": "stippi/code-assistant", "name": "Kod Asistanı", "category": "Yazılım geliştirme", "brandColor": "#374151",
     "description": "Otonom kod yazma ve teknik görev otomasyonu.",
     "about": "Kod Asistanı, yazılım ekiplerinin rutin geliştirme görevlerini otomatikleştirmesini sağlar. Kod inceleme, refactoring ve test yazma işlemlerini NOOK Agent üzerinden yönetir.",
     "features": ["Otonom kod üretimi", "Kod inceleme", "Test otomasyonu", "MCP ve ACP modu"],
     "useCases": ["Teknik borç azaltma", "Hızlı bug fix", "Dahili araç geliştirme"]},
    {"id": "servicenow-bridge", "repo": "jxrlabs/pdi-bridge-mcp", "name": "ServiceNow Asistanı", "category": "IT & Operasyon", "brandColor": "#62D84E",
     "description": "ServiceNow kayıtlarına ve iş kurallarına ajan erişimi.",
     "about": "ServiceNow Asistanı, IT ekiplerinin ticket, iş kuralı ve ACL bilgilerine NOOK Agent üzerinden sorgulama yapmasını sağlar. Canlı instance üzerinde güvenli troubleshooting sunar.",
     "features": ["Kayıt sorgulama", "İş kuralı inceleme", "ACL analizi", "Canlı instance bağlantısı"],
     "useCases": ["IT destek otomasyonu", "Ticket triage", "Sistem troubleshooting"]},
    {"id": "hostinger-manager", "repo": "hostinger/api-mcp-server", "name": "Hostinger Hosting Asistanı", "category": "Sunucu ve altyapı", "brandColor": "#673DE6",
     "description": "Hosting altyapınızı ajan ile yönetin.",
     "about": "Hostinger Hosting Asistanı, web hosting, domain ve sunucu kaynaklarınızı NOOK Agent üzerinden yönetmenizi sağlar.",
     "features": ["Domain yönetimi", "Hosting durumu", "Kaynak izleme", "OAuth güvenli bağlantı"],
     "useCases": ["Web altyapı yönetimi", "Domain operasyonları", "Hosting optimizasyonu"]},
    {"id": "image-enhance-api", "repo": "nero-com/mcp-server-nero", "name": "Nero Görsel API", "category": "Pazarlama ve analiz", "brandColor": "#9333EA",
     "description": "Kurumsal görsel işleme API'sine ajan erişimi.",
     "about": "Nero Görsel API, yüksek hacimli görsel işleme ihtiyaçlarını API üzerinden NOOK Agent'a bağlar.",
     "features": ["API tabanlı işleme", "Toplu görsel iyileştirme", "Sıkıştırma ve optimizasyon"],
     "useCases": ["E-ticaret katalog yönetimi", "Dijital varlık optimizasyonu"]},
    {"id": "web-agent-protocol", "repo": "OTA-Tech-AI/web-agent-protocol", "name": "Web Otomasyon Protokolü", "category": "Otomasyon & İş Akışı", "brandColor": "#0D9488",
     "description": "Tarayıcı etkileşimlerini kaydedin ve tekrar oynatın.",
     "about": "Web Otomasyon Protokolü, kullanıcıların web üzerindeki işlemlerini kaydederek AI ajanlarının aynı adımları otomatik tekrarlamasını sağlar.",
     "features": ["Etkileşim kaydı", "Tekrar oynatma", "MCP entegrasyonu", "Otomasyon şablonları"],
     "useCases": ["Web test otomasyonu", "Tekrarlayan form doldurma", "Süreç dokümantasyonu"]},
    {"id": "mcp-aggregator", "repo": "1mcp-app/agent", "name": "Birleşik MCP Geçidi", "category": "Yapay Zeka", "brandColor": "#4F46E5",
     "description": "Birden fazla MCP sunucusunu tek noktadan yönetin.",
     "about": "Birleşik MCP Geçidi, şirketinizin tüm MCP entegrasyonlarını tek bir sunucuda toplar. IT ekipleri için basitleştirilmiş yönetim ve dağıtım sağlar.",
     "features": ["Çoklu sunucu birleştirme", "Merkezi yapılandırma", "Tek bağlantı noktası"],
     "useCases": ["Kurumsal MCP yönetimi", "Ajan altyapısı sadeleştirme"]},
    {"id": "dify-agent", "repo": "junjiem/dify-mcp-sse", "name": "Dify Ajan Platformu", "category": "Yapay Zeka", "brandColor": "#1D4ED8",
     "description": "Dify tabanlı ajan stratejilerine MCP araç desteği.",
     "about": "Dify Ajan Platformu, Dify üzerinde oluşturduğunuz AI ajanlarına NOOK ekosistemindeki araçları bağlar.",
     "features": ["Dify entegrasyonu", "MCP araç desteği", "SSE bağlantı", "Ajan stratejileri"],
     "useCases": ["Kurumsal chatbot genişletme", "Ajan yetenek artırma"]},
    {"id": "huggingface-spaces", "repo": "evalstate/mcp-hfspace", "name": "HuggingFace Model Asistanı", "category": "Yapay Zeka", "brandColor": "#FFD21E",
     "description": "HuggingFace modellerine ve space'lere ajan erişimi.",
     "about": "HuggingFace Model Asistanı, açık kaynak AI modellerine ve HuggingFace Spaces'e NOOK Agent üzerinden erişim sağlar.",
     "features": ["Model keşfi", "Space çalıştırma", "Kolay yapılandırma"],
     "useCases": ["Model deneme ve seçimi", "Özel AI yetenek ekleme"]},
    {"id": "intervals-fitness", "repo": "mvilanova/intervals-mcp", "name": "Intervals.icu Asistanı", "category": "İnsan Kaynakları", "brandColor": "#F59E0B",
     "description": "Spor ve wellness verilerine ajan erişimi.",
     "about": "Intervals.icu Asistanı, kurumsal wellness programları için antrenman ve sağlık verilerine kontrollü erişim sağlar.",
     "features": ["Antrenman verisi sorgulama", "API entegrasyonu", "Claude ve ChatGPT uyumu"],
     "useCases": ["Kurumsal wellness takibi", "Spor programı analizi"]},
    {"id": "home-assistant", "repo": "tevonsb/homeassistant-mcp", "name": "Akıllı Ofis Asistanı", "category": "Operasyon", "brandColor": "#41BDF5",
     "description": "Akıllı bina ve ofis otomasyonuna ajan kontrolü.",
     "about": "Akıllı Ofis Asistanı, Home Assistant üzerinden ofis aydınlatma, iklim ve cihaz yönetimini NOOK Agent ile kontrol etmenizi sağlar.",
     "features": ["Cihaz kontrolü", "Sensör verisi", "Otomasyon senaryoları", "Enerji izleme"],
     "useCases": ["Akıllı ofis yönetimi", "Enerji tasarrufu", "Toplantı odası otomasyonu"]},
    {"id": "custom-prompts", "repo": "minipuft/claude-custom-prompts-mcp", "name": "Prompt Şablon Yöneticisi", "category": "Yapay Zeka", "brandColor": "#D97706",
     "description": "Kurumsal prompt şablonlarını merkezi yönetin.",
     "about": "Prompt Şablon Yöneticisi, şirketinizin standart AI prompt kalıplarını tek yerden yönetir. Kalite kontrol ve düşünme çerçeveleri içerir.",
     "features": ["Şablon kütüphanesi", "Canlı yenileme", "Kalite kontrol kapıları", "Düşünme çerçeveleri"],
     "useCases": ["Standart iş promptları", "Kalite güvence", "Ekip eğitimi"]},
    {"id": "content-author-mcp", "repo": "adrianco/meGPT", "name": "İçerik Arşiv Asistanı", "category": "İçerik yönetimi", "brandColor": "#78716C",
     "description": "Yazar ve uzman içeriklerini AI modeline yükleyin.",
     "about": "İçerik Arşiv Asistanı, şirketinizin uzman içeriklerini, dokümanlarını ve bilgi birikimini AI modeline aktararak kişiselleştirilmiş yanıtlar üretir.",
     "features": ["İçerik indeksleme", "Yazar profili oluşturma", "Bağlamsal yanıt"],
     "useCases": ["Kurumsal bilgi tabanı", "Uzman danışmanlık simülasyonu", "İçerik kişiselleştirme"]},
    {"id": "agent-commerce", "repo": "seancrecord/scvd.store", "name": "Ticari İşlem Gözlemcisi", "category": "Satış & CRM", "brandColor": "#DC2626",
     "description": "Ajan tabanlı ticari işlemlerin bağımsız doğrulaması.",
     "about": "Ticari İşlem Gözlemcisi, AI ajanlarının gerçekleştirdiği ticari işlemleri bağımsız olarak izler ve doğrular. Ödeme ve teslimat süreçlerinde güven sağlar.",
     "features": ["İşlem doğrulama", "Bağımsız gözlem", "Denetim kaydı"],
     "useCases": ["Ajan ticaret güvenliği", "Ödeme doğrulama", "Compliance izleme"]},
    {"id": "agent-offers", "repo": "AON-Network/aon-mcp", "name": "Ürün Teklif Ağı", "category": "Satış & CRM", "brandColor": "#16A34A",
     "description": "AI ajanları için gerçek zamanlı ürün ve hizmet teklifleri.",
     "about": "Ürün Teklif Ağı, AI ajanlarının gerçek ürün ve hizmet tekliflerine canlı fiyat ve takip linkleriyle erişmesini sağlar.",
     "features": ["Canlı fiyatlandırma", "Takip edilebilir linkler", "Gerçek ürün kataloğu"],
     "useCases": ["Ajan destekli satış", "Dinamik fiyat teklifi", "E-ticaret entegrasyonu"]},
    {"id": "getintel-research", "repo": "tarang8811/getintel-mcp", "name": "GetIntel Araştırma", "category": "Yapay Zeka", "brandColor": "#0891B2",
     "description": "Kurumsal istihbarat ve araştırma verilerine ajan erişimi.",
     "about": "GetIntel Araştırma, iş zekası ve pazar araştırma verilerine NOOK Agent üzerinden yapılandırılmış erişim sağlar.",
     "features": ["İstihbarat sorgulama", "Yapılandırılmış veri", "API entegrasyonu"],
     "useCases": ["Pazar istihbaratı", "Yatırım araştırması", "Risk değerlendirmesi"]},
    {"id": "ai-security-guard", "repo": "Tencent/AI-Infra-Guard", "name": "AI Güvenlik Tarayıcısı", "category": "Güvenlik & Uyum", "brandColor": "#B91C1C",
     "description": "AI altyapınızı güvenlik açıklarına karşı tarayın.",
     "about": "AI Güvenlik Tarayıcısı, MCP sunucuları, AI ajanları ve LLM altyapınızı güvenlik açıkları ve jailbreak saldırılarına karşı test eder.",
     "features": ["MCP güvenlik taraması", "Ajan güvenlik analizi", "LLM jailbreak testi", "Altyapı denetimi"],
     "useCases": ["AI güvenlik denetimi", "Uyum kontrolü", "Penetrasyon testi"]},
    {"id": "just-prompt", "repo": "disler/just-prompt", "name": "Çoklu Model Geçidi", "category": "Yapay Zeka", "brandColor": "#6B7280",
     "description": "OpenAI, Anthropic, Gemini ve diğer modellere tek arayüz.",
     "about": "Çoklu Model Geçidi, farklı AI sağlayıcılarını tek bir MCP sunucusu üzerinden NOOK Agent'a bağlar. Model değiştirme ve karşılaştırma kolaylaşır.",
     "features": ["Çoklu sağlayıcı desteği", "Birleşik arayüz", "Model karşılaştırma", "Maliyet optimizasyonu"],
     "useCases": ["Model seçimi", "Maliyet yönetimi", "Sağlayıcı bağımsızlığı"]},
    {"id": "llm-gateway", "repo": "Dicklesworthstone/llm_gateway_mcp", "name": "LLM Geçit Asistanı", "category": "Yapay Zeka", "brandColor": "#1F2937",
     "description": "Çoklu LLM, tarayıcı otomasyonu ve belge işleme yetenekleri.",
     "about": "LLM Geçit Asistanı, AI ajanlarına geniş yetenek seti sunar: çoklu model delegasyonu, tarayıcı otomasyonu, belge işleme ve vektör operasyonları.",
     "features": ["Çoklu LLM delegasyonu", "Tarayıcı otomasyonu", "Belge işleme", "Bilişsel hafıza"],
     "useCases": ["Kurumsal AI platformu", "Çok yetenekli ajanlar", "Operasyon otomasyonu"]},
    {"id": "postgres-assistant", "repo": "modelcontextprotocol/servers", "subpath": "src/postgres", "name": "PostgreSQL Asistanı", "category": "Veri & Entegrasyon", "brandColor": "#336791",
     "description": "Şirket veritabanınıza güvenli ajan erişimi.",
     "about": "PostgreSQL Asistanı, NOOK Agent'ınızın veritabanınızdaki tabloları okumasını, sorgu çalıştırmasını ve rapor üretmesini sağlar.",
     "features": ["Tablo listeleme ve sorgulama", "Doğal dil ile SQL", "Kontrollü erişim", "Kendi sunucunuzda"],
     "useCases": ["Satış raporları", "Stok sorgulama", "Yönetici özetleri"]},
    {"id": "slack-assistant", "repo": "modelcontextprotocol/servers", "subpath": "src/slack", "name": "Slack İletişim Asistanı", "category": "İletişim & Destek", "brandColor": "#4A154B",
     "description": "Slack kanallarınıza ajan erişimi ile ekip iletişimi.",
     "about": "Slack İletişim Asistanı, NOOK Agent'ınızın Slack üzerinden mesaj göndermesini, kanal bilgilerini okumasını ve ekip koordinasyonunu otomatikleştirmesini sağlar.",
     "features": ["Mesaj gönderme", "Kanal yönetimi", "Bildirim otomasyonu"],
     "useCases": ["Otomatik ekip bildirimleri", "Destek eskalasyonu", "Günlük özet paylaşımı"]},
    {"id": "github-assistant", "repo": "modelcontextprotocol/servers", "subpath": "src/github", "name": "GitHub Geliştirme Asistanı", "category": "Yazılım geliştirme", "brandColor": "#24292F",
     "description": "Kod depolarınıza ve issue'lara ajan erişimi.",
     "about": "GitHub Geliştirme Asistanı, yazılım ekiplerinin repo, issue ve pull request işlemlerini NOOK Agent ile yönetmesini sağlar.",
     "features": ["Repo sorgulama", "Issue yönetimi", "PR inceleme", "Kod arama"],
     "useCases": ["Sprint planlama", "Bug triage", "Kod inceleme otomasyonu"]},
    {"id": "filesystem-assistant", "repo": "modelcontextprotocol/servers", "subpath": "src/filesystem", "name": "Dosya Yönetim Asistanı", "category": "Otomasyon & İş Akışı", "brandColor": "#F59E0B",
     "description": "Belirlenen klasörlerdeki dosyalara kontrollü ajan erişimi.",
     "about": "Dosya Yönetim Asistanı, şirket belgelerine, raporlara ve arşivlere NOOK Agent üzerinden güvenli erişim sağlar.",
     "features": ["Dosya okuma ve arama", "Klasör listeleme", "Kontrollü yazma"],
     "useCases": ["Belge arşivi tarama", "Rapor düzenleme", "Sözleşme yönetimi"]},
    {"id": "web-fetch-assistant", "repo": "modelcontextprotocol/servers", "subpath": "src/fetch", "name": "Web Okuma Asistanı", "category": "Otomasyon & İş Akışı", "brandColor": "#0284C7",
     "description": "Web sayfalarını okuyup özetleyen ajan aracı.",
     "about": "Web Okuma Asistanı, NOOK Agent'ınızın herhangi bir web sayfasını okuyup içeriğini analiz etmesini sağlar.",
     "features": ["URL içerik okuma", "HTML'den metin çıkarma", "Sayfa özetleme"],
     "useCases": ["Haber ve blog takibi", "Rakip sitesi analizi", "Araştırma desteği"]},
    {"id": "brave-search-assistant", "repo": "modelcontextprotocol/servers", "subpath": "src/brave-search", "name": "Brave Arama Asistanı", "category": "Yapay Zeka", "brandColor": "#FB542B",
     "description": "Gizlilik odaklı web araması ile güncel bilgi erişimi.",
     "about": "Brave Arama Asistanı, gizliliğe saygılı web araması ile NOOK Agent'ınıza güncel bilgi erişimi sağlar.",
     "features": ["Gizlilik odaklı arama", "Güncel sonuçlar", "Hızlı sorgulama"],
     "useCases": ["Pazar araştırması", "Haber takibi", "Teknik araştırma"]},
    {"id": "memory-assistant", "repo": "modelcontextprotocol/servers", "subpath": "src/memory", "name": "Bilgi Hafıza Asistanı", "category": "Yapay Zeka", "brandColor": "#7C3AED",
     "description": "Ajanınızın öğrendiklerini kalıcı olarak hatırlamasını sağlar.",
     "about": "Bilgi Hafıza Asistanı, NOOK Agent'ınızın geçmiş konuşmalardan ve iş bağlamından öğrendiklerini kalıcı bilgi grafiğinde saklar.",
     "features": ["Kalıcı hafıza", "Bilgi grafiği", "Bağlamsal hatırlama", "Öğrenme birikimi"],
     "useCases": ["Müşteri geçmişi hatırlama", "Proje bağlamı koruma", "Uzun süreli ajan hafızası"]},
    {"id": "puppeteer-assistant", "repo": "modelcontextprotocol/servers", "subpath": "src/puppeteer", "name": "Tarayıcı Otomasyon Asistanı", "category": "Otomasyon & İş Akışı", "brandColor": "#40B5A4",
     "description": "Web tarayıcısını programatik olarak kontrol eden ajan.",
     "about": "Tarayıcı Otomasyon Asistanı, web formlarını doldurma, ekran görüntüsü alma ve web uygulamalarını test etme işlemlerini otomatikleştirir.",
     "features": ["Sayfa navigasyonu", "Form doldurma", "Ekran görüntüsü", "Element etkileşimi"],
     "useCases": ["Web test otomasyonu", "Form işleme", "Görsel raporlama"]},
    {"id": "gdrive-assistant", "repo": "modelcontextprotocol/servers", "subpath": "src/gdrive", "name": "Google Drive Asistanı", "category": "Veri & Entegrasyon", "brandColor": "#4285F4",
     "description": "Google Drive dosyalarınıza ajan erişimi.",
     "about": "Google Drive Asistanı, ekip dosyalarınıza, paylaşılan dokümanlara ve tablolara NOOK Agent üzerinden erişim sağlar.",
     "features": ["Dosya listeleme", "Doküman okuma", "Arama", "Kontrollü paylaşım"],
     "useCases": ["Doküman arama", "Rapor toplama", "Ekip dosya yönetimi"]},
    {"id": "gitlab-assistant", "repo": "modelcontextprotocol/servers", "subpath": "src/gitlab", "name": "GitLab Geliştirme Asistanı", "category": "Yazılım geliştirme", "brandColor": "#FC6D26",
     "description": "GitLab projelerinize ve CI/CD süreçlerinize ajan erişimi.",
     "about": "GitLab Geliştirme Asistanı, yazılım ekiplerinin proje, merge request ve pipeline işlemlerini NOOK Agent ile yönetmesini sağlar.",
     "features": ["Proje sorgulama", "MR yönetimi", "Pipeline izleme", "Issue takibi"],
     "useCases": ["CI/CD otomasyonu", "Kod inceleme", "Sprint yönetimi"]},
    {"id": "sqlite-assistant", "repo": "modelcontextprotocol/servers", "subpath": "src/sqlite", "name": "SQLite Asistanı", "category": "Veri & Entegrasyon", "brandColor": "#003B57",
     "description": "Yerel ve hafif veritabanlarına ajan erişimi.",
     "about": "SQLite Asistanı, yerel veri setlerine ve dosya tabanlı veritabanlarına NOOK Agent üzerinden sorgulama imkânı sunar.",
     "features": ["Yerel DB sorgulama", "Hızlı erişim", "Dosya tabanlı veri"],
     "useCases": ["Yerel raporlama", "Saha veri senkronu", "Prototip geliştirme"]},
    {"id": "patent-search", "repo": "patsnap/patent-literature-search-mcp", "name": "Patent Araştırma Asistanı", "category": "Sektörel Çözümler", "brandColor": "#005587",
     "description": "Global patent ve bilimsel literatür araması.",
     "about": "Patent Araştırma Asistanı, WIPO, EPO, USPTO ve diğer otoritelerden patent araması yapar. Ar-Ge ve hukuk ekipleri için idealdir.",
     "features": ["Global patent araması", "Bilimsel literatür", "Doğal dil sorgusu", "Semantik arama"],
     "useCases": ["Patent araştırması", "Fikri mülkiyet analizi", "Ar-Ge öncesi tarama"]},
    {"id": "context-snapshot", "repo": "ctxfile/ctxfile", "name": "Proje Bağlam Asistanı", "category": "Yazılım geliştirme", "brandColor": "#14B8A6",
     "description": "Proje durumunuzu tek bir bağlam nesnesinde özetler.",
     "about": "Proje Bağlam Asistanı, yazılım projelerinizin güncel durumunu (dosyalar, bağımlılıklar, yapılandırma) tek bir snapshot'ta toplar ve AI ajanına aktarır.",
     "features": ["Proje snapshot", "Bağlam birleştirme", "Gizlilik odaklı", "Yerel çalışma"],
     "useCases": ["Kod tabanı onboarding", "Proje durumu raporu", "Ajan bağlam hazırlama"]},
    {"id": "clickhouse-analytics", "repo": "ClickHouse/mcp-clickhouse", "name": "ClickHouse Analitik Asistanı", "category": "Veri & Entegrasyon", "brandColor": "#FFCC00",
     "description": "Yüksek performanslı analitik veritabanına ajan erişimi.",
     "about": "ClickHouse Analitik Asistanı, büyük veri analitiği ve gerçek zamanlı raporlama için ClickHouse veritabanınıza NOOK Agent erişimi sağlar.",
     "features": ["Analitik sorgular", "Gerçek zamanlı veri", "Yüksek performans", "Büyük veri desteği"],
     "useCases": ["Log analizi", "Gerçek zamanlı dashboard", "Büyük veri raporlama"]},
    {"id": "redis-cache", "repo": "redis/mcp-redis", "name": "Redis Önbellek Asistanı", "category": "Veri & Entegrasyon", "brandColor": "#FF4438",
     "description": "Bellek içi veri ve önbellek yönetimine ajan erişimi.",
     "about": "Redis Önbellek Asistanı, uygulama önbelleği, oturum verisi ve gerçek zamanlı sayaçlara NOOK Agent üzerinden erişim sağlar.",
     "features": ["Önbellek sorgulama", "Oturum yönetimi", "Pub/Sub mesajlaşma", "Gerçek zamanlı veri"],
     "useCases": ["Performans izleme", "Oturum analizi", "Gerçek zamanlı metrikler"]},
    {"id": "supabase-backend", "repo": "supabase-community/supabase-mcp", "name": "Supabase Backend Asistanı", "category": "Backend & BaaS", "brandColor": "#3FCF8E",
     "description": "Veritabanı, auth ve fonksiyonlara ajan erişimi.",
     "about": "Supabase Backend Asistanı, PostgreSQL veritabanı, kimlik doğrulama ve edge fonksiyonlarınıza NOOK Agent üzerinden erişim sağlar.",
     "features": ["Veritabanı sorgulama", "Auth yönetimi", "Edge fonksiyonlar", "Gerçek zamanlı veri"],
     "useCases": ["Backend veri sorgulama", "Kullanıcı yönetimi", "API otomasyonu"]},
    {"id": "cloudflare-edge", "repo": "cloudflare/mcp-server-cloudflare", "name": "Cloudflare Edge Asistanı", "category": "Sunucu ve altyapı", "brandColor": "#F38020",
     "description": "DNS, güvenlik ve edge worker yönetimine ajan erişimi.",
     "about": "Cloudflare Edge Asistanı, DNS kayıtları, WAF kuralları ve Worker'larınızı NOOK Agent ile yönetmenizi sağlar.",
     "features": ["DNS yönetimi", "Güvenlik kuralları", "Worker kontrolü", "Trafik analizi"],
     "useCases": ["DNS operasyonları", "Güvenlik yönetimi", "Edge uygulama dağıtımı"]},
    {"id": "stripe-payments", "repo": "stripe/agent-toolkit", "name": "Ödeme & Fatura Asistanı", "category": "Ödeme & Finans", "brandColor": "#635BFF",
     "description": "Stripe üzerinden ödeme ve fatura yönetimi.",
     "about": "Ödeme & Fatura Asistanı, Stripe entegrasyonu ile fatura oluşturma, ödeme takibi ve abonelik yönetimini NOOK Agent'a bağlar.",
     "features": ["Fatura yönetimi", "Ödeme sorgulama", "Abonelik kontrolü", "Gelir raporları"],
     "useCases": ["Geciken ödeme takibi", "Aylık gelir özeti", "Müşteri faturalama"]},
    {"id": "qdrant-memory", "repo": "qdrant/mcp-server-qdrant", "name": "Vektör Hafıza Asistanı", "category": "Yapay Zeka", "brandColor": "#DC244C",
     "description": "Anlamsal arama ile uzun süreli ajan hafızası.",
     "about": "Vektör Hafıza Asistanı, dokümanlarınızı ve geçmiş verileri anlamsal olarak indeksler. Ajanınız bağlama uygun bilgiyi anında bulur.",
     "features": ["Anlamsal arama", "Vektör indeksleme", "Hafıza katmanı", "Benzerlik eşleştirme"],
     "useCases": ["Kurumsal bilgi arama", "Müşteri geçmişi", "Doküman eşleştirme"]},
    {"id": "chroma-search", "repo": "chroma-core/chroma-mcp", "name": "Chroma Arama Asistanı", "category": "Yapay Zeka", "brandColor": "#FF6442",
     "description": "Yerel vektör veritabanı ile belge arama.",
     "about": "Chroma Arama Asistanı, şirket dokümanlarınızı vektör veritabanında indeksleyerek anlamsal arama ve RAG uygulamaları için altyapı sağlar.",
     "features": ["Belge indeksleme", "Anlamsal sorgu", "Koleksiyon yönetimi", "Yerel çalışma"],
     "useCases": ["İç bilgi arama", "RAG uygulamaları", "Doküman Q&A"]},
    {"id": "elasticsearch-search", "repo": "elastic/mcp-server-elasticsearch", "name": "Elasticsearch Arama Asistanı", "category": "Veri & Entegrasyon", "brandColor": "#005571",
     "description": "Kurumsal arama ve log analitiğine ajan erişimi.",
     "about": "Elasticsearch Arama Asistanı, log verileri, indeksler ve tam metin arama işlemlerine NOOK Agent üzerinden erişim sağlar.",
     "features": ["İndeks sorgulama", "Log analizi", "Tam metin arama", "ES|QL desteği"],
     "useCases": ["Log analizi", "Güvenlik olay inceleme", "Kurumsal arama"]},
    {"id": "dbt-analytics", "repo": "dbt-labs/dbt-mcp", "name": "dbt Veri Dönüşüm Asistanı", "category": "Veri & Entegrasyon", "brandColor": "#FF694A",
     "description": "Veri pipeline ve dönüşüm modellerine ajan erişimi.",
     "about": "dbt Veri Dönüşüm Asistanı, veri ekibinizin dbt modellerini, testlerini ve dokümantasyonunu NOOK Agent ile sorgulamasını sağlar.",
     "features": ["Model sorgulama", "Test sonuçları", "Lineage analizi", "Dokümantasyon erişimi"],
     "useCases": ["Veri kalite kontrolü", "Model dokümantasyonu", "Pipeline izleme"]},
    {"id": "playwright-automation", "repo": "microsoft/playwright-mcp", "name": "Playwright Test Asistanı", "category": "Yazılım geliştirme", "brandColor": "#2EAD33",
     "description": "Web uygulamalarınızı otomatik test eden tarayıcı ajanı.",
     "about": "Playwright Test Asistanı, web uygulamalarınızın otomatik test edilmesini, ekran görüntüsü alınmasını ve kullanıcı akışlarının doğrulanmasını sağlar.",
     "features": ["Otomatik web testi", "Ekran görüntüsü", "Kullanıcı akışı simülasyonu", "Çapraz tarayıcı desteği"],
     "useCases": ["Regresyon testi", "UI doğrulama", "Görsel kalite kontrolü"]},
    {"id": "upstash-serverless", "repo": "upstash/mcp-server", "name": "Upstash Sunucusuz Veri", "category": "Backend & BaaS", "brandColor": "#00E9A3",
     "description": "Sunucusuz Redis ve Kafka verilerine ajan erişimi.",
     "about": "Upstash Sunucusuz Veri, Redis ve Kafka tabanlı sunucusuz veri katmanınıza NOOK Agent üzerinden erişim sağlar.",
     "features": ["Redis sorgulama", "Kafka mesajlaşma", "Sunucusuz mimari", "Düşük gecikme"],
     "useCases": ["Önbellek yönetimi", "Gerçek zamanlı veri", "Mikroservis iletişimi"]},
    {"id": "zapier-automation", "repo": "zapier/zapier-mcp", "name": "Zapier Otomasyon Asistanı", "category": "Otomasyon & İş Akışı", "brandColor": "#FF4A00",
     "description": "6000+ uygulama entegrasyonuna ajan erişimi.",
     "about": "Zapier Otomasyon Asistanı, NOOK Agent'ınızın Zapier üzerinden binlerce uygulama ve servisle bağlantı kurmasını sağlar.",
     "features": ["6000+ entegrasyon", "İş akışı tetikleme", "Veri senkronizasyonu", "No-code otomasyon"],
     "useCases": ["CRM veri senkronu", "E-posta otomasyonu", "Çapraz platform entegrasyonu"]},
    {"id": "frontend-design", "repo": "21st-dev/magic-mcp", "name": "UI Tasarım Asistanı", "category": "Yazılım geliştirme", "brandColor": "#F97316",
     "description": "AI destekli arayüz bileşeni oluşturma.",
     "about": "UI Tasarım Asistanı, ürün ekiplerinin doğal dil ile arayüz bileşenleri oluşturmasını ve hızlı prototip geliştirmesini sağlar.",
     "features": ["UI bileşen üretimi", "Tasarım önerileri", "Hızlı prototipleme"],
     "useCases": ["MVP geliştirme", "Landing page üretimi", "Tasarım sistemi"]},
    {"id": "aws-cloud", "repo": "awslabs/mcp", "name": "AWS Bulut Asistanı", "category": "Sunucu ve altyapı", "brandColor": "#FF9900",
     "description": "Amazon Web Services kaynaklarına ajan erişimi.",
     "about": "AWS Bulut Asistanı, EC2, S3, Lambda ve diğer AWS servislerinizi NOOK Agent üzerinden sorgulamanızı ve yönetmenizi sağlar.",
     "features": ["EC2 ve S3 yönetimi", "Lambda fonksiyonları", "CloudWatch izleme", "IAM kontrolü"],
     "useCases": ["Bulut altyapı yönetimi", "Maliyet optimizasyonu", "DevOps otomasyonu"]},
    {"id": "google-genai", "repo": "googleapis/genai-toolbox", "name": "Google GenAI Araç Kutusu", "category": "Yapay Zeka", "brandColor": "#4285F4",
     "description": "Google AI modelleri ve araçlarına birleşik erişim.",
     "about": "Google GenAI Araç Kutusu, Gemini ve diğer Google AI servislerine NOOK Agent üzerinden yapılandırılmış erişim sağlar.",
     "features": ["Gemini model erişimi", "Araç kutusu entegrasyonu", "Çoklu yetenek", "Kurumsal API"],
     "useCases": ["Doküman analizi", "Çok dilli içerik", "AI pilot projeleri"]},
    {"id": "perplexity-research", "repo": "DaInfernalCoder/perplexity-mcp", "name": "Perplexity Araştırma Motoru", "category": "Yapay Zeka", "brandColor": "#1FB8CD",
     "description": "Perplexity AI ile derinlemesine araştırma ve dokümantasyon.",
     "about": "Perplexity Araştırma Motoru, NOOK Agent'ınıza Perplexity AI'nın güncel web araştırma yeteneklerini bağlar. Kaynaklı ve doğrulanmış bilgi üretir.",
     "features": ["Derin web araştırması", "Kaynaklı yanıtlar", "Dokümantasyon desteği"],
     "useCases": ["Pazar araştırması", "Teknik dokümantasyon", "Müşteri bilgi toplama"]},
]


def fetch_text(url: str) -> str:
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "blacknook-catalog/1.0"})
        with urllib.request.urlopen(req, timeout=20) as resp:
            return resp.read().decode("utf-8", errors="replace")
    except Exception:
        return ""


def license_from_text(text: str) -> str | None:
    t = text.lower()
    if "agpl" in t or "gnu general public" in t:
        return "GPL"
    if "sspl" in t:
        return "SSPL"
    if "apache license" in t and "version 2" in t:
        return "Apache-2.0"
    if "mit license" in t or "permission is hereby granted" in t:
        return "MIT"
    if "bsd 3-clause" in t:
        return "BSD-3-Clause"
    return None


def resolve_license(owner: str, repo: str) -> str | None:
    for branch in ("main", "master"):
        for path in ("LICENSE", "LICENSE.md", "LICENSE.txt"):
            lic = license_from_text(
                fetch_text(f"https://raw.githubusercontent.com/{owner}/{repo}/{branch}/{path}")
            )
            if lic:
                return lic
        pkg = fetch_text(f"https://raw.githubusercontent.com/{owner}/{repo}/{branch}/package.json")
        if pkg:
            try:
                import json as _json
                data = _json.loads(pkg)
                lic = str(data.get("license", "")).strip()
                if lic.upper() in ALLOWED or lic in ALLOWED:
                    return lic if lic != "ISC" else "ISC"
                if lic.lower() in ("mit", "apache-2.0", "isc"):
                    return {"mit": "MIT", "apache-2.0": "Apache-2.0", "isc": "ISC"}[lic.lower()]
            except Exception:
                pass
    return None


def avatar(owner: str) -> str:
    if owner.lower() == "modelcontextprotocol":
        return "https://avatars.githubusercontent.com/u/182288589?v=4"
    return f"https://github.com/{owner}.png"


def process(item: dict) -> dict | None:
    repo_path = item["repo"]
    owner, repo = repo_path.split("/", 1)
    lic = resolve_license(owner, repo)
    if lic and lic not in ALLOWED:
        print(f"SKIP {item['id']} ({lic})", flush=True)
        return None
    if not lic:
        # modelcontextprotocol/servers is Apache-2.0
        if owner == "modelcontextprotocol":
            lic = "Apache-2.0"
        else:
            print(f"SKIP {item['id']} (no license)", flush=True)
            return None

    subpath = item.get("subpath")
    repo_url = f"https://github.com/{owner}/{repo}"
    if subpath:
        repo_url += f"/tree/main/{subpath}"

    return {
        "id": item["id"],
        "name": item["name"],
        "category": item["category"],
        "description": item["description"],
        "about": item["about"],
        "features": item["features"],
        "useCases": item["useCases"],
        "brandColor": item.get("brandColor", "#14B8A6"),
        "logoUrl": avatar(owner),
        "license": lic,
        "repo": repo_url,
    }


def main() -> None:
    results: list[dict] = []
    with ThreadPoolExecutor(max_workers=10) as pool:
        futures = {pool.submit(process, c): c["id"] for c in CANDIDATES}
        for fut in as_completed(futures):
            entry = fut.result()
            if entry:
                results.append(entry)
                print(f"OK {entry['id']}", flush=True)

    results.sort(key=lambda x: x["name"].lower())
    results = results[:50]
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(results, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {len(results)} integrations to {OUT}", flush=True)


if __name__ == "__main__":
    main()
