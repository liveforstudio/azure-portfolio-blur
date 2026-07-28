import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Studio Login — Live For Studio" },
      { name: "description", content: "Private login for the Live For Studio portfolio manager." },
      { property: "og:title", content: "Studio Login — Live For Studio" },
      { property: "og:description", content: "Private login for the Live For Studio portfolio manager." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin", replace: true });
    });
  }, [navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMessage(null);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin + "/admin" },
        });
        if (error) throw error;
        setMessage("Account created. If confirmation is required, check your inbox.");
        const { data } = await supabase.auth.getSession();
        if (data.session) navigate({ to: "/admin", replace: true });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: "/admin", replace: true });
      }
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-5">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/4 h-[420px] w-[620px] -translate-x-1/2 rounded-full bg-primary/25 blur-[150px]"
      />
      <form onSubmit={handleSubmit} className="glass-strong relative w-full max-w-sm rounded-3xl p-8">
        <p className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
          Live For Studio
        </p>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight">
          {mode === "signin" ? "Studio login" : "Create studio account"}
        </h1>

        <label className="mt-7 block text-xs text-muted-foreground" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-2 w-full rounded-xl border border-glass-border bg-input/40 px-4 py-2.5 text-sm outline-none focus:border-primary"
        />

        <label className="mt-4 block text-xs text-muted-foreground" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-2 w-full rounded-xl border border-glass-border bg-input/40 px-4 py-2.5 text-sm outline-none focus:border-primary"
        />

        <button
          type="submit"
          disabled={busy}
          className="mt-7 w-full rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity disabled:opacity-60"
        >
          {busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Sign up"}
        </button>

        {message ? <p className="mt-4 text-xs text-muted-foreground">{message}</p> : null}

        <button
          type="button"
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="mt-5 w-full text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          {mode === "signin" ? "Need an account? Sign up" : "Already have an account? Sign in"}
        </button>
      </form>
    </div>
  );
}
