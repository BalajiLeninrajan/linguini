-- User sign up
SELECT id FROM users WHERE email = 'user5552@gmail.com' OR username = 'user5552';
INSERT INTO users (email, username, password) VALUES ('user5552@gmail.com', 'user5552', '1h38uhd743k');

-- User login
SELECT id, password FROM Users WHERE (username='user5552' OR email='user5552@gmail.com');

-- Group Create
INSERT INTO groups (name) VALUES ('GroupTheBest');
INSERT INTO group_users (group_id, user_id, is_owner) VALUES (1, 1, TRUE);

--Word category
SELECT * FROM word_categories WHERE category = 'melon' AND word = 'watermelon';
