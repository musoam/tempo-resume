-- Fix the projects table structure to ensure all fields are properly defined

-- First, ensure the projects table exists
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  imageUrl TEXT,
  tags TEXT[] DEFAULT '{}',
  demoUrl TEXT,
  videoUrl TEXT,
  projectRole TEXT,
  year TEXT,
  category TEXT,
  images JSONB DEFAULT '[]',
  technologies JSONB DEFAULT '[]',
  displayType TEXT DEFAULT 'popup',
  slug TEXT,
  technicalDetails TEXT,
  projectChallenges TEXT,
  implementationDetails TEXT,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS but with a permissive policy
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Create policies for public access
DROP POLICY IF EXISTS "Allow public read access" ON projects;
CREATE POLICY "Allow public read access"
  ON projects FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Allow authenticated insert" ON projects;
CREATE POLICY "Allow authenticated insert"
  ON projects FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated update" ON projects;
CREATE POLICY "Allow authenticated update"
  ON projects FOR UPDATE
  USING (true);

DROP POLICY IF EXISTS "Allow authenticated delete" ON projects;
CREATE POLICY "Allow authenticated delete"
  ON projects FOR DELETE
  USING (true);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE projects;