export function ConfirmationModal({ isOpen, title, message, onConfirm, onCancel }: any) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-ink-850 border border-ink-line-strong rounded-2xl shadow-xl w-full max-w-sm p-6 space-y-4 animate-in fade-in zoom-in duration-200">
        <h3 className="text-lg font-bold text-cream">{title}</h3>
        <p className="text-sm text-cream-muted">{message}</p>
        <div className="flex gap-3 pt-2">
          <button onClick={onCancel} className="flex-1 px-4 py-2 text-sm font-semibold text-cream-muted bg-ink-800 rounded-xl hover:bg-ink-700">Cancelar</button>
          <button onClick={onConfirm} className="flex-1 px-4 py-2 text-sm font-semibold text-cream bg-pop rounded-xl hover:opacity-90">Confirmar</button>
        </div>
      </div>
    </div>
  );
}