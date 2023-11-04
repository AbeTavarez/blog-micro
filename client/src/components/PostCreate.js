import { useState } from "react";
import axios from "axios";

function PostCreate() {
  const [title, setTitle] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:4000/posts", {title});
    } catch (error) {
      console.log(error);
    }
    setTitle('');
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <legend>Create Post</legend>
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <button className="btn btn-primary">Create</button>
      </form>
    </div>
  );
}
export default PostCreate;
