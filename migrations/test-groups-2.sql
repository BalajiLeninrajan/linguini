-- TRUNCATE TABLE groups CASCADE;

SELECT * FROM groups;
SELECT * FROM group_users;
select * from plays;

-- SELECT DISTINCT users.id, users.username, plays.category_count, (plays.end_time - plays.start_time) as time FROM plays 
-- JOIN users ON users.id = plays.user_id
-- JOIN group_users ON group_users.user_id = users.id
-- WHERE plays.game_id = 1 AND group_users.group_id = 10
-- ORDER BY plays.category_count ASC,
-- (plays.end_time - plays.start_time) ASC; 

-- SELECT DISTINCT groups.id, groups.name FROM
-- groups JOIN group_users ON group_users.group_id=groups.id
-- WHERE group_users.user_id=4;