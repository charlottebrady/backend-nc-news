exports.formatDates = (list) => {
  const formattedDates = [...list];
  formattedDates.forEach((article, index) => {
    const articleCopy = { ...article };
    const JSTimestamp = articleCopy.created_at;
    articleCopy.created_at = new Date(JSTimestamp);
    formattedDates[index] = articleCopy;
  });
  return formattedDates;
};

exports.makeRefObj = (list) => {
  let refObj = {};
  list.forEach((article) => {
    refObj[article.title] = article.article_id;
  });
  return refObj;
};

exports.formatComments = (comments, articleRef) => {
  const formattedComments = [];
  comments.forEach((comment) => {
    const commentCopy = { ...comment };
    commentCopy.author = comment.created_by;
    commentCopy.article_id = articleRef[comment.belongs_to];
    commentCopy.created_at = new Date(comment.created_at);
    delete commentCopy.created_by;
    delete commentCopy.belongs_to;
    formattedComments.push(commentCopy);
  });
  return formattedComments;
};
