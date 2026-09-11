import Link from 'next/link';
import LegalDoc from '@/components/legal/LegalDoc';

/** Blacknook gizlilik politikası — Keşfet → Kur → İşlet modeli */
export default function PrivacyContent() {
  return (
    <LegalDoc title="Gizlilik Politikası" updated="10 Eylül 2026">
      <p>
        Blacknook (“<strong>biz</strong>”) gizliliğinize saygı duyar. Bu politika; blacknook.com ve
        ilgili Hizmetlerde hangi verileri neden işlediğimizi özetler.
      </p>

      <h2>Kapsam</h2>
      <p>
        Site ziyareti, hesap, kurulum talebi, destek sohbeti/e-posta ve /agent paneli kullanımında
        toplanan verilere uygulanır. Üçüncü taraf siteler ve herkese açık forumlara yazdığınız
        içerikler bu politikanın dışındadır.
      </p>

      <h2>16 yaşından küçükler</h2>
      <p>
        Hizmetler 16 yaşından küçükler için tasarlanmamıştır. Bilerek bu yaş grubundan kişisel veri
        toplamayız. Şüpheniz varsa{' '}
        <a href="mailto:contact@blacknook.com">contact@blacknook.com</a> yazın.
      </p>

      <h2>Topladığımız bilgiler</h2>
      <ul>
        <li>
          <strong>Hesap:</strong> ad, e-posta, profil alanları
        </li>
        <li>
          <strong>Kurulum talebi:</strong> şirket, e-posta, ihtiyaç metni, kurulum ortamı tercihi
          (KVKK / bulut / kendi sunucu)
        </li>
        <li>
          <strong>Destek:</strong> sohbet özeti ve escalate e-posta içeriği
        </li>
        <li>
          <strong>Teknik:</strong> IP, tarayıcı, cihaz, kullanım analitikleri, çerezler
        </li>
      </ul>
      <p>
        Kart bilgileri Blacknook sunucularında saklanmaz; ödeme altyapısı açıldığında üçüncü taraf
        işlemciler üzerinden işlenir.
      </p>

      <h2>Kullanım amaçları</h2>
      <ul>
        <li>Hizmeti sunmak ve hesabı yönetmek</li>
        <li>Kurulum onboarding ve operasyon iletişimi</li>
        <li>Destek yanıtı ve güvenlik</li>
        <li>Ürünü iyileştirmek, hataları gidermek</li>
        <li>Yasal yükümlülükler</li>
      </ul>

      <h2>Paylaşım</h2>
      <p>Kişisel verileri şu durumlarda paylaşabiliriz:</p>
      <ul>
        <li>Gizlilik yükümlülüğü altındaki altyapı ve e-posta hizmet sağlayıcıları</li>
        <li>Yasal zorunluluk veya yetkili makam talebi</li>
        <li>
          <Link href="/terms">Kullanım Koşulları</Link>’nın uygulanması ve güvenlik
        </li>
      </ul>
      <p>
        Açık pazaryeri / partner listeleme bu sürümde yoktur; alıcı verisi üçüncü taraf satıcılara
        ürün satışı için aktarılmaz.
      </p>

      <h2>Saklama ve güvenlik</h2>
      <p>
        Verileri hizmeti sunmak için gerekli süre boyunca saklarız. Makul teknik ve idari önlemler
        alırız; hiçbir sistem mutlak güvenlik iddiasında bulunamaz.
      </p>

      <h2>Haklarınız</h2>
      <p>
        KVKK kapsamındaki erişim, düzeltme, silme ve itiraz haklarınız için{' '}
        <a href="mailto:contact@blacknook.com">contact@blacknook.com</a> adresine yazın.
      </p>

      <h2>Değişiklikler</h2>
      <p>
        Politikayı güncelleyebiliriz. Önemli değişikliklerde Site üzerinden bilgilendirme yapılır.
        Güncel metin bu sayfadadır.
      </p>
    </LegalDoc>
  );
}
