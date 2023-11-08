module.exports = function handleEvent(type, data) {
    //* Post Created
    if (type === "PostCreated") {
      const { id, title } = data;
      posts[id] = { id, title, comments: [] };
    }
  
    //* Comment Created
    if (type === "CommentCreated") {
      const { id, content, postId, status } = data;
  
      const post = posts[postId];
      post.comments.push({ id, content, status });
    }
  
    //* Comment Updated
    if (type === "CommentUpdated") {
      const { id, content, postId, status } = data;
      // get post by postId
      const post = posts[postId];
  
      // find comment to updates
      const comment = post.comments.find((comment) => comment.id === id);
  
      // update comment
      comment.status = status;
      comment.content = content;
      console.log(comment);
    }
  }