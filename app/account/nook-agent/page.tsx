import { redirect } from 'next/navigation';
import { NOOK_AGENT_LAUNCH_PATH } from '@/lib/nookAgent';

export default function NookAgentRedirectPage() {
  redirect(NOOK_AGENT_LAUNCH_PATH);
}
