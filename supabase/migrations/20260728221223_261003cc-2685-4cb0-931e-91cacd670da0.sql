CREATE TYPE public.app_role AS ENUM ('admin','user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE OR REPLACE FUNCTION public.grant_first_user_admin()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin');
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created_grant_admin
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.grant_first_user_admin();

CREATE TABLE public.portfolio_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  category text NOT NULL DEFAULT 'Other',
  client text,
  thumbnail_url text NOT NULL DEFAULT '',
  video_url text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.portfolio_items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.portfolio_items TO authenticated;
GRANT ALL ON public.portfolio_items TO service_role;
ALTER TABLE public.portfolio_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published items are public" ON public.portfolio_items FOR SELECT TO anon, authenticated USING (published = true);
CREATE POLICY "Admins can read all items" ON public.portfolio_items FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins can insert items" ON public.portfolio_items FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins can update items" ON public.portfolio_items FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins can delete items" ON public.portfolio_items FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER portfolio_items_updated_at BEFORE UPDATE ON public.portfolio_items
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.portfolio_items (title, category, client, thumbnail_url, video_url, sort_order, published) VALUES
('Midnight Raid — Full Gameplay Edit','Gameplay','@nightowl','https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=70','https://www.youtube.com/watch?v=dQw4w9WgXcQ',1,true),
('The Algorithm Ate My Brain','Documentary','Signal Nine','https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=70','https://www.youtube.com/watch?v=dQw4w9WgXcQ',2,true),
('Studio Talk: Building an Audience','Talking Head','Maya R.','https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=800&q=70','https://www.youtube.com/watch?v=dQw4w9WgXcQ',3,true),
('60 Seconds of Pure Chaos','Shorts','@clipfarm','https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=800&q=70','https://www.youtube.com/watch?v=dQw4w9WgXcQ',4,true),
('Ranked Grind — Season Finale','Gameplay','@apexlow','https://images.unsplash.com/photo-1560253023-3ec5d502959f?auto=format&fit=crop&w=800&q=70','https://www.youtube.com/watch?v=dQw4w9WgXcQ',5,true),
('Deep Blue: An Ocean Story','Documentary','Blue Frame','https://images.unsplash.com/photo-1439405326854-014607f694d7?auto=format&fit=crop&w=800&q=70','https://www.youtube.com/watch?v=dQw4w9WgXcQ',6,true);