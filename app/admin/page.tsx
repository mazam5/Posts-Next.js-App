"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import UserPagination from "@/components/UserPagination";
import useAPI from "@/lib/api/useAPI";
import { Post } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Edit, Plus, Trash } from "lucide-react";
import { useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import AddEditDrawer from "@/components/AddEditDrawer";
const ITEMS_PER_PAGE = 10;

const Page = () => {
  const { getPosts, deletePost } = useAPI();

  const queryClient = useQueryClient();

  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["posts"],
    queryFn: getPosts,
    refetchOnWindowFocus: false,
  });

  const totalItems = data?.length || 0;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  const paginatedData = data?.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const deleteMutation = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
    data.splice(
      data.findIndex((post: Post) => post.id === id),
      1
    );
    queryClient.setQueryData(["posts"], data);
    toast.error(`Post with ID ${id} deleted successfully!`);
  };

  return (
    <div className="w-full p-4">
      <div className="flex">
        <h1 className="text-2xl font-bold mb-4">Admin</h1>
        <AddEditDrawer isEdit={false}>
          <Button className="ml-auto">
            <Plus className="ml-2" />
            Add New Post
          </Button>
        </AddEditDrawer>
      </div>

      <Table className="rounded-xl overflow-hidden ">
        <TableHeader className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Body</TableHead>
            <TableHead>Edit</TableHead>
            <TableHead>Delete</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <>
              {Array.from({ length: 10 }).map((_, index) => (
                <TableRow key={index} className="w-full">
                  {Array.from({ length: 5 }).map((_, cellIndex) => (
                    <TableCell key={cellIndex}>
                      <Skeleton className="md:h-12 h-8 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </>
          ) : isError ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                Error: {error.message}
              </TableCell>
            </TableRow>
          ) : (
            paginatedData?.map((post: Post) => (
              <TableRow
                key={post.id}
                className={`hover:bg-gray-100 dark:hover:bg-gray-700`}
              >
                <TableCell>{post.id}</TableCell>
                <TableCell className="capitalize">
                  {post.title.length > 30
                    ? post.title.slice(0, 30) + "..."
                    : post.title}
                </TableCell>
                <TableCell>
                  {post.body.length > 60
                    ? post.body.slice(0, 60) + "..."
                    : post.body}
                </TableCell>
                <TableCell>
                  <AddEditDrawer isEdit={true} formData={post}>
                    <Button className="bg-gray-900 hover:bg-gray-700 cursor-pointer p-4 rounded-2xl text-white">
                      <Edit />
                    </Button>
                  </AddEditDrawer>
                </TableCell>
                <TableCell>
                  <AlertDialog>
                    <AlertDialogTrigger className="text-red-500 hover:bg-red-700 bg-gray-900 hover:text-white cursor-pointer py-2 px-4 rounded-2xl">
                      <Trash />
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete the post with ID {post.id}.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => {
                            handleDelete(post.id);
                          }}
                        >
                          Continue
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      {totalPages > 1 && (
        <UserPagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
        />
      )}
      <Toaster richColors position="bottom-center" />
    </div>
  );
};

export default Page;
