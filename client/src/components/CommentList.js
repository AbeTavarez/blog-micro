import axios from "axios";
import { useEffect, useState } from "react";

function CommentList({ postId }) {
  const [comments, setComments] = useState([]);

  const fetchComments = async () => {
    const res = await axios.get(
      `http://localhost:4001/posts/${postId}/comments`
    );
    setComments(res.data);
    console.log(res.data);
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const renderedComments = comments.map((comment) => (
    <li key={comment.id}>{comment.content}</li>
  ));
    console.log('COMMENTS:', renderedComments);

  return <ul>{renderedComments}</ul>;
}
export default CommentList;
