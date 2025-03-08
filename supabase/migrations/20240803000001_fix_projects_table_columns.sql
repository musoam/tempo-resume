-- Fix column names to match the expected format
ALTER TABLE IF EXISTS projects
RENAME COLUMN "technicaldetails" TO "technicalDetails";

ALTER TABLE IF EXISTS projects
RENAME COLUMN "projectchallenges" TO "projectChallenges";

ALTER TABLE IF EXISTS projects
RENAME COLUMN "implementationdetails" TO "implementationDetails";

-- Add missing columns if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'projectRole') THEN
        ALTER TABLE projects ADD COLUMN "projectRole" TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'videoUrl') THEN
        ALTER TABLE projects ADD COLUMN "videoUrl" TEXT;
    END IF;
END
$$;

-- Enable realtime for projects table
ALTER PUBLICATION supabase_realtime ADD TABLE projects;
