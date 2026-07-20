'use client';

import { useParams } from 'next/navigation';
import { ClassDetailContent } from '@/components/classes/ClassDetailContent';

export default function PortalClassDetailPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="max-w-3xl mx-auto p-8">
      <ClassDetailContent classId={id} classesHref="/portal/classes" reservationsHref="/portal/reservations" />
    </div>
  );
}
