import ComingSoonAccount from '@/components/account/ComingSoonAccount';
import { PaytrTrustRow } from '@/components/PaytrLogo';

export default function AccountBillingPage() {
  return (
    <div>
      <ComingSoonAccount
        title="Ödeme & faturalama"
        description="Kart kaydı ve fatura adresi şu an toplanmıyor."
        body="Satın alma ve faturalama açılınca ödeme yönteminizi PayTR üzerinden bağlayacaksınız. Blacknook kart numarası saklamaz. Bugün canlı olanlar: katalog, kurulum talebi ve destek hattı."
      />
      <PaytrTrustRow className="mt-6" />
    </div>
  );
}
