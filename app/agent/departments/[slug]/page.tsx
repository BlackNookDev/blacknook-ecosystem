import { notFound } from 'next/navigation';
import DepartmentWorkspace from '@/components/otonom/DepartmentWorkspace';
import { getDepartment } from '@/lib/otonom/catalog';

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function DepartmentPage({ params }: Props) {
  const { slug } = await params;
  const department = getDepartment(slug);

  if (!department) notFound();

  return <DepartmentWorkspace department={department} />;
}
