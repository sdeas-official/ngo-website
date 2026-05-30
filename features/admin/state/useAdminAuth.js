"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Verifies the admin session against /api/admin-auth/session and redirects to the
// login page when unauthenticated. Same contract the legacy panel used inline.
export function useAdminAuth() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const response = await fetch("/api/admin-auth/session", {
          method: "GET",
          cache: "no-store",
        });
        const data = await response.json().catch(() => ({}));
        if (!mounted) return;

        if (response.ok && data?.authenticated) {
          setIsAuthorized(true);
        } else {
          setIsAuthorized(false);
          router.replace("/admin-login?next=/admin");
        }
      } catch {
        if (!mounted) return;
        setIsAuthorized(false);
        router.replace("/admin-login?next=/admin");
      } finally {
        if (mounted) setIsChecking(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [router]);

  return { isChecking, isAuthorized };
}
