'use client';

import { useEffect, useRef, useState } from 'react';
import { ChatPanel } from './components/ChatPanel';
import { FlowCanvas } from './components/FlowCanvas';
import { ResponsePanel } from './components/ResponsePanel';
import { DEMO_SCENES } from './data';
import type { FlowNodeId, FlowiseStep } from './types';
import './simulation.css';

const NODE_SEQUENCE: FlowNodeId[] = [
  'input',
  'loader',
  'embeddings',
  'vector',
  'chain',
  'output',
];

export default function FlowiseSimulation() {
  const [sceneIndex, setSceneIndex] = useState(0);
  const [step, setStep] = useState<FlowiseStep>('idle');
  const [activeNode, setActiveNode] = useState<FlowNodeId | null>(null);
  const [typedAnswer, setTypedAnswer] = useState('');
  const runId = useRef(0);

  const scene = DEMO_SCENES[sceneIndex];

  useEffect(() => {
    let cancelled = false;
    const timers: number[] = [];
    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        timers.push(window.setTimeout(resolve, ms));
      });

    const typeAnswer = async (text: string) => {
      setTypedAnswer('');
      for (let i = 0; i < text.length; i += 1) {
        if (cancelled) return;
        setTypedAnswer(text.slice(0, i + 1));
        await wait(18);
      }
    };

    const play = async () => {
      let index = 0;

      while (!cancelled) {
        const current = DEMO_SCENES[index];
        setSceneIndex(index);
        setStep('idle');
        setActiveNode(null);
        setTypedAnswer('');
        await wait(1400);
        if (cancelled) return;

        setStep('question');
        await wait(2200);
        if (cancelled) return;

        setStep('flowing');
        for (const node of NODE_SEQUENCE) {
          setActiveNode(node);
          await wait(650);
          if (cancelled) return;
        }

        setStep('retrieving');
        setActiveNode('vector');
        await wait(2000);
        if (cancelled) return;

        setStep('answering');
        setActiveNode('output');
        await typeAnswer(current.answer);
        if (cancelled) return;

        setStep('done');
        await wait(4800);
        if (cancelled) return;

        index = (index + 1) % DEMO_SCENES.length;
        runId.current += 1;
        await wait(800);
      }
    };

    void play();

    return () => {
      cancelled = true;
      for (const id of timers) window.clearTimeout(id);
    };
  }, []);

  return (
    <div className="flowise-sim flex h-full min-h-0 w-full flex-col overflow-hidden rounded-2xl border border-[var(--bn-card-border)] bg-[var(--bn-card-bg-solid)] shadow-[var(--bn-card-shadow)]">
      <main className="flex min-h-0 flex-1 flex-col gap-3 overflow-hidden p-3 lg:flex-row lg:gap-0 lg:p-0">
        <section className="flex h-full min-h-0 min-w-0 flex-[3] flex-col lg:border-r lg:border-[var(--bn-border)] lg:bg-[var(--bn-surface)] lg:p-3">
          <ChatPanel scene={scene} step={step} />
        </section>
        <section className="flex h-full min-h-0 min-w-0 flex-[5] flex-col lg:border-r lg:border-[var(--bn-border)] lg:bg-[var(--bn-elevated)]/60 lg:p-3">
          <FlowCanvas step={step} activeNode={activeNode} />
        </section>
        <section className="flex h-full min-h-0 min-w-0 flex-[3] flex-col lg:bg-[var(--bn-surface)] lg:p-3">
          <ResponsePanel scene={scene} step={step} typedAnswer={typedAnswer} />
        </section>
      </main>
    </div>
  );
}
