-- Insert ticket categories into the ticket_categories table
INSERT INTO public.ticket_categories (id, name) VALUES
(1, 'Computer & Equipment'),
(2, 'Network & Internet'),
(3, 'Station'),
(4, 'Surroundings'),
(5, 'Schedule'),
(6, 'Compensation'),
(7, 'Transport'),
(8, 'Suggestion'),
(9, 'Check-in')
ON CONFLICT (name) DO NOTHING; 