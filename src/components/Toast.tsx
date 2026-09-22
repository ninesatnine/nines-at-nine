"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/** A short, self-dismissing status line pinned to the bottom of the screen. */
export function useToast() {
  const [message, setMessage] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const toast = useCallback((text: string) => {
    setMessage(text);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setMessage(""), 2400);
  }, []);

  useEffect(() => () => clearTimeout(timer.current), []);

  const node = (
    <div className={`toast${message ? " show" : ""}`} role="status" aria-live="polite">
      {message}
    </div>
  );

  return { toast, node };
}
