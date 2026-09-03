import AccountBillingContent from '@/components/account/AccountBillingContent';

export default function AccountBillingPage() {
  return (
    <div>
      <h1 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
        Ödeme & faturalama
      </h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-500">
        Ödeme yöntemlerinizi, fatura bilgilerinizi ve geçmiş faturalarınızı yönetin.
      </p>

      <div className="mt-10">
        <AccountBillingContent />
      </div>
    </div>
  );
}
