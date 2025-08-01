-- Create ticket_files table to store file information
CREATE TABLE public.ticket_files (
    id serial4 NOT NULL,
    ticket_id int4 NOT NULL,
    file_name text NOT NULL,
    file_path text NOT NULL,
    file_size int4 NOT NULL,
    file_type text NOT NULL,
    uploaded_by int4 NOT NULL,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT ticket_files_pkey PRIMARY KEY (id),
    CONSTRAINT ticket_files_ticket_id_fkey FOREIGN KEY (ticket_id) REFERENCES public.tickets(id) ON DELETE CASCADE,
    CONSTRAINT ticket_files_uploaded_by_fkey FOREIGN KEY (uploaded_by) REFERENCES public.users(id) ON DELETE CASCADE
);

-- Add trigger to update updated_at
CREATE TRIGGER update_ticket_files_updated_at 
    BEFORE UPDATE ON public.ticket_files 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add index for better performance
CREATE INDEX idx_ticket_files_ticket_id ON public.ticket_files(ticket_id);
CREATE INDEX idx_ticket_files_uploaded_by ON public.ticket_files(uploaded_by); 