-- INSERT INTO users (email, username, password, created_at) VALUES
-- ('user235@example.com', 'user235', 'password123', '2025-06-18 11:00:00'),
-- ('user12345@example.com', 'user12345', 'password123', '2025-06-18 11:00:00'),
-- ('user555@example.com', 'user555', 'password123', '2025-06-18 11:00:00'),
-- ('user125@example.com', 'user125', 'password123', '2025-06-18 11:00:00'),
-- ('user15@example.com', 'user15', 'password123', '2025-06-18 11:00:00'),
-- ('user353@example.com', 'user335', 'password123', '2025-06-18 11:00:00'),
-- ('user25@example.com', 'user25', 'password123', '2025-06-18 11:00:00'),
-- ('user135@example.com', 'user135', 'password123', '2025-06-18 11:00:00'),
-- ('user905@example.com', 'user905', 'password123', '2025-06-18 11:00:00'),
-- ('user2225@example.com', 'user2225', 'password123', '2025-06-18 11:00:00'),
-- ('user395@example.com', 'user395', 'password39', '2025-06-18 11:00:00');

-- INSERT INTO games (game_mode, seed, created_at) VALUES
-- ('Classic', 12345, '2025-06-18 11:20:00');

-- INSERT INTO plays (game_id, user_id, category_count, start_time, end_time) VALUES
-- (1, 1, 10, '2025-06-18 11:24:00', '2025-06-18 11:28:00'),
-- (1, 2, 8, '2025-06-18 11:20:00', '2025-06-18 11:28:00'),
-- (1, 3, 2, '2025-06-18 11:21:00', '2025-06-18 11:28:00'),
-- (1, 4, 5, '2025-06-18 11:22:00', '2025-06-18 11:28:00'),
-- (1, 5, 5, '2025-06-18 11:29:00', '2025-06-18 11:39:00'),
-- (1, 6, 3, '2025-06-18 11:20:00', '2025-06-18 11:22:00'),
-- (1, 7, 8, '2025-06-18 11:20:00', '2025-06-18 11:29:00'),
-- (1, 8, 20, '2025-06-18 11:10:00', '2025-06-18 11:30:00'),
-- (1, 9, 100, '2025-06-18 11:10:00', '2025-06-18 11:29:00'),
-- (1, 10, 3, '2025-06-18 11:10:00', '2025-06-18 11:28:00'),
-- (1, 11, 53, '2025-06-18 11:10:00', '2025-06-18 11:40:00');

INSERT INTO plays (game_id, user_id, category_count, start_time, end_time) VALUES
(1, 12, 10, '2025-06-18 11:24:00', '2025-06-18 11:28:00');