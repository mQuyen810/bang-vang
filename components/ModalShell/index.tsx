"use client";

import { PropsWithChildren, useEffect } from "react";

export function ModalShell({
  onClose,
  children,
}: PropsWithChildren<{ onClose: () => void }>) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4"
      onMouseDown={() => onClose()}
    >
      {children}
    </div>
  );
}
