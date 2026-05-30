"use client";

import { createContext, useContext, useEffect, useState } from "react";

// Two separate contexts so pages can set chrome WITHOUT subscribing to its value.
// If a page read the chrome value, every setChrome() would re-render the page,
// which re-creates the status/actions literals, which re-fires the effect →
// "Maximum update depth exceeded". The setter from useState is referentially
// stable, so the set-context value never changes and pages never loop.
const ChromeValueContext = createContext(null);
const ChromeSetContext = createContext(null);

export function PageChromeProvider({ children }) {
  const [chrome, setChrome] = useState({ title: "", breadcrumb: "", status: null, actions: null });
  return (
    <ChromeSetContext.Provider value={setChrome}>
      <ChromeValueContext.Provider value={chrome}>{children}</ChromeValueContext.Provider>
    </ChromeSetContext.Provider>
  );
}

// Read-only consumer for the shell's Topbar.
export function usePageChromeValue() {
  return useContext(ChromeValueContext) || { title: "", breadcrumb: "", status: null, actions: null };
}

// Hook used by pages. Depends on primitive status fields (not object identity) so
// a fresh `{ label, tone }` literal each render doesn't churn. Because pages only
// subscribe to the stable set-context, setChrome never re-renders the page, so
// including `actions` (a new JSX node each render) in deps is safe — no loop — and
// keeps action buttons (e.g. a disabled "New" at max) in sync with page state.
export function usePageChrome({ title, breadcrumb, status, actions } = {}) {
  const setChrome = useContext(ChromeSetContext);
  const statusLabel = status?.label ?? null;
  const statusTone = status?.tone ?? null;

  useEffect(() => {
    if (!setChrome) return undefined;
    setChrome({
      title: title || "",
      breadcrumb: breadcrumb || "",
      status: statusLabel ? { label: statusLabel, tone: statusTone } : null,
      actions,
    });
    return () => setChrome({ title: "", breadcrumb: "", status: null, actions: null });
  }, [title, breadcrumb, statusLabel, statusTone, actions, setChrome]);
}
