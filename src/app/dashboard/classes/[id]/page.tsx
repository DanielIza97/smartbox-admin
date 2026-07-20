'use client';

import { useParams } from 'next/navigation';
import { Sidebar } from '@/components/ui/sidebar';
import { ClassDetailContent } from '@/components/classes/ClassDetailContent';

export default function ClassDetailPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <main className="flex-1 pl-64 w-full">
        <div className="p-8 max-w-3xl">
          <ClassDetailContent
            classId={id}
            classesHref="/dashboard/classes"
            reservationsHref="/dashboard/reservations"
          />
        </div>
      </main>
    </div>
  );
}
