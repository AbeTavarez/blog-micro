function CommentList({ comments }) {

  // prepare comments
  const renderedComments = comments.map((comment) => {
    let content;

    switch (comment.status) {
      case "approved":
        content = comment.content;
        break;
      case "pending":
        content = "posting...";
        break;
      case "rejected":
        content = "Cannot post";
        break;
      default:
        break;
    }

    return <li key={comment.id}>{content}</li>;
  });

  return <ul>{renderedComments}</ul>;
}
export default CommentList;
