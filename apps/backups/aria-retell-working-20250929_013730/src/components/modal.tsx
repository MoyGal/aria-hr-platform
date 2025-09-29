'use client';
import { useEffect } from 'react';
import ReactDOM from 'react-dom';

export default function Modal({
  open, onClose, title, children,
}: { open: boolean; onClose:()=>void; title: string; children: React.ReactNode }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; document.removeEventListener('keydown', onKey); };
  }, [open, onClose]);
  if (!open || typeof document === 'undefined') return null;
  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[9998] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="aria-glass relative z-[9999] w-[95vw] max-w-lg rounded-2xl p-5">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button onClick={onClose} className="rounded border border-white/20 px-2 py-1 text-xs hover:bg-white/10">Close</button>
        </div>
        {children}
      </div>
    </div>,
    document.body
  );
}
