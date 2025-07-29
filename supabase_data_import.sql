-- Data Import for Supabase
-- This file contains all the data from the original database

-- Insert Announcements
INSERT INTO public.announcements (id, title, body, image_url, show_until, is_active, site, created_at, sites) VALUES
(1, 'Welcome to CalmKaaj', 'Welcome to your new coworking space! Enjoy our facilities and services.', NULL, NULL, true, 'blue_area', '2025-07-05 16:28:31.399773', ARRAY['blue_area']),
(5, 'efwe', 'rgf3erogfj3refg3r', '', '2025-07-05 19:05:00', true, 'blue_area', '2025-07-06 11:05:22.950913', ARRAY['blue_area','i_10']),
(6, 'WORLD BUILDING WASSSSSSSUP', 'HHFFWEFEWFWEF', 'https://t3.ftcdn.net/jpg/02/09/65/14/360_F_209651427_Moux8Hkey15wtMbtLymbPPrdrLhm58fH.jpg', '2025-07-06 11:00:00', true, 'blue_area', '2025-07-06 11:21:37.750637', ARRAY['blue_area','i_10']),
(7, 'WASSSSUP', 'FRIENDS', 'https://cdn-icons-png.flaticon.com/512/6028/6028690.png', '2025-07-06 11:30:00', true, 'blue_area', '2025-07-06 11:29:25.960594', ARRAY['blue_area','i_10']),
(8, 'HELLO WORLD', 'FRIENDS', 'https://cdn-icons-png.flaticon.com/512/6028/6028690.png', '2025-07-06 11:32:00', true, 'blue_area', '2025-07-06 11:30:30.777845', ARRAY['blue_area','i_10']),
(9, 'HELLO', 'HELLO', 'https://cdn-icons-png.flaticon.com/512/6028/6028690.png', '2025-07-06 16:35:00', true, 'blue_area', '2025-07-06 11:33:53.881194', ARRAY['blue_area','i_10']),
(10, 'WASSSUP GANG', 'WADQWDWQD', 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/12/0e/ec/2f/outdoor-sitting-area.jpg?w=600&h=400&s=1', '2025-07-07 19:57:00', true, 'blue_area', '2025-07-07 12:55:18.238077', ARRAY['i_10']);

-- Insert Menu Categories
INSERT INTO public.menu_categories (id, name, description, is_active, site) VALUES
(1, 'Beverages', 'Hot and cold drinks', true, 'blue_area'),
(2, 'Snacks', 'Light bites and snacks', true, 'blue_area'),
(3, 'Meals', 'Full meals and lunch items', true, 'blue_area'),
(4, 'Beverages', 'Hot and cold drinks', true, 'blue_area'),
(5, 'Snacks', 'Light snacks and appetizers', true, 'blue_area'),
(6, 'Meals', 'Full meals and main dishes', true, 'blue_area'),
(7, 'Desserts', 'Sweet treats and desserts', true, 'blue_area'),
(8, 'Coffee & Tea', 'Premium coffee and tea selection', true, 'i_10'),
(9, 'Light Bites', 'Quick snacks and finger foods', true, 'i_10'),
(10, 'Lunch Items', 'Hearty lunch options', true, 'i_10'),
(11, 'Sweets', 'Cakes and sweet treats', true, 'i_10');

-- Insert Menu Items
INSERT INTO public.menu_items (id, name, description, price, category_id, is_active, site, created_at) VALUES
(1, 'Cappuccino', 'Freshly brewed cappuccino', 4.50, 1, true, 'blue_area', '2025-07-05 16:28:31.263323'),
(2, 'Green Tea', 'Organic green tea', 3.00, 1, true, 'blue_area', '2025-07-05 16:28:31.263323'),
(3, 'Chicken Sandwich', 'Grilled chicken sandwich with fresh vegetables', 8.50, 3, true, 'blue_area', '2025-07-05 16:28:31.263323'),
(4, 'Fruit Salad', 'Fresh seasonal fruit salad', 6.00, 2, true, 'blue_area', '2025-07-05 16:28:31.263323'),
(5, 'Espresso', 'Double shot espresso', 3.50, 1, true, 'i_10', '2025-07-05 16:28:31.263323'),
(6, 'Lays Slated', 'Chips that are nice', 200.00, NULL, true, 'blue_area', '2025-07-05 21:29:59.090594'),
(7, 'LATTE', 'FEAFEW', 55000.00, NULL, true, 'blue_area', '2025-07-07 12:53:31.35627'),
(8, 'Cappuccino', 'Rich espresso with steamed milk', 250.00, 1, false, 'i_10', '2025-07-08 23:57:29.773072'),
(9, 'Latte', 'Smooth espresso with steamed milk', 280.00, 1, true, 'blue_area', '2025-07-08 23:57:29.773072'),
(10, 'Green Tea', 'Organic green tea', 150.00, 1, true, 'i_10', '2025-07-08 23:57:29.773072'),
(11, 'Chicken Sandwich', 'Grilled chicken with fresh vegetables', 450.00, 2, true, 'blue_area', '2025-07-08 23:57:29.773072'),
(12, 'Apple tart', 'Fresh seasonal fruit salad', 500.00, 2, true, 'i_10', '2025-07-08 23:57:29.773072'),
(13, 'Samosa', 'Crispy vegetable samosa', 80.00, 2, true, 'blue_area', '2025-07-08 23:57:29.773072'),
(14, 'Apple tart', 'Sweet', 500.00, 2, true, 'blue_area', '2025-07-08 23:57:29.773072'),
(15, 'Pasta', 'Creamy chicken alfredo pasta', 550.00, 3, true, 'blue_area', '2025-07-08 23:57:29.773072'),
(16, 'Chocolate Cake', 'Rich chocolate cake slice', 350.00, 4, true, 'blue_area', '2025-07-08 23:57:29.773072'),
(17, 'Ice Cream', 'Vanilla ice cream scoop', 150.00, 4, true, 'blue_area', '2025-07-08 23:57:29.773072'),
(18, 'Espresso', 'Strong Italian espresso', 200.00, 5, true, 'i_10', '2025-07-08 23:57:34.878637'),
(19, 'Chai Latte', 'Spiced chai with steamed milk', 220.00, 5, true, 'i_10', '2025-07-08 23:57:34.878637'),
(20, 'Cold Brew', 'Smooth cold brew coffee', 280.00, 5, true, 'i_10', '2025-07-08 23:57:34.878637'),
(21, 'Club Sandwich', 'Triple layer club sandwich', 480.00, 6, true, 'i_10', '2025-07-08 23:57:34.878637'),
(22, 'Wrap', 'Chicken caesar wrap', 350.00, 6, true, 'i_10', '2025-07-08 23:57:34.878637'),
(23, 'Nachos', 'Loaded nachos with cheese', 400.00, 6, true, 'i_10', '2025-07-08 23:57:34.878637'),
(24, 'Karahi', 'Chicken karahi with naan', 750.00, 7, true, 'i_10', '2025-07-08 23:57:34.878637'),
(25, 'Burger', 'Beef burger with fries', 600.00, 7, true, 'i_10', '2025-07-08 23:57:34.878637'),
(26, 'Cheesecake', 'New York style cheesecake', 380.00, 8, true, 'i_10', '2025-07-08 23:57:34.878637'),
(27, 'Brownie', 'Fudgy chocolate brownie', 250.00, 8, true, 'i_10', '2025-07-08 23:57:34.878637'),
(28, 'DeezNuts', 'Fresh nuts', 60.00, NULL, true, 'blue_area', '2025-07-10 07:47:22.311637'),
(29, 'waffles', '', 700.00, NULL, true, 'blue_area', '2025-07-16 11:06:16.602924');

-- Insert Meeting Rooms
INSERT INTO public.meeting_rooms (id, name, capacity, hourly_rate, is_active, site, created_at) VALUES
(1, 'Conference Room A', 12, 5.00, true, 'blue_area', '2025-07-05 16:28:31.332347'),
(2, 'Meeting Room B', 6, 3.00, true, 'blue_area', '2025-07-05 16:28:31.332347'),
(3, 'Executive Suite', 8, 8.00, true, 'i_10', '2025-07-05 16:28:31.332347');

-- Insert Users
INSERT INTO public.users (id, email, password_hash, first_name, last_name, role, organization_id, site, created_at) VALUES
(1, 'admin@calmkaaj.com', '$2b$10$xET24htvRc.gIF/BisGUzuX/ocPVHP.zq/1wardMaEomQbW1lwXEi', 'CalmKaaj', 'Team', 'admin', NULL, 'blue_area', '2025-07-05 16:28:31.127274'),
(2, 'manager@calmkaaj.com', '$2b$10$JXv2QcZ8rR4T7IC6oBxEY.fwB7hstHvfGIGtt5yi4yG2/8KZslZVq', 'Cafe', 'Manager', 'staff', NULL, 'blue_area', '2025-07-05 16:28:31.127274'),
(36, 'shayan.qureshi@calmkaaj.org', '$2b$10$FaXdODOJzwg4YIYs8FiW4OogdiwF8qOM0Uiq3mAXjjMdSPpFnjbBW', 'Shayan Qureshi', '', 'admin', NULL, 'blue_area', '2025-07-09 12:42:11.828473'),
(37, 'zeb.ayaz@calmkaaj.org', '$2b$10$TPQE3Gspqc6Zh0XFWlytueHLi/tByEvfgk43fAY1.4hEuAvtX99lS', 'Zeb Ayaz', '', 'admin', NULL, 'blue_area', '2025-07-10 07:50:39.418292'),
(38, 'haider.nadeem@calmkaaj.org', '$2b$10$nj76Dy/agviu7LhUlrfO9O9N1ek7I0xR/Iq9g48VS4QDUIgvlKxNm', 'Haider Nadeem', '', 'admin', NULL, 'blue_area', '2025-07-10 07:52:03.897306'),
(39, 'sana.pirzada@calmkaaj.org', '$2b$10$mYv44oce6B0B.3zjoZTF2ulTWPXeS/ajkmg3ehPLl6LbXwVm.H5Ga', 'Sana', '', 'admin', NULL, 'blue_area', '2025-07-10 07:52:43.112288'),
(40, 'hadia.maryam@calmkaaj.org', '$2b$10$X5hUZlFBrzZx0kigsXAtAuyaC13kdwVVhlsP2FDo81G4nRpsDYKTy', 'Hadia', '', 'admin', NULL, 'blue_area', '2025-07-10 07:53:05.0535'),
(41, 'member@xyz.com', '$2b$10$Lj.5l/hSHkwm8bNk0CISGuEjYPPagWGEm1A0D16W9WRqSLQCwcILm', 'Member', '', 'user', NULL, 'blue_area', '2025-07-10 07:54:56.290389'),
(42, 'sameer@faazil.com', '$2b$10$sWBO.qI6cYeCyWoZiwf8zOmFYEno/6VoB1P0BSpURkeK1EL/lztTi', 'Sameer', 'Shahid', 'user', NULL, 'blue_area', '2025-07-10 08:13:51.565219');

-- Insert Cafe Orders
INSERT INTO public.cafe_orders (id, user_id, total_amount, status, billed_to, org_id, handled_by, notes, site, created_at, updated_at, delivery_location, created_by, payment_status, payment_updated_by, payment_updated_at) VALUES
(8, 1, 12.50, 'pending', 'personal', NULL, NULL, NULL, 'blue_area', '2025-07-05 18:22:54.367693', '2025-07-05 18:32:54.367693', NULL, NULL, 'unpaid', NULL, NULL),
(9, 2, 18.75, 'delivered', 'personal', NULL, 2, NULL, 'blue_area', '2025-07-05 18:17:54.367693', '2025-07-10 08:31:49.166', NULL, NULL, 'unpaid', 2, '2025-07-10 08:31:49.166'),
(15, 1, 4.50, 'delivered', 'personal', NULL, 2, NULL, 'blue_area', '2025-07-05 20:16:16.524385', '2025-07-05 21:54:18.486', NULL, NULL, 'unpaid', NULL, NULL),
(30, 38, 5755500.00, 'delivered', 'personal', NULL, 2, 'Please send me these, I WILL NOT PAY. WHAT DO YOU DO', 'blue_area', '2025-07-10 08:22:41.862982', '2025-07-10 08:30:10.991', NULL, NULL, 'unpaid', NULL, NULL),
(31, 39, 55000.00, 'pending', 'personal', NULL, NULL, NULL, 'blue_area', '2025-07-10 08:28:49.783474', '2025-07-10 08:28:49.783474', NULL, NULL, 'unpaid', NULL, NULL),
(32, 39, 1314.50, 'pending', 'personal', NULL, NULL, NULL, 'blue_area', '2025-07-10 08:29:08.563847', '2025-07-10 08:29:08.563847', NULL, NULL, 'unpaid', NULL, NULL),
(33, 39, 358.50, 'pending', 'personal', NULL, NULL, NULL, 'blue_area', '2025-07-10 08:30:04.921321', '2025-07-10 08:30:04.921321', NULL, NULL, 'unpaid', NULL, NULL),
(34, 39, 8000.00, 'pending', 'personal', NULL, NULL, NULL, 'blue_area', '2025-07-10 08:30:19.544829', '2025-07-10 08:30:19.544829', NULL, NULL, 'unpaid', NULL, NULL),
(35, 39, 598.50, 'pending', 'personal', NULL, NULL, NULL, 'blue_area', '2025-07-10 08:30:58.364197', '2025-07-10 08:30:58.364197', NULL, NULL, 'unpaid', NULL, NULL),
(36, 41, 3600.00, 'pending', 'personal', NULL, NULL, NULL, 'blue_area', '2025-07-10 08:38:12.811523', '2025-07-10 08:38:12.811523', NULL, NULL, 'unpaid', NULL, NULL),
(37, 41, 200.00, 'accepted', 'personal', NULL, 2, NULL, 'blue_area', '2025-07-10 08:40:40.215335', '2025-07-10 08:42:17.776', NULL, NULL, 'unpaid', NULL, NULL),
(38, 41, 250.00, 'pending', 'personal', NULL, NULL, NULL, 'blue_area', '2025-07-10 08:46:29.650123', '2025-07-10 08:46:29.650123', NULL, NULL, 'unpaid', NULL, NULL),
(40, 41, 250.00, 'accepted', 'personal', NULL, 2, NULL, 'blue_area', '2025-07-10 18:03:33.866108', '2025-07-17 05:04:48.672', NULL, NULL, 'paid', 2, '2025-07-17 05:04:48.672'),
(44, 40, 430.00, 'pending', 'personal', NULL, NULL, NULL, 'blue_area', '2025-07-16 10:56:28.327465', '2025-07-17 05:05:42.857', NULL, NULL, 'paid', 2, '2025-07-17 05:05:42.857'),
(46, 41, 200.00, 'delivered', 'personal', NULL, 2, 'Plis no sugar\n', 'blue_area', '2025-07-16 18:41:22.704151', '2025-07-16 18:49:25.082', NULL, NULL, 'paid', 2, '2025-07-16 18:49:25.082'),
(47, 42, 1800.00, 'pending', 'personal', NULL, NULL, '', 'blue_area', '2025-07-16 18:50:56.621199', '2025-07-16 18:50:56.621199', 'C5', 2, 'unpaid', NULL, NULL),
(48, 41, 1350.00, 'delivered', 'personal', NULL, 2, NULL, 'blue_area', '2025-07-17 04:58:36.487966', '2025-07-17 05:23:10.098', NULL, NULL, 'paid', 2, '2025-07-17 05:23:10.098'),
(49, 42, 900.00, 'delivered', 'personal', NULL, 2, '', 'blue_area', '2025-07-17 05:04:13.745023', '2025-07-17 05:21:19.136', 'Meeting Room', 2, 'paid', 2, '2025-07-17 05:21:19.136'),
(50, 41, 904.50, 'pending', 'personal', NULL, NULL, NULL, 'blue_area', '2025-07-17 05:29:36.468937', '2025-07-17 05:29:36.468937', NULL, NULL, 'unpaid', NULL, NULL),
(51, 41, 286.00, 'pending', 'personal', NULL, NULL, NULL, 'blue_area', '2025-07-17 05:44:31.180756', '2025-07-17 05:44:31.180756', NULL, NULL, 'unpaid', NULL, NULL),
(52, 41, 60.00, 'pending', 'personal', NULL, NULL, NULL, 'blue_area', '2025-07-17 15:01:57.00558', '2025-07-17 15:01:57.00558', NULL, NULL, 'unpaid', NULL, NULL),
(53, 41, 300.00, 'pending', 'personal', NULL, NULL, NULL, 'blue_area', '2025-07-17 15:02:03.789475', '2025-07-17 15:02:03.789475', NULL, NULL, 'unpaid', NULL, NULL);

-- Insert Cafe Order Items
INSERT INTO public.cafe_order_items (id, order_id, menu_item_id, quantity, price) VALUES
(1, 1, 1, 1, 4.50),
(32, 8, 1, 2, 4.50),
(33, 8, 4, 1, 6.00),
(36, 9, 1, 3, 4.50),
(37, 9, 2, 2, 3.00),
(52, 15, 1, 1, 4.50),
(68, 30, 8, 142, 250.00),
(69, 30, 7, 104, 55000.00),
(70, 31, 7, 1, 55000.00),
(71, 32, 14, 1, 650.00),
(72, 32, 8, 1, 250.00),
(73, 32, 1, 1, 4.50),
(74, 32, 28, 1, 60.00),
(75, 32, 17, 1, 150.00),
(76, 32, 6, 1, 200.00),
(77, 33, 3, 1, 8.50),
(78, 33, 16, 1, 350.00),
(79, 34, 6, 40, 200.00),
(80, 35, 1, 133, 4.50),
(81, 36, 6, 18, 200.00),
(82, 37, 6, 1, 200.00),
(83, 38, 8, 1, 250.00),
(84, 39, 16, 200, 350.00),
(85, 40, 8, 1, 250.00),
(86, 41, 28, 1, 60.00),
(87, 42, 8, 1, 250.00),
(88, 43, 8, 1, 250.00),
(89, 44, 17, 1, 150.00),
(90, 44, 9, 1, 280.00),
(91, 45, 1, 12, 4.50),
(92, 45, 11, 2, 450.00),
(93, 45, 28, 1, 60.00),
(94, 45, 16, 1, 350.00),
(95, 45, 3, 1, 8.50),
(96, 45, 14, 1, 900.00),
(97, 45, 9, 1, 280.00),
(98, 45, 17, 1, 150.00),
(99, 46, 6, 1, 200.00),
(100, 47, 14, 2, 900.00),
(101, 48, 14, 1, 900.00),
(102, 48, 11, 1, 450.00),
(103, 49, 14, 1, 900.00),
(104, 50, 14, 1, 900.00),
(105, 50, 1, 1, 4.50),
(106, 51, 9, 1, 280.00),
(107, 51, 4, 1, 6.00),
(108, 52, 28, 1, 60.00),
(109, 53, 28, 5, 60.00);

-- Insert Meeting Bookings
INSERT INTO public.meeting_bookings (id, user_id, room_id, start_time, end_time, status, org_id, site, created_at, updated_at, notes) VALUES
(1, 2, 1, '2025-07-16 18:40:00', '2025-07-16 20:40:00', 'confirmed', NULL, 'blue_area', '2025-07-05 16:40:56.961518', '2025-07-05 16:40:56.961518', ''),
(23, 1, 1, '2025-07-17 09:00:00', '2025-07-17 11:00:00', 'cancelled', NULL, 'blue_area', '2025-07-06 19:57:37.360321', '2025-07-06 19:57:49.192', NULL),
(37, 1, 1, '2025-07-16 14:00:00', '2025-07-16 14:30:00', 'cancelled', NULL, 'blue_area', '2025-07-16 06:20:56.811379', '2025-07-16 06:21:02.362', NULL),
(38, 40, 3, '2025-07-21 05:00:00', '2025-07-21 06:00:00', 'confirmed', NULL, 'blue_area', '2025-07-16 08:02:26.571943', '2025-07-16 08:02:26.571943', NULL),
(39, 40, 1, '2025-07-19 04:00:00', '2025-07-19 05:00:00', 'confirmed', NULL, 'blue_area', '2025-07-16 08:06:49.524561', '2025-07-16 08:06:49.524561', NULL),
(40, 1, 1, '2025-07-18 20:00:00', '2025-07-19 00:00:00', 'cancelled', NULL, 'blue_area', '2025-07-16 15:32:09.76543', '2025-07-16 15:32:19.403', NULL),
(41, 41, 1, '2025-07-17 08:30:00', '2025-07-17 09:00:00', 'cancelled', NULL, 'blue_area', '2025-07-16 18:43:05.869013', '2025-07-16 18:43:33.275', NULL),
(42, 41, 3, '2025-07-17 12:00:00', '2025-07-17 13:00:00', 'cancelled', NULL, 'blue_area', '2025-07-17 05:58:38.19904', '2025-07-17 05:58:45.223', NULL),
(43, 41, 3, '2025-07-22 14:00:00', '2025-07-22 15:00:00', 'confirmed', NULL, 'blue_area', '2025-07-20 11:23:15.836718', '2025-07-20 11:23:15.836718', NULL);

-- Reset sequences to continue from the highest ID
SELECT setval('public.announcements_id_seq', (SELECT MAX(id) FROM public.announcements), true);
SELECT setval('public.cafe_order_items_id_seq', (SELECT MAX(id) FROM public.cafe_order_items), true);
SELECT setval('public.cafe_orders_id_seq', (SELECT MAX(id) FROM public.cafe_orders), true);
SELECT setval('public.meeting_bookings_id_seq', (SELECT MAX(id) FROM public.meeting_bookings), true);
SELECT setval('public.meeting_rooms_id_seq', (SELECT MAX(id) FROM public.meeting_rooms), true);
SELECT setval('public.menu_categories_id_seq', (SELECT MAX(id) FROM public.menu_categories), true);
SELECT setval('public.menu_items_id_seq', (SELECT MAX(id) FROM public.menu_items), true);
SELECT setval('public.users_id_seq', (SELECT MAX(id) FROM public.users), true); 