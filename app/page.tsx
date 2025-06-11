"use client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import UserPagination from "@/components/UserPagination";
import useAPI from "@/lib/api/useAPI";
import { Post } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { AlertCircleIcon, ArrowRight } from "lucide-react";
import Link from "next/link";
import React from "react";

const ITEMS_PER_PAGE = 10;
export default function Home() {
  const { getPosts } = useAPI();
  const query = useQuery({
    queryKey: ["posts"],
    queryFn: getPosts,
    refetchOnWindowFocus: false,
  });
  const [currentPage, setCurrentPage] = React.useState(1);
  const firstCardRef = React.useRef<HTMLDivElement>(null); // Ref for scrolling

  const totalPosts = query.data?.length || 0;
  const totalPages = Math.ceil(totalPosts / ITEMS_PER_PAGE);

  const paginatedPosts = query.data?.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Scroll to the first card when page changes
  // React.useEffect(() => {
  //   if (firstCardRef.current) {
  //     firstCardRef.current.scrollIntoView({
  //       behavior: "smooth",
  //       block: "nearest",
  //     });
  //   }
  // }, [currentPage]);

  return (
    <div className="mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Home</h1>

      {/* Loading skeletons */}
      {(query.isFetching || query.isPending) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 10 }).map((_, index) => (
            <Skeleton
              key={index}
              className="md:min-h-36 md:min-w-96 h-32 mb-2"
            />
          ))}
        </div>
      )}

      {/* Error handling */}
      {query.error && (
        <Alert variant="destructive">
          <AlertCircleIcon />
          <AlertTitle>Unable to fetch posts</AlertTitle>
          <AlertDescription>
            There was an error fetching the posts. Please try again later.
            <br />
            <strong>Error:</strong> {query.error.message}
          </AlertDescription>
        </Alert>
      )}

      {/* Posts grid */}
      <div>
        {paginatedPosts && paginatedPosts.length > 0 && !query.error && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {paginatedPosts.map((post: Post, index: number) => (
                <Link
                  href={`/posts/${post.id}`}
                  key={post.id}
                  id={post.id.toString()}
                >
                  <Card
                    ref={index === 0 ? firstCardRef : null}
                    onClick={() => console.log(`Post clicked: ${post.id}`)}
                    className="px-4 py-3 md:min-h-36 h-32 relative cursor-pointer duration-300 ease-in-out hover:scale-95 hover:shadow-lg"
                  >
                    <span className="text-sm text-gray-500 top-0 right-0 font-bold absolute font-mono p-1 bg-gray-100 rounded">
                      #{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                    </span>
                    <h2 className="md:text-lg text-md font-bold capitalize mr-4">
                      {post.title}
                    </h2>
                    <p className="font-mono text-gray-400 md:text-md text-sm">
                      {post.body.length > 100
                        ? post.body.slice(0, 100) + "..."
                        : post.body}
                    </p>
                    <div className="absolute bottom-2 right-2">
                      <ArrowRight className="h-4 w-4 text-gray-500" />
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
            {totalPages > 1 && (
              <UserPagination
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalPages={totalPages}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
