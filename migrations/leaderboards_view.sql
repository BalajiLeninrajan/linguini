CREATE OR REPLACE VIEW leaderboard_view AS
SELECT
    users.username,
    plays.category_count,
    (plays.end_time - plays.start_time) AS time,
    plays.game_id,
    group_users.group_id
FROM plays
JOIN users ON users.id = plays.user_id
LEFT JOIN group_users ON group_users.user_id = users.id
WHERE plays.end_time IS NOT NULL;
