-- User sign up
SELECT id FROM users WHERE email = $1 OR username = $2;
INSERT INTO users (email, username, password) VALUES ($1, $2, $3);

-- User login
SELECT id, password FROM users WHERE email = $1 OR username = $2;

-- Group Create
INSERT INTO groups (name) VALUES ($1);
INSERT INTO group_users (group_id, user_id, is_owner) VALUES ($1, $2, TRUE);
