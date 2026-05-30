"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

const UnsavedChangesContext = createContext(null);

// Tracks whether the active editor has unsaved changes and provides a guard used
// before navigating away or closing a slide-over. Sidebar links and the slide-over
// route their navigation through `confirmDiscard()`; a beforeunload handler covers
// browser tab close / refresh.
export function UnsavedChangesProvider({ children }) {
  const [isDirty, setDirty] = useState(false);
  const dirtyRef = useRef(false);

  useEffect(() => {
    dirtyRef.current = isDirty;
  }, [isDirty]);

  useEffect(() => {
    const handler = (e) => {
      if (dirtyRef.current) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, []);

  // Returns true if it's safe to proceed (no changes, or user confirmed discard).
  const confirmDiscard = useCallback(() => {
    if (!dirtyRef.current) return true;
    const ok = window.confirm(
      "You have unsaved changes. Discard them and continue?",
    );
    if (ok) {
      dirtyRef.current = false;
      setDirty(false);
    }
    return ok;
  }, []);

  return (
    <UnsavedChangesContext.Provider value={{ isDirty, setDirty, confirmDiscard }}>
      {children}
    </UnsavedChangesContext.Provider>
  );
}

export function useUnsavedChanges() {
  const ctx = useContext(UnsavedChangesContext);
  if (!ctx) {
    return { isDirty: false, setDirty: () => {}, confirmDiscard: () => true };
  }
  return ctx;
}
