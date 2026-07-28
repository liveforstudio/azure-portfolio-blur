import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Database } from "@/integrations/supabase/types";

export type PortfolioItem = {
  id: string;
  title: string;
  category: string;
  client: string | null;
  thumbnail_url: string;
  video_url: string;
  sort_order: number;
  published: boolean;
};

const itemSchema = z.object({
  title: z.string().min(1).max(160),
  category: z.string().min(1).max(60),
  client: z.string().max(80).nullable().optional(),
  thumbnail_url: z.string().max(600),
  video_url: z.string().max(600),
  sort_order: z.number().int().min(0).max(9999),
  published: z.boolean(),
});

function publicClient() {
  const key = process.env.SUPABASE_PUBLISHABLE_KEY!;
  return createClient<Database>(process.env.SUPABASE_URL!, key, {
    auth: { persistSession: false, autoRefreshToken: false, storage: undefined },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) {
          h.delete("Authorization");
        }
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

export const listPublicPortfolio = createServerFn({ method: "GET" }).handler(
  async (): Promise<PortfolioItem[]> => {
    const { data, error } = await publicClient()
      .from("portfolio_items")
      .select("id, title, category, client, thumbnail_url, video_url, sort_order, published")
      .eq("published", true)
      .order("sort_order", { ascending: true });
    if (error) {
      console.error("[portfolio] public read failed", error.message);
      return [];
    }
    return data ?? [];
  },
);

export const listAllPortfolio = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<PortfolioItem[]> => {
    const { data, error } = await context.supabase
      .from("portfolio_items")
      .select("id, title, category, client, thumbnail_url, video_url, sort_order, published")
      .order("sort_order", { ascending: true });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const isAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    return Boolean(data);
  });

export const upsertPortfolioItem = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    itemSchema.extend({ id: z.string().uuid().optional() }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { id, ...values } = data;
    const payload = { ...values, client: values.client ?? null };
    const query = id
      ? context.supabase.from("portfolio_items").update(payload).eq("id", id)
      : context.supabase.from("portfolio_items").insert(payload);
    const { error } = await query;
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deletePortfolioItem = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("portfolio_items")
      .delete()
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
