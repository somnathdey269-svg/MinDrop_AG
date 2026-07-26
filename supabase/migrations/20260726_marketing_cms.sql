-- Migration: Marketing CMS pages and dynamic block storage
CREATE TABLE IF NOT EXISTS public.marketing_pages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  page_name TEXT NOT NULL,
  meta_title TEXT,
  meta_description TEXT,
  blocks JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_published BOOLEAN NOT NULL DEFAULT true,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by UUID
);

-- Index for fast lookup by slug
CREATE INDEX IF NOT EXISTS idx_marketing_pages_slug ON public.marketing_pages(slug);

-- Enable RLS
ALTER TABLE public.marketing_pages ENABLE ROW LEVEL SECURITY;

-- Policy: Public read for published marketing pages
CREATE POLICY "Public read marketing pages" ON public.marketing_pages
  FOR SELECT USING (is_published = true);

-- Policy: Superadmin full access
CREATE POLICY "Superadmin full access marketing pages" ON public.marketing_pages
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_roles.user_id = auth.uid()
        AND user_roles.role = 'superadmin'
    )
  );
