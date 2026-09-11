import Link from 'next/link';
import LegalDoc from '@/components/legal/LegalDoc';

/** Blacknook kullanım koşulları — Keşfet → Kur → İşlet modeli */
export default function TermsContent() {
  return (
    <LegalDoc title="Kullanım Koşulları" updated="10 Eylül 2026">
      <p>
        Blacknook; ajan kataloğu, yönetilen kurulum ve otonom departman paneli (/agent) sunan bir
        platformdur. Bu metin, Hizmetleri nasıl kullandığınızı ve tarafların sorumluluklarını özetler.
      </p>
      <p>Blacknook Ekibi</p>

      <h2>1. Koşulların kabulü</h2>
      <p>
        Bu belge ve <Link href="/privacy">Gizlilik Politikası</Link> birlikte Kullanım Koşulları’nı
        (“<strong>Koşullar</strong>”) oluşturur. blacknook.com ve ilgili Hizmetleri kullanarak
        Koşulları kabul etmiş sayılırsınız. Kabul etmiyorsanız Hizmetleri kullanmayın.
      </p>

      <h2>2. Hizmetlerin kapsamı</h2>
      <ul>
        <li>
          <strong>Keşif:</strong> Ajan / MCP kataloğu ve doğal dil araması.
        </li>
        <li>
          <strong>Kurulum:</strong> “Kurulum Talep Et” ile yönetilen onboarding (KVKK uyumlu sistem,
          bulut veya kendi sunucunuz).
        </li>
        <li>
          <strong>İşletim:</strong> Giriş sonrası /agent departman paneli, Studio ve entegrasyon
          yüzeyleri.
        </li>
      </ul>
      <p>
        Açık pazaryeri eşleşmesi, partner ürün listeleme ve kartlı tek tık satın alma bu sürümde
        sunulmaz. Fiyatlandırma ve sözleşme koşulları yönetilen kurulum sürecinde netleştirilir.
      </p>

      <h2>3. Hesaplar</h2>
      <p>
        Bazı Hizmetlere erişim için kayıt gerekir. Bilgilerinizin doğru olması gerekir. Hesap
        güvenliğinden siz sorumlusunuz. Yetkisiz erişimi derhal bildiriniz. Hizmetleri kullanmak için
        18 yaşında veya daha büyük olmalısınız.
      </p>

      <h2>4. Kabul edilebilir kullanım</h2>
      <ul>
        <li>Yasalara ve üçüncü kişi haklarına saygı gösterin.</li>
        <li>İzinsiz scraping, tersine mühendislik veya zararlı yazılım yaymayın.</li>
        <li>Sistemlere yetkisiz erişim veya hizmeti bozma girişimleri yasaktır.</li>
        <li>Diğer kullanıcıların deneyimini kötüye kullanmayın.</li>
      </ul>

      <h2>5. Kurulum ve destek</h2>
      <p>
        Kurulum talepleri operasyon ekibine iletilir; süreç e-posta ve admin kuyruğu üzerinden
        yürür. Destek sohbeti anlık yardım içindir ve kurulum kuyruğuna yazılmaz; escalate e-posta ile
        ekibe ulaşır. Ürün kurulumu için “Kurulum Talep Et” kullanın.
      </p>

      <h2>6. İçerik ve fikri mülkiyet</h2>
      <p>
        Platformda yayınladığınız içerikten siz sorumlusunuz. Blacknook markası, yazılımı ve
        materyalleri Blacknook’a aittir. Katalogdaki üçüncü taraf ürün adları ilgili sahiplerine
        aittir.
      </p>

      <h2>7. Sorumluluk sınırı</h2>
      <p>
        Hizmetler “olduğu gibi” sunulur. Yasaların izin verdiği ölçüde dolaylı zararlardan sorumlu
        değiliz. Zorunlu tüketici hakları saklıdır.
      </p>

      <h2>8. İletişim</h2>
      <p>
        Sorularınız için{' '}
        <a href="mailto:contact@blacknook.com">contact@blacknook.com</a>. Güncel Gizlilik Politikası:{' '}
        <Link href="/privacy">/privacy</Link>.
      </p>
    </LegalDoc>
  );
}
