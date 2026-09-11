'use client';

import { useState } from 'react';
import SimulationPageLayout from '@/components/simulations/shared/SimulationPageLayout';
import PlausibleSimulation from '@/components/simulations/plausible/PlausibleSimulation';

export default function PlausibleSimulationPage() {
  const [resetKey, setResetKey] = useState(0);
  return (
    <SimulationPageLayout
      title="Plausible Simülasyonu"
      resetKey={resetKey}
      onReset={() => setResetKey((k) => k + 1)}
    >
      <PlausibleSimulation key={resetKey} />
    </SimulationPageLayout>
  );
}
