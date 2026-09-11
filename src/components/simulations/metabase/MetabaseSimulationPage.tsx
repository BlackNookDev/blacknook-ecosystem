'use client';

import { useState } from 'react';
import SimulationPageLayout from '@/components/simulations/shared/SimulationPageLayout';
import MetabaseSimulation from '@/components/simulations/metabase/MetabaseSimulation';

export default function MetabaseSimulationPage() {
  const [resetKey, setResetKey] = useState(0);

  return (
    <SimulationPageLayout
      title="Metabase Simülasyonu"
      resetKey={resetKey}
      onReset={() => setResetKey((k) => k + 1)}
    >
      <MetabaseSimulation key={resetKey} />
    </SimulationPageLayout>
  );
}
