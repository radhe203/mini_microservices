import CreatePost from "./components/CreatePost";
import PostCard from "./components/PostCard";
import PostList from "./components/PostList";

function App() {
  return (
    <>
      <div className=" container grid grid-cols-[.3fr,1fr] ">
        <div className=" flex flex-col justify-center items-center h-[100vh] sticky top-0 border-r-2">
          <h1 className=" text-xl font-bold text-blue-600 uppercase mb-5">
            Create a post
          </h1>
          <CreatePost />
        </div>
        <PostList />
      </div>
    </>
  );
}

export default App;
