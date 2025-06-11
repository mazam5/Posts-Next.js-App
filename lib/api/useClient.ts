const useClient = () => {
  const getPosts = async () => {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");

    const data = response.json();
    return data;
  };
  return {
    getPosts,
  };
};

export default useClient;
