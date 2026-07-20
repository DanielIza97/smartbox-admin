'use client';

import { useParams } from 'next/navigation';
import { TiltCard } from '@/components/ui/TiltCard';
import { ClassDetailContent } from '@/components/classes/ClassDetailContent';

export default function PortalClassDetailPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="relative min-h-screen overflow-hidden bg-ink-950 p-8 md:p-16">
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-wood-500/20 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-wood-500/15 blur-2xl" />

      <div className="relative z-10 max-w-3xl mx-auto">
        <TiltCard maxTilt={2}>
          <ClassDetailContent classId={id} classesHref="/portal/classes" reservationsHref="/portal/reservations" />
        </TiltCard>
      </div>
    </div>
  );
}
