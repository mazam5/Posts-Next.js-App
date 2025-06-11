import { NewPost, Post } from "@/types";

const useAPI = () => {
  const getPosts = async () => {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");

    const data = response.json();
    return data;
  };

  const getPostById = async (id: number) => {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/posts/${id}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch post");
    }
    const data = await response.json();
    return data;
  };

  const addPost = async (post: NewPost) => {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(post),
    });

    if (!response.ok) {
      throw new Error("Failed to create post");
    }

    return response.json();
  };

  const updatePost = async (post: Post) => {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/posts/${post.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(post),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update post");
    }

    return response.json();
  };

  const deletePost = async (id: number) => {
    const response = await fetch(`/posts/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Failed to delete post");
    }
    return response.json();
  };
  return {
    addPost,
    getPosts,
    updatePost,
    deletePost,
    getPostById,
  };
};

export default useAPI;
