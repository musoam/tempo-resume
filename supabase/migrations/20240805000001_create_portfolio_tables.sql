-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  imageUrl TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  demoUrl TEXT,
  videoUrl TEXT,
  projectRole TEXT,
  year TEXT NOT NULL,
  category TEXT NOT NULL,
  images JSONB DEFAULT '[]',
  technologies JSONB DEFAULT '[]',
  displayType TEXT DEFAULT 'popup',
  slug TEXT,
  technicalDetails TEXT,
  projectChallenges TEXT,
  implementationDetails TEXT,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create site_settings table
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  owner_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  location TEXT,
  about TEXT NOT NULL,
  hero_title TEXT NOT NULL,
  hero_description TEXT NOT NULL,
  hero_image_url TEXT NOT NULL,
  social_links JSONB DEFAULT '[]',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create contact_submissions table
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Create policies for public access
DROP POLICY IF EXISTS "Public read access" ON projects;
CREATE POLICY "Public read access"
  ON projects FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Public read access" ON site_settings;
CREATE POLICY "Public read access"
  ON site_settings FOR SELECT
  USING (true);

-- Create policies for authenticated access
DROP POLICY IF EXISTS "Admin full access" ON projects;
CREATE POLICY "Admin full access"
  ON projects FOR ALL
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin full access" ON site_settings;
CREATE POLICY "Admin full access"
  ON site_settings FOR ALL
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Public insert access" ON contact_submissions;
CREATE POLICY "Public insert access"
  ON contact_submissions FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admin read access" ON contact_submissions;
CREATE POLICY "Admin read access"
  ON contact_submissions FOR SELECT
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin update access" ON contact_submissions;
CREATE POLICY "Admin update access"
  ON contact_submissions FOR UPDATE
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin delete access" ON contact_submissions;
CREATE POLICY "Admin delete access"
  ON contact_submissions FOR DELETE
  USING (auth.role() = 'authenticated');

-- Enable realtime for all tables
alter publication supabase_realtime add table projects;
alter publication supabase_realtime add table site_settings;
alter publication supabase_realtime add table contact_submissions;
