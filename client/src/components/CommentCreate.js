import { useState } from "react";
import axios from "axios";

function CommentCreate({ postId }) {
  const [content, setContent] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post(`http://posts.com/posts/${postId}/comments`, { content });
    setContent("");
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>New Comment</label>
          <input
            type="text"
            className="form-control"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <input type="submit" className="btn btn-primary" />
      </form>
    </div>
  );
}

export default CommentCreate;
