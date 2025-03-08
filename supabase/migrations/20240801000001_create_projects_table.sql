-- Create projects table if it doesn't exist
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable realtime for the projects table
alter publication supabase_realtime add table projects;

-- Create index on slug for faster lookups
CREATE INDEX IF NOT EXISTS projects_slug_idx ON projects (slug);

-- Create index on category for faster filtering
CREATE INDEX IF NOT EXISTS projects_category_idx ON projects (category);