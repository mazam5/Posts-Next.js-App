"use client";
import useAPI from "@/lib/api/useAPI";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
const Page = () => {
  const params = useParams();
  const { getPostById } = useAPI();
  const id = params.id; // '123' if URL is /product/123

  const { data, isLoading, isError } = useQuery({
    queryKey: ["post", id],
    queryFn: getPostById.bind(null, Number(id)),
    refetchOnWindowFocus: false,
  });
  if (isLoading) {
    return (
      <Card className="mx-auto w-1/2 h-1/2 mt-10 p-4 animate-pulse">
        <Skeleton className="w-full mb-4" />
      </Card>
    );
  }

  if (isError) {
    return (
      <p className="text-red-500 text-center mt-10">Failed to load post.</p>
    );
  }

  return (
    <div className="flex justify-center items-center w-full min-h-screen">
      <Card className="md:w-3/4 w-full  h-3/4 mx-auto mt-10 shadow-xl p-6">
        <CardHeader>
          <CardTitle className="text-xl font-semibold mb-2">
            Post #{data.id} by User #{data.userId}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <h2 className="md:text-3xl text-xl font-bold capitalize mb-2">
            {data.title}
          </h2>
          <p className="text-gray-600 whitespace-pre-line">{data.body}</p>
        </CardContent>
      </Card>
    </div>
  );
};
export default Page;
