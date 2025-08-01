-- Alternative: Add file columns directly to tickets table
ALTER TABLE public.tickets 
ADD COLUMN supporting_files text[] DEFAULT '{}',
ADD COLUMN file_count int4 DEFAULT 0;

-- Add constraint to ensure file_count matches array length
ALTER TABLE public.tickets 
ADD CONSTRAINT check_file_count 
CHECK (file_count = array_length(supporting_files, 1) OR (file_count = 0 AND supporting_files = '{}')); 