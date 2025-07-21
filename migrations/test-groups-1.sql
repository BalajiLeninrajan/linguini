-- INSERT INTO groups (name, created_at) VALUES
-- ('Polaris', '2025-06-18 11:00:00'),
-- ('Sigma', '2025-06-18 11:00:00'),
-- ('Venus', '2025-06-18 11:00:00');

-- INSERT INTO group_users (group_id, user_id, is_owner) VALUES
-- (10, 1, true),
-- (10, 2, false),
-- (10, 3, false),
-- (10, 4, false),
-- (12, 5, true),
-- (12, 1, false),
-- (12, 4, false),
-- (12, 6, false),
-- (11, 1, false),
-- (11, 7, true),
-- (11, 8, false),
-- (11, 9, false),
-- (11, 10, false);

-- INSERT INTO group_users (group_id, user_id, is_owner) VALUES
-- (12, 12, false),
-- (11, 12, false);

-- UPDATE group_users
-- SET user_id = 2
-- WHERE user_id = 5;

-- UPDATE group_users
-- SET user_id = 12
-- WHERE user_id = 9 and group_id = 11;

-- UPDATE group_users
-- SET user_id = 4
-- WHERE user_id = 12 and group_id = 12;

INSERT INTO group_users (group_id, user_id, is_owner) VALUES
(15, 1, false),
(15, 2, false),
(15, 3, false),
(15, 4, false),
(15, 5, false);