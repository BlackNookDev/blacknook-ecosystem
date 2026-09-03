import { Suspense } from 'react';
import MessagesInbox from '@/components/account/MessagesInbox';

export default function AccountMessagesPage() {
  return (
    <div>
      <h1 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
        Mesajlar
      </h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-500">
        Destek atamaları ve hesap mesajlarınız burada görünür.
      </p>
      <div className="mt-8">
        <Suspense fallback={<p className="text-sm text-zinc-500">Mesajlar yükleniyor…</p>}>
          <MessagesInbox />
        </Suspense>
      </div>
    </div>
  );
}
