
CREATE TABLE public.country_themes (
  code text PRIMARY KEY,
  name text NOT NULL,
  colors jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid,
  CONSTRAINT country_themes_code_upper CHECK (code = upper(code) AND length(code) = 2),
  CONSTRAINT country_themes_colors_shape CHECK (
    jsonb_typeof(colors) = 'array'
    AND jsonb_array_length(colors) BETWEEN 1 AND 3
  )
);

GRANT SELECT ON public.country_themes TO anon, authenticated;
GRANT ALL ON public.country_themes TO service_role;

ALTER TABLE public.country_themes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Country themes are public read"
  ON public.country_themes FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Superadmins can write country themes"
  ON public.country_themes FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'superadmin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'superadmin'::app_role));

INSERT INTO public.country_themes (code, name, colors) VALUES
  ('IN', 'India',          '["#FF671F","#046A38","#06038D"]'::jsonb),
  ('US', 'United States',  '["#B31942","#0A3161"]'::jsonb),
  ('GB', 'United Kingdom', '["#012169","#C8102E"]'::jsonb),
  ('JP', 'Japan',          '["#BC002D"]'::jsonb),
  ('FR', 'France',         '["#002395","#ED2939"]'::jsonb),
  ('DE', 'Germany',        '["#000000","#DD0000","#FFCE00"]'::jsonb),
  ('BR', 'Brazil',         '["#009C3B","#FFDF00","#002776"]'::jsonb),
  ('CA', 'Canada',         '["#FF0000"]'::jsonb),
  ('AU', 'Australia',      '["#012169","#E4002B"]'::jsonb),
  ('NZ', 'New Zealand',    '["#012169","#C8102E"]'::jsonb),
  ('ZA', 'South Africa',   '["#007A4D","#FFB612","#DE3831"]'::jsonb),
  ('MX', 'Mexico',         '["#006847","#CE1126"]'::jsonb),
  ('AR', 'Argentina',      '["#74ACDF","#F6B40E"]'::jsonb),
  ('IT', 'Italy',          '["#008C45","#CD212A"]'::jsonb),
  ('ES', 'Spain',          '["#AA151B","#F1BF00"]'::jsonb),
  ('NL', 'Netherlands',    '["#AE1C28","#21468B"]'::jsonb),
  ('SE', 'Sweden',         '["#006AA7","#FECC00"]'::jsonb),
  ('NO', 'Norway',         '["#EF2B2D","#002868"]'::jsonb),
  ('FI', 'Finland',        '["#003580"]'::jsonb),
  ('DK', 'Denmark',        '["#C60C30"]'::jsonb),
  ('IE', 'Ireland',        '["#169B62","#FF883E"]'::jsonb),
  ('PT', 'Portugal',       '["#046A38","#DA291C","#FFE900"]'::jsonb),
  ('GR', 'Greece',         '["#0D5EAF"]'::jsonb),
  ('TR', 'Turkey',         '["#E30A17"]'::jsonb),
  ('RU', 'Russia',         '["#0033A0","#D52B1E"]'::jsonb),
  ('UA', 'Ukraine',        '["#0057B7","#FFDD00"]'::jsonb),
  ('PL', 'Poland',         '["#DC143C"]'::jsonb),
  ('CN', 'China',          '["#EE1C25","#FFFF00"]'::jsonb),
  ('KR', 'South Korea',    '["#003478","#C60C30"]'::jsonb),
  ('SG', 'Singapore',      '["#EF3340"]'::jsonb),
  ('MY', 'Malaysia',       '["#010066","#CC0001","#FFCC00"]'::jsonb),
  ('TH', 'Thailand',       '["#A51931","#F4F5F8","#2D2A4A"]'::jsonb),
  ('VN', 'Vietnam',        '["#DA251D","#FFFF00"]'::jsonb),
  ('ID', 'Indonesia',      '["#FF0000"]'::jsonb),
  ('PH', 'Philippines',    '["#0038A8","#CE1126","#FCD116"]'::jsonb),
  ('PK', 'Pakistan',       '["#01411C","#FFFFFF"]'::jsonb),
  ('BD', 'Bangladesh',     '["#006A4E","#F42A41"]'::jsonb),
  ('LK', 'Sri Lanka',      '["#8D153A","#FFBE29","#00534E"]'::jsonb),
  ('NP', 'Nepal',          '["#DC143C","#003893"]'::jsonb),
  ('AE', 'United Arab Emirates', '["#00732F","#FF0000","#000000"]'::jsonb),
  ('SA', 'Saudi Arabia',   '["#006C35"]'::jsonb),
  ('EG', 'Egypt',          '["#CE1126","#000000","#C09300"]'::jsonb),
  ('NG', 'Nigeria',        '["#008751"]'::jsonb),
  ('KE', 'Kenya',          '["#000000","#BB0000","#006600"]'::jsonb),
  ('GH', 'Ghana',          '["#CE1126","#FCD116","#006B3F"]'::jsonb),
  ('CH', 'Switzerland',    '["#DA291C"]'::jsonb),
  ('BE', 'Belgium',        '["#000000","#FDDA24","#EF3340"]'::jsonb),
  ('AT', 'Austria',        '["#ED2939"]'::jsonb),
  ('CZ', 'Czechia',        '["#11457E","#D7141A"]'::jsonb),
  ('IL', 'Israel',         '["#0038B8"]'::jsonb);
