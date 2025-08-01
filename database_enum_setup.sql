-- Create the ticket category enum
CREATE TYPE ticket_category_enum AS ENUM (
    'Computer & Equipment',
    'Network & Internet', 
    'Station',
    'Surroundings',
    'Schedule',
    'Compensation',
    'Transport',
    'Suggestion',
    'Check-in'
);

-- Create the ticket status enum
CREATE TYPE ticket_status_enum AS ENUM (
    'For Approval',
    'On Hold',
    'In Progress',
    'Approved',
    'Stuck',
    'Actioned',
    'Closed'
);

-- If the tickets table already exists, you may need to alter the category column
-- ALTER TABLE tickets ALTER COLUMN category TYPE ticket_category_enum USING category::ticket_category_enum; 