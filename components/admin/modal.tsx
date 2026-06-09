"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

type AdminModalProps = {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  maxWidth?: string;
};

export function AdminModal({ title, children, onClose, maxWidth = "max-w-3xl" }: AdminModalProps) {
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink/55 px-4 py-8" onMouseDown={onClose}>
      <div className={`max-h-[90vh] w-full ${maxWidth} overflow-y-auto rounded-lg bg-paper shadow-soft`} onMouseDown={(event) => event.stopPropagation()}>
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-ink/10 bg-paper px-5 py-4">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button className="focus-ring rounded-full bg-white p-2 text-ink/65 transition hover:text-ink" onClick={onClose} type="button" aria-label="Close modal">
            <X size={18} aria-hidden />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

type ConfirmModalProps = {
  loading?: boolean;
  message?: string;
  onCancel: () => void;
  onConfirm: () => void;
};

export function ConfirmModal({ loading = false, message = "Are you sure you want to delete this?", onCancel, onConfirm }: ConfirmModalProps) {
  return (
    <AdminModal title="Confirm delete" onClose={onCancel} maxWidth="max-w-md">
      <div className="space-y-5">
        <p className="text-sm leading-6 text-ink/70">{message}</p>
        <div className="flex flex-wrap justify-end gap-2">
          <button className="focus-ring rounded-full border border-ink/10 bg-white px-4 py-2 text-sm font-semibold text-ink/70 transition hover:text-ink" onClick={onCancel} type="button">
            Cancel
          </button>
          <button className="focus-ring rounded-full bg-clay px-4 py-2 text-sm font-semibold text-white transition hover:bg-clay/90 disabled:cursor-not-allowed disabled:opacity-60" onClick={onConfirm} disabled={loading} type="button">
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </AdminModal>
  );
}
