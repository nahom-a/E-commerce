INSERT INTO users (id, name, email, password_hash, role, created_at) VALUES
(1, 'Admin User', 'admin@dispatchdesk.local', '$2a$10$8K1p/a0d3vL5w5W5x5x5UeG5y5F5z5J5K5L5M5N5O5P5Q5R5S5T5U5V5W5X5Y5Z5a5b5c5d', 'ADMIN', NOW()),
(2, 'Dispatcher User', 'dispatcher@dispatchdesk.local', '$2a$10$8K1p/a0d3vL5w5W5x5x5UeG5y5F5z5J5K5L5M5N5O5P5Q5R5S5T5U5V5W5X5Y5Z5a5b5c5d', 'DISPATCHER', NOW()),
(3, 'Driver One', 'driver1@dispatchdesk.local', '$2a$10$8K1p/a0d3vL5w5W5x5x5UeG5y5F5z5J5K5L5M5N5O5P5Q5R5S5T5U5V5W5X5Y5Z5a5b5c5d', 'DRIVER', NOW()),
(4, 'Driver Two', 'driver2@dispatchdesk.local', '$2a$10$8K1p/a0d3vL5w5W5x5x5UeG5y5F5z5J5K5L5M5N5O5P5Q5R5S5T5U5V5W5X5Y5Z5a5b5c5d', 'DRIVER', NOW());

INSERT INTO customers (id, name, contact_person, phone, email, address, notes, created_at) VALUES
(1, 'Mekdes Cafe', 'Mekdes Tadesse', '+251911123456', 'mekdes@cafe.et', 'Bole, Addis Ababa', 'Regular customer since 2023', NOW()),
(2, 'Kazanchis Bakery', 'Haile Kazanchis', '+251912123456', 'haile@bakery.et', 'Kazanchis, Addis Ababa', 'Daily bread deliveries', NOW()),
(3, 'CMC Electronics', 'CMC Admin', '+251913123456', 'admin@cmc.et', 'CMC, Addis Ababa', 'Electronic components', NOW()),
(4, 'Saris Textiles', 'Tigist Saris', '+251914123456', 'tigst@saris.et', 'Saris, Addis Ababa', 'Fabric shipments', NOW()),
(5, 'Gerji Logistics', 'Abebe Gerji', '+251915123456', 'abebe@gerji.et', 'Gerji, Addis Ababa', 'Logistics partner', NOW()),
(6, 'Piassa Trading', 'Elias Piassa', '+251916123456', 'elias@piassa.et', 'Piassa, Addis Ababa', 'Wholesale goods', NOW()),
(7, 'Megenagna Pharma', 'Sara Megenagna', '+251917123456', 'sara@megenagna.et', 'Megenagna, Addis Ababa', 'Pharmaceutical supplies', NOW()),
(8, 'Yeka Market', 'Yonas Yeka', '+251918123456', 'yonas@yeka.et', 'Yeka, Addis Ababa', 'Fresh produce', NOW()),
(9, 'Mexico Imports', 'Carlos Mexico', '+251919123456', 'carlos@mexico.et', 'Mexico, Addis Ababa', 'Import goods', NOW()),
(10, 'Old Airport Supplies', 'Bereket OldAir', '+251920123456', 'bereket@oldair.et', 'Old Airport, Addis Ababa', 'Industrial supplies', NOW());

INSERT INTO drivers (id, user_id, phone, vehicle, license_number, status, created_at) VALUES
(1, 3, '+251911111111', 'Toyota HiAce', 'DL-001', 'AVAILABLE', NOW()),
(2, 4, '+251912222222', 'Mitsubishi L300', 'DL-002', 'AVAILABLE', NOW()),
(3, 1, '+251913333333', 'Isuzu NPR', 'DL-003', 'ON_DELIVERY', NOW()),
(4, 2, '+251914444444', 'Hino Dutro', 'DL-004', 'OFFLINE', NOW()),
(5, 1, '+251915555555', 'Isuzu Forward', 'DL-005', 'AVAILABLE', NOW());