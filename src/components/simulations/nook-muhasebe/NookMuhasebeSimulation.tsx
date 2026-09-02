'use client';

import { useEffect, useRef, useState } from 'react';
import { ERPPanel } from './components/ERPPanel';
import { EveningReport } from './components/EveningReport';
import { WhatsAppPanel } from './components/WhatsAppPanel';
import { DEMO_SCENES, INITIAL_RECEIPTS, INITIAL_SPEND } from './data';
import type { DemoStep, ReceiptItem } from './types';
import './simulation.css';

function composerFor(step: DemoStep): string {
  switch (step) {
    case 'analyzing':
      return 'NOOK analiz ediyor…';
    case 'analyzed':
      return 'NOOK · Muhasebeye aktarıldı';
    case 'syncing':
      return 'NOOK · Muhasebeye aktarılıyor…';
    case 'synced':
      return 'NOOK · Muhasebeye aktarıldı';
    default:
      return 'Mesaj';
  }
}

export default function NookMuhasebeSimulation() {
  const [sceneIndex, setSceneIndex] = useState(0);
  const [step, setStep] = useState<DemoStep>('idle');
  const [receipts, setReceipts] = useState<ReceiptItem[]>(INITIAL_RECEIPTS);
  const [spend, setSpend] = useState(INITIAL_SPEND);
  const [highlightId, setHighlightId] = useState<string | null>(null);
  const [reportOpen, setReportOpen] = useState(false);
  const runId = useRef(0);
  const reportDropped = useRef(false);

  const scene = DEMO_SCENES[sceneIndex];

  useEffect(() => {
    if (!highlightId) return;
    const timer = window.setTimeout(() => setHighlightId(null), 2800);
    return () => window.clearTimeout(timer);
  }, [highlightId]);

  useEffect(() => {
    let cancelled = false;
    const timers: number[] = [];
    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        timers.push(window.setTimeout(resolve, ms));
      });

    const play = async () => {
      let index = 0;
      let currentSpend = INITIAL_SPEND;
      let currentRows = INITIAL_RECEIPTS;

      while (!cancelled) {
        const current = DEMO_SCENES[index];
        const entryId = `${current.receipt.id}-${runId.current}`;
        const entry = { ...current.receipt, id: entryId };

        setSceneIndex(index);
        setStep('idle');
        await wait(1400);
        if (cancelled) return;

        setStep('chiefTyping');
        await wait(2200);
        if (cancelled) return;

        setStep('message');
        await wait(2000);
        if (cancelled) return;

        setStep('receipt');
        await wait(1800);
        if (cancelled) return;

        setStep('analyzing');
        await wait(2800);
        if (cancelled) return;

        setStep('analyzed');
        await wait(1800);
        if (cancelled) return;

        setStep('syncing');
        await wait(1600);
        if (cancelled) return;

        currentRows = [entry, ...currentRows];
        currentSpend += entry.total;
        setReceipts(currentRows);
        setSpend(currentSpend);
        setHighlightId(entryId);
        setStep('synced');

        if (!reportDropped.current) {
          reportDropped.current = true;
          await wait(2200);
          if (cancelled) return;
          setReportOpen(true);
        }

        await wait(4800);
        if (cancelled) return;

        index = (index + 1) % DEMO_SCENES.length;
        runId.current += 1;

        if (index === 0) {
          currentRows = INITIAL_RECEIPTS;
          currentSpend = INITIAL_SPEND;
          setReceipts(INITIAL_RECEIPTS);
          setSpend(INITIAL_SPEND);
          setHighlightId(null);
          reportDropped.current = false;
          setReportOpen(false);
          await wait(1200);
        }
      }
    };

    void play();

    return () => {
      cancelled = true;
      for (const id of timers) window.clearTimeout(id);
    };
  }, []);

  const handleApprove = (id: string) => {
    setReceipts((current) =>
      current.map((row) =>
        row.id === id && row.status === 'pending' ? { ...row, status: 'approved' } : row
      )
    );
  };

  return (
    <div className="nook-muhasebe-sim flex h-full min-h-0 w-full flex-col overflow-hidden rounded-2xl border border-[var(--bn-card-border)] bg-[var(--bn-card-bg-solid)] shadow-[var(--bn-card-shadow)]">
      <main className="flex min-h-0 flex-1 overflow-hidden">
        <section className="flex h-full min-h-0 min-w-0 flex-[3] flex-col border-r border-[var(--bn-border)] bg-[var(--bn-surface)]">
          <WhatsAppPanel step={step} scene={scene} composer={composerFor(step)} />
        </section>
        <section className="flex h-full min-h-0 min-w-0 flex-[5] flex-col border-r border-[var(--bn-border)] bg-[var(--bn-elevated)]/60">
          <ERPPanel
            spend={spend}
            receipts={receipts}
            highlightId={highlightId}
            onApprove={handleApprove}
            done={step === 'synced'}
          />
        </section>
        <section className="flex h-full min-h-0 min-w-0 flex-[3] flex-col bg-[var(--bn-surface)]">
          <EveningReport open={reportOpen} spend={spend} />
        </section>
      </main>
    </div>
  );
}
