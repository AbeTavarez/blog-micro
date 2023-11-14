import PostCreate from './components/PostCreate';
import PostList from './components/PostList';

function App() {
  return (
    <div className="container">
      <header>
        <h1>Blog Micro</h1>
      </header>
     <PostCreate />
     <hr />
     <h1>Posts</h1>
     <PostList />
    </div>
  );
}

export default App;
