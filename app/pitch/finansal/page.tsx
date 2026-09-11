import { redirect } from 'next/navigation';

/** Eski finansal projeksiyon rotası → strateji yol haritası */
export default function PitchFinancialPage() {
  redirect('/pitch#finansal-strateji');
}
