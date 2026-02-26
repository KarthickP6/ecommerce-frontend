-- Insert sample products for each category
INSERT INTO products (name, description, price, stock, rating, category_id, created_at)
SELECT
    'Modern Leather Sofa',
    'Premium leather sofa with comfortable seating for 3-4 people. Features high-density foam cushions and solid wood frame.',
    1299.99,
    15,
    4.5,
    (SELECT id FROM categories WHERE name = 'Living Room'),
    NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Modern Leather Sofa')

UNION ALL

SELECT
    'Minimalist Coffee Table',
    'Sleek coffee table with tempered glass top and wooden base. Perfect for modern living spaces.',
    299.99,
    25,
    4.3,
    (SELECT id FROM categories WHERE name = 'Living Room'),
    NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Minimalist Coffee Table')

UNION ALL

SELECT
    'Platform Bed Frame',
    'Sturdy platform bed frame available in multiple sizes. Made from solid wood with elegant design.',
    599.99,
    12,
    4.6,
    (SELECT id FROM categories WHERE name = 'Bedroom'),
    NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Platform Bed Frame')

UNION ALL

SELECT
    'Wooden Dresser',
    'Six-drawer wooden dresser with ample storage space. Features quality hardware and smooth drawers.',
    449.99,
    18,
    4.4,
    (SELECT id FROM categories WHERE name = 'Bedroom'),
    NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Wooden Dresser')

UNION ALL

SELECT
    'Extendable Dining Table',
    'Modern dining table that extends from 4 to 6 seats. Perfect for families and entertaining guests.',
    799.99,
    10,
    4.7,
    (SELECT id FROM categories WHERE name = 'Dining'),
    NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Extendable Dining Table')

UNION ALL

SELECT
    'Dining Chairs Set',
    'Set of 4 comfortable dining chairs with padded seats. Designed to match modern dining tables.',
    399.99,
    20,
    4.5,
    (SELECT id FROM categories WHERE name = 'Dining'),
    NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Dining Chairs Set')

UNION ALL

SELECT
    'Executive Office Desk',
    'Large office desk with multiple drawers and cable management. Ideal for productive workspaces.',
    649.99,
    8,
    4.6,
    (SELECT id FROM categories WHERE name = 'Office'),
    NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Executive Office Desk')

UNION ALL

SELECT
    'Ergonomic Office Chair',
    'Premium ergonomic chair with lumbar support and adjustable height. Promotes healthy posture.',
    499.99,
    14,
    4.8,
    (SELECT id FROM categories WHERE name = 'Office'),
    NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Ergonomic Office Chair')

UNION ALL

SELECT
    'Kitchen Island Cart',
    'Mobile kitchen island with stainless steel top and storage drawers. Perfect for small kitchens.',
    349.99,
    16,
    4.4,
    (SELECT id FROM categories WHERE name = 'Kitchen'),
    NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Kitchen Island Cart')

UNION ALL

SELECT
    'Bar Stool Set',
    'Set of 2 adjustable bar stools with comfortable seating. Great for kitchen counters.',
    249.99,
    22,
    4.3,
    (SELECT id FROM categories WHERE name = 'Kitchen'),
    NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Bar Stool Set')

UNION ALL

SELECT
    'Patio Dining Set',
    '7-piece outdoor dining set with umbrella. Weather-resistant materials for durability.',
    1099.99,
    6,
    4.6,
    (SELECT id FROM categories WHERE name = 'Outdoor'),
    NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Patio Dining Set')

UNION ALL

SELECT
    'Garden Lounge Chair',
    'Comfortable outdoor lounge chair with cushions. Perfect for relaxing in the garden.',
    299.99,
    18,
    4.5,
    (SELECT id FROM categories WHERE name = 'Outdoor'),
    NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Garden Lounge Chair')

UNION ALL

SELECT
    'Bathroom Vanity Cabinet',
    'Modern vanity cabinet with sink and faucet. Includes ample storage for bathroom essentials.',
    699.99,
    9,
    4.4,
    (SELECT id FROM categories WHERE name = 'Bathroom'),
    NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Bathroom Vanity Cabinet')

UNION ALL

SELECT
    'Bathroom Mirror Cabinet',
    'Mirrored cabinet for bathroom walls. Provides storage while serving as a mirror.',
    199.99,
    20,
    4.2,
    (SELECT id FROM categories WHERE name = 'Bathroom'),
    NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Bathroom Mirror Cabinet')

UNION ALL

SELECT
    'Kids Bed with Storage',
    'Fun and functional kids bed with built-in storage drawers. Available in different colors.',
    449.99,
    14,
    4.7,
    (SELECT id FROM categories WHERE name = 'Kids'),
    NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Kids Bed with Storage')

UNION ALL

SELECT
    'Kids Study Desk',
    'Adjustable kids desk perfect for studying and creativity. Grows with your child.',
    199.99,
    17,
    4.5,
    (SELECT id FROM categories WHERE name = 'Kids'),
    NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Kids Study Desk')

UNION ALL

SELECT
    'Wall Shelving Unit',
    'Modern wall-mounted shelving system. Ideal for displaying books and decorative items.',
    279.99,
    19,
    4.6,
    (SELECT id FROM categories WHERE name = 'Storage'),
    NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Wall Shelving Unit')

UNION ALL

SELECT
    'Storage Cabinet',
    'Large storage cabinet with adjustable shelves. Perfect for organizing any room.',
    549.99,
    11,
    4.5,
    (SELECT id FROM categories WHERE name = 'Storage'),
    NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Storage Cabinet')

UNION ALL

SELECT
    'Side Table',
    'Elegant side table with drawer storage. Complements any living room decor.',
    149.99,
    25,
    4.4,
    (SELECT id FROM categories WHERE name = 'Accent'),
    NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Side Table')

UNION ALL

SELECT
    'Console Table',
    'Beautiful console table perfect for entryways. Features a sleek design and sturdy construction.',
    349.99,
    13,
    4.6,
    (SELECT id FROM categories WHERE name = 'Accent'),
    NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Console Table');

