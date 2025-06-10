const useAdminItems = () => {
  const getPosts = async () => {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    return response.json();
  };
  return {
    getPosts,
  };
};

export default useAdminItems;
