import { Card } from "@/components/ui/card";
import useAdminItems from "@/lib/api/useAdminItems";
import { Post } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const Posts = () => {
  const { getPosts } = useAdminItems();
  // Access the client
  const queryClient = useQueryClient();

  // Queries
  const query = useQuery({ queryKey: ["posts"], queryFn: getPosts });

  // Mutations
  //   const mutation = useMutation({
  //     mutationFn: postTodo,
  //     onSuccess: () => {
  //       // Invalidate and refetch
  //       queryClient.invalidateQueries({ queryKey: ["posts"] });
  //     },
  //   });

  const { isPending, error, data, isFetching } = useQuery({
    queryKey: ["posts"],
    queryFn: getPosts,
    refetchOnWindowFocus: false, // Optional: Prevent refetching on window focus
  });

  return (
    <div>
      {isFetching && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {data && (
        <ul>
          {data.map((post: Post) => (
            <Card key={post.id} className="mb-4 p-4">
              <h2 className="text-lg font-bold">{post.title}</h2>
              <p>{post.body}</p>
            </Card>
          ))}
        </ul>
      )}
    </div>
  );
};
export default Posts;
