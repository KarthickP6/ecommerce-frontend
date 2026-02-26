-- Insert dummy furniture categories
INSERT INTO categories (name, description, image_url)
VALUES
    ('Living Room', 'Sofas, sectionals, coffee tables, and other living room furniture', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500'),
    ('Bedroom', 'Beds, mattresses, dressers, and bedroom storage furniture', 'https://images.unsplash.com/photo-1540932239986-310128078ceb?w=500'),
    ('Dining', 'Dining tables, chairs, and complete dining room sets', 'https://images.unsplash.com/photo-1611928482559-8b9ffe1e4b63?w=500'),
    ('Office', 'Desks, office chairs, filing cabinets, and workspace furniture', 'https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=500'),
    ('Kitchen', 'Kitchen islands, bar stools, pantry storage, and kitchen furniture', 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500'),
    ('Outdoor', 'Patio furniture, garden sets, outdoor benches, and deck furniture', 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=500'),
    ('Bathroom', 'Vanities, storage cabinets, and bathroom furniture', 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=500'),
    ('Kids', 'Beds, desks, dressers, and furniture for children rooms', 'https://images.unsplash.com/photo-1589939705066-5ec94a0f5e35?w=500'),
    ('Storage', 'Shelves, cabinets, bookcases, and storage solutions', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500'),
    ('Accent', 'Side tables, console tables, mirrors, and accent furniture', 'https://images.unsplash.com/photo-1578500494198-246f612d03b3?w=500')
ON CONFLICT (name) DO NOTHING;

