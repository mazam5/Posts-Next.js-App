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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useClient from "@/lib/api/useClient";
import { Post } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { Edit, Plus, Trash } from "lucide-react";
const Page = () => {
  const { getPosts } = useClient();

  const query = useQuery({
    queryKey: ["posts"],
    queryFn: getPosts,
    refetchOnWindowFocus: false,
  });

  return (
    <div className="w-full p-4">
      <div className="flex">
        <h1 className="text-2xl font-bold mb-4">Admin</h1>
        <Button className="ml-auto">
          <Plus className="ml-2" />
          Add New Post
        </Button>
      </div>

      <Table className="border">
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
          {query.isLoading ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                Loading...
              </TableCell>
            </TableRow>
          ) : query.isError ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                Error: {query.error.message}
              </TableCell>
            </TableRow>
          ) : (
            query.data?.map((post: Post) => (
              <TableRow
                key={post.id}
                className={`hover:bg-gray-100 dark:hover:bg-gray-700`}
              >
                <TableCell>{post.id}</TableCell>
                <TableCell className="truncate capitalize">
                  {post.title.length > 30
                    ? post.title.slice(0, 30) + "..."
                    : post.title}
                </TableCell>
                <TableCell className="truncate">
                  {post.body.length > 60
                    ? post.body.slice(0, 60) + "..."
                    : post.body}
                </TableCell>
                <TableCell>
                  <button>
                    <Edit />
                  </button>
                </TableCell>
                <TableCell>
                  <AlertDialog>
                    <AlertDialogTrigger className="text-red-500 hover:bg-red-700 bg-gray-900 hover:text-white cursor-pointer py-2 px-4 rounded">
                      <Trash />
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete the post with ID {post.id}. Are you sure you
                          want to proceed?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction>Continue</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
export default Page;
