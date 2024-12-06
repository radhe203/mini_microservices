import { useState } from "react";

function CreatePost() {
  const [tittle, setTittle] = useState("");

  async function submitHandel(e) {
    e.preventDefault();
    if (tittle == "") {
      return;
    }
    try {
      const res = await fetch("http://posts.com/posts", {
        method: "POST",
        headers: {
          "Content-Type": "Application/json",
        },
        body: JSON.stringify({ tittle }),
      });

      if (res.ok) {
        setTittle("");
      } else {
        throw new Error("Failed to create Post");
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <form
      className=" w-fit p-4 flex flex-col text-center gap-2"
      onSubmit={submitHandel}
    >
      <label className=" text-blue-500 font-bold">Tittle</label>
      <input
        type="text"
        className=" px-3 py-2 border-0 bg-slate-200 outline-none text-blue-500 font-semibold w-full min-w-[250px] rounded-sm"
        onChange={(e) => {
          setTittle(e.target.value);
        }}
        value={tittle}
        required
      />
      <button
        type="submit"
        className=" bg-green-600 text-white px-3 py-1 rounded-md font-semibold hover:bg-green-500"
      >
        Submit
      </button>
    </form>
  );
}

export default CreatePost;
