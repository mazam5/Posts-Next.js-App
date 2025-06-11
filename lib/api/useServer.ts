"use server";

import { NewPost } from "@/types";

const useServer = () => {
  const addPost = async (post: NewPost) => {
    const response = await fetch("/posts", {
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

  const updatePost = async (id: number, post: NewPost) => {
    const response = await fetch(`/posts/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(post),
    });

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
    updatePost,
    deletePost,
  };
};

export default useServer;
