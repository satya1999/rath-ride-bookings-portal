
-- Add address field to agents table
ALTER TABLE public.agents ADD COLUMN IF NOT EXISTS address TEXT;

-- Update existing records to have null addresses
-- (This is optional, since new columns are NULL by default)
-- UPDATE public.agents SET address = NULL WHERE address IS NULL;
