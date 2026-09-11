/**
 * Coder / IDE altyapısı (workspace, code-server).
 * B2B pivot: varsayılan kapalı. Yalnızca NEXT_PUBLIC_CODER_FEATURE_ENABLED=true ile açılır.
 */
export function isCoderFeatureEnabled(): boolean {
  return process.env.NEXT_PUBLIC_CODER_FEATURE_ENABLED === 'true';
}

/** Studio ajan yapılandırma / önizleme (Coder’dan bağımsız). */
export function isAgentStudioEnabled(): boolean {
  // Coder kapalıyken Studio yalnızca yapılandırma + simülasyon önizlemesi olarak açık kalır.
  return process.env.NEXT_PUBLIC_AGENT_STUDIO_ENABLED !== 'false';
}
