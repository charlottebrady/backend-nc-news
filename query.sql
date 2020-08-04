\c nc_news_test

SELECT articles.*, COUNT(comments.comment_id) FROM articles
WHERE article_id = 1
LEFT JOIN comments
ON articles.article_id = comments.article_id
GROUP BY articles.article_id

;