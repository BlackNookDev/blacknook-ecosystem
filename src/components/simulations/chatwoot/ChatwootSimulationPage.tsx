'use client';

import { useState } from 'react';
import SimulationPageLayout from '@/components/simulations/shared/SimulationPageLayout';
import ChatwootSimulation from '@/components/simulations/chatwoot/ChatwootSimulation';

export default function ChatwootSimulationPage() {
  const [resetKey, setResetKey] = useState(0);
  return (
    <SimulationPageLayout
      title="Chatwoot Simülasyonu"
      resetKey={resetKey}
      onReset={() => setResetKey((k) => k + 1)}
    >
      <ChatwootSimulation key={resetKey} />
    </SimulationPageLayout>
  );
}
