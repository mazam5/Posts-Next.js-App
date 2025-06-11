"use client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import useClient from "@/lib/api/useClient";
import { Post } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { AlertCircleIcon, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const ITEMS_PER_PAGE = 10;

export default function Home() {
  const { getPosts } = useClient();
  const query = useQuery({
    queryKey: ["posts"],
    queryFn: getPosts,
    refetchOnWindowFocus: false,
  });
  const [currentPage, setCurrentPage] = useState(1);

  const totalPosts = query.data?.length || 0;
  const totalPages = Math.ceil(totalPosts / ITEMS_PER_PAGE);

  const paginatedPosts = query.data?.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Home</h1>

      {(query.isFetching || query.isPending) && (
        <>
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-full" />
        </>
      )}

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

      <div>
        {paginatedPosts && paginatedPosts.length > 0 && !query.error && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {paginatedPosts.map((post: Post, index: number) => (
                <Link href={`/posts/${post.id}`} key={post.id}>
                  <Card
                    onClick={() => console.log(`Post clicked: ${post.id}`)}
                    className="px-4 md:min-h-36 h-32 relative cursor-pointer duration-300 ease-in-out hover:scale-95 hover:shadow-lg"
                  >
                    <span className="text-sm text-gray-500 top-0 right-0 font-bold absolute font-mono p-1 bg-gray-100 rounded">
                      #{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                    </span>
                    <h2 className="md:text-lg text-md font-bold capitalize">
                      {post.title}
                    </h2>
                    <p className="font-mono text-gray-400 md:text-md text-sm">
                      {post.body.length > 100
                        ? post.body.slice(0, 100) + "..."
                        : post.body}{" "}
                    </p>
                    <div className="absolute bottom-2 right-2">
                      <ArrowRight className="h-4 w-4 text-gray-500" />
                    </div>
                  </Card>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            <Pagination className="mt-8">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(currentPage - 1);
                    }}
                  />
                </PaginationItem>

                {[...Array(totalPages)].map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      href="#"
                      isActive={currentPage === i + 1}
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(i + 1);
                      }}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(currentPage + 1);
                    }}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </>
        )}
      </div>
    </div>
  );
}
