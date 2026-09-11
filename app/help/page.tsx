import type { Metadata } from 'next';
import HelpCenterContent from '@/components/help/HelpCenterContent';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Yardım Merkezi | Blacknook',
  description:
    'Keşif, kurulum talebi, departman paneli ve hesap hakkında Blacknook yardım merkezi.',
  path: '/help',
});

export default function HelpPage() {
  return <HelpCenterContent />;
}
