import ActiveRequestsSection from '@/components/account/ActiveRequestsSection';

export default function AccountRequestsPage() {
  return (
    <div>
      <h1 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
        Talepler
      </h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-500">
        Kurulum talepleriniz burada listelenir. Yeni talep için katalogdan bir ajan seçip
        “Kurulum Talep Et” kullanın (giriş gerekir).
      </p>

      <div className="mt-10">
        <ActiveRequestsSection />
      </div>
    </div>
  );
}
