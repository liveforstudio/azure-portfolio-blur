import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  deletePortfolioItem,
  isAdmin,
  listAllPortfolio,
  upsertPortfolioItem,
  type PortfolioItem,
} from "@/lib/portfolio.functions";

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminPage,
});

const empty = {
  title: "",
  category: "Gameplay",
  client: "",
  thumbnail_url: "",
  video_url: "",
  sort_order: 0,
  published: true,
};

type FormState = typeof empty & { id?: string };

function AdminPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const fetchAll = useServerFn(listAllPortfolio);
  const checkAdmin = useServerFn(isAdmin);
  const save = useServerFn(upsertPortfolioItem);
  const remove = useServerFn(deletePortfolioItem);

  const [form, setForm] = useState<FormState>({ ...empty });
  const [error, setError] = useState<string | null>(null);

  const admin = useQuery({ queryKey: ["is-admin"], queryFn: () => checkAdmin() });
  const items = useQuery({
    queryKey: ["portfolio", "all"],
    queryFn: () => fetchAll(),
    enabled: admin.data === true,
  });

  const saveMutation = useMutation({
    mutationFn: (values: FormState) =>
      save({
        data: {
          ...values,
          client: values.client?.trim() ? values.client : null,
          sort_order: Number(values.sort_order) || 0,
        },
      }),
    onSuccess: () => {
      setForm({ ...empty });
      setError(null);
      queryClient.invalidateQueries({ queryKey: ["portfolio"] });
    },
    onError: (e: Error) => setError(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => remove({ data: { id } }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["portfolio"] }),
    onError: (e: Error) => setError(e.message),
  });

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  function edit(item: PortfolioItem) {
    setForm({
      id: item.id,
      title: item.title,
      category: item.category,
      client: item.client ?? "",
      thumbnail_url: item.thumbnail_url,
      video_url: item.video_url,
      sort_order: item.sort_order,
      published: item.published,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (admin.isLoading) {
    return <p className="p-12 text-sm text-muted-foreground">Loading…</p>;
  }

  if (admin.data !== true) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
        <h1 className="text-2xl font-semibold">No studio access</h1>
        <p className="max-w-sm text-sm text-muted-foreground">
          This account isn&apos;t an admin. The first account created on this site becomes the
          studio admin.
        </p>
        <button onClick={signOut} className="text-xs text-primary hover:underline">
          Sign out
        </button>
      </div>
    );
  }

  const field =
    "mt-2 w-full rounded-xl border border-glass-border bg-input/40 px-4 py-2.5 text-sm outline-none focus:border-primary";

  return (
    <div className="min-h-screen bg-background px-5 py-14 lg:px-12">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
              Live For Studio
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">Portfolio manager</h1>
          </div>
          <div className="flex gap-3">
            <a href="/" className="glass rounded-full px-5 py-2.5 text-xs text-muted-foreground">
              View site
            </a>
            <button
              onClick={signOut}
              className="glass rounded-full px-5 py-2.5 text-xs text-muted-foreground hover:text-foreground"
            >
              Sign out
            </button>
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            saveMutation.mutate(form);
          }}
          className="glass mt-10 rounded-3xl p-7"
        >
          <h2 className="text-lg font-medium">{form.id ? "Edit item" : "New item"}</h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div>
              <label className="text-xs text-muted-foreground">Title</label>
              <input
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className={field}
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Category</label>
              <input
                required
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className={field}
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Client (optional)</label>
              <input
                value={form.client}
                onChange={(e) => setForm({ ...form, client: e.target.value })}
                className={field}
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Sort order</label>
              <input
                type="number"
                value={form.sort_order}
                onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
                className={field}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs text-muted-foreground">Thumbnail URL</label>
              <input
                value={form.thumbnail_url}
                onChange={(e) => setForm({ ...form, thumbnail_url: e.target.value })}
                className={field}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs text-muted-foreground">Video URL (YouTube / Vimeo)</label>
              <input
                value={form.video_url}
                onChange={(e) => setForm({ ...form, video_url: e.target.value })}
                className={field}
              />
            </div>
          </div>

          <label className="mt-5 flex items-center gap-3 text-xs text-muted-foreground">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) => setForm({ ...form, published: e.target.checked })}
            />
            Published
          </label>

          <div className="mt-7 flex gap-3">
            <button
              type="submit"
              disabled={saveMutation.isPending}
              className="rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-60"
            >
              {saveMutation.isPending ? "Saving…" : form.id ? "Save changes" : "Add item"}
            </button>
            {form.id ? (
              <button
                type="button"
                onClick={() => setForm({ ...empty })}
                className="rounded-full px-5 py-2.5 text-sm text-muted-foreground hover:text-foreground"
              >
                Cancel
              </button>
            ) : null}
          </div>

          {error ? <p className="mt-4 text-xs text-destructive">{error}</p> : null}
        </form>

        <div className="mt-10 space-y-3">
          {(items.data ?? []).map((item) => (
            <div
              key={item.id}
              className="glass flex flex-wrap items-center justify-between gap-4 rounded-2xl px-5 py-4"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{item.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {item.category} · #{item.sort_order} · {item.published ? "Published" : "Hidden"}
                </p>
              </div>
              <div className="flex gap-3 text-xs">
                <button onClick={() => edit(item)} className="text-primary hover:underline">
                  Edit
                </button>
                <button
                  onClick={() => deleteMutation.mutate(item.id)}
                  className="text-destructive hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
