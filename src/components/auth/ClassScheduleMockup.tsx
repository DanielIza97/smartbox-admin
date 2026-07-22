// Mockup ilustrativo (sin datos reales, sin fetch) para el hero de las
// páginas de auth — muestra el calendario de clases porque es lo más
// reconocible como "gimnasio" para alguien que nunca vio la app, más que
// un dashboard de métricas genérico. Mismo lenguaje visual que
// PortalPageHero (blobs difuminados de fondo con los tokens del tema).
const CLASSES = [
  { name: 'Yoga Flow', time: '07:00', booked: 18, capacity: 20 },
  { name: 'Spinning', time: '09:00', booked: 12, capacity: 15 },
  { name: 'CrossFit', time: '18:00', booked: 20, capacity: 20 },
  { name: 'Pilates', time: '19:30', booked: 9, capacity: 16 },
];

export function ClassScheduleMockup() {
  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="pointer-events-none absolute -top-16 -left-16 h-72 w-72 rounded-full bg-wood-500/20 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-16 -right-10 h-72 w-72 rounded-full bg-neon-400/15 blur-2xl" />

      <div className="relative bg-ink-850 border border-ink-line rounded-2xl shadow-xl p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-cream-faint">Hoy</p>
            <h3 className="text-lg font-bold text-cream">Tus clases</h3>
          </div>
          <span className="text-2xl">🧘</span>
        </div>

        <div className="space-y-3">
          {CLASSES.map((c) => {
            const pct = Math.round((c.booked / c.capacity) * 100);
            const full = c.booked >= c.capacity;
            return (
              <div key={c.name} className="bg-ink-950 rounded-xl p-3.5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-cream">{c.name}</span>
                  <span className="text-xs text-cream-faint">{c.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 rounded-full bg-ink-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${full ? 'bg-pop' : 'bg-wood-500'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-semibold text-cream-muted whitespace-nowrap">
                    {c.booked}/{c.capacity}{full ? ' · Lleno' : ''}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="absolute -left-10 -top-8 bg-ink-850 border border-ink-line rounded-xl shadow-lg px-4 py-3 hidden xl:block">
        <p className="text-[10px] font-bold uppercase tracking-wider text-cream-faint">Ocupación</p>
        <p className="text-xl font-bold text-success">94%</p>
      </div>

      <div className="absolute -right-6 -bottom-10 bg-ink-850 border border-ink-line rounded-xl shadow-lg px-4 py-3 items-center gap-2 hidden xl:flex">
        <div className="flex -space-x-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="w-6 h-6 rounded-full bg-wood-600 border-2 border-ink-850" />
          ))}
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-cream-faint">Socios activos</p>
          <p className="text-sm font-bold text-cream">+142</p>
        </div>
      </div>
    </div>
  );
}
