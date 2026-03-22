"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") || "/admin";

  const [form, setForm] = useState({ id: "", password: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!form.id.trim() || !form.password.trim()) {
      setError("Please enter both ID and password.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/admin-auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: form.id.trim(),
          password: form.password.trim(),
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.success) {
        setError(data.message || "Login failed.");
        return;
      }

      router.replace(nextPath);
      router.refresh();
    } catch {
      setError("Could not sign in. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-linear-to-b from-[#f3faf5] via-[#f8faf8] to-[#edf3ef] px-4 py-10">
      <section className="w-full max-w-md rounded-3xl border border-[#63c37a2b] bg-white/95 p-7 shadow-[0_20px_44px_rgba(17,24,39,0.12)]">
        <p className="inline-flex rounded-full border border-[#63c37a3d] bg-[#63c37a14] px-3 py-1 text-xs font-bold tracking-[0.16em] text-[#4a945c] uppercase">
          Secure Access
        </p>
        <h1 className="mt-3 font-serif text-3xl font-bold text-[#1d2238]">
          Admin Login
        </h1>
        <p className="mt-2 text-sm text-[#5f6879]">
          Enter admin ID and password to continue.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-semibold text-[#4f596e]">
              ID
            </label>
            <input
              type="text"
              value={form.id}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, id: event.target.value }))
              }
              className="w-full rounded-xl border border-[#d6dfd7] bg-white px-4 py-2.5 text-sm text-[#1d2238] outline-none transition focus:border-[#63c37a]"
              autoComplete="username"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-[#4f596e]">
              Password
            </label>
            <input
              type="password"
              value={form.password}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, password: event.target.value }))
              }
              className="w-full rounded-xl border border-[#d6dfd7] bg-white px-4 py-2.5 text-sm text-[#1d2238] outline-none transition focus:border-[#63c37a]"
              autoComplete="current-password"
              required
            />
          </div>

          {error && (
            <div className="rounded-xl border border-rose-300 bg-rose-50 px-3 py-2 text-sm text-rose-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex w-full items-center justify-center rounded-full bg-[#63c37a] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_10px_20px_rgba(99,195,122,0.32)] transition hover:-translate-y-px hover:bg-[#459557] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </section>
    </main>
  );
}
