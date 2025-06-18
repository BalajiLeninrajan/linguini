SELECT user_id, category_count, (plays.end_time - plays.start_time) as time FROM plays 
ORDER BY plays.category_count ASC, 
(plays.end_time - plays.start_time) ASC
LIMIT 10;