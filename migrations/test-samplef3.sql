SELECT users.username, category_count, (plays.end_time - plays.start_time) as time 
FROM plays join users on users.id = plays.user_id
ORDER BY plays.category_count ASC, 
(plays.end_time - plays.start_time) ASC
LIMIT 10;