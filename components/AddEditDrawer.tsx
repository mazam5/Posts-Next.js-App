"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import dynamic from "next/dynamic";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
const JoditEditor = dynamic(() => import("jodit-react"), {
  ssr: false,
});

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useIsMobile } from "@/hooks/use-mobile";
import useAPI from "@/lib/api/useAPI";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Save } from "lucide-react";
import { toast } from "sonner";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  body: z.string().min(1, "Body is required"),
});

const AddEditDrawer = ({
  formData,
  isEdit,
  children,
}: {
  formData?: { title: string; body: string; id: number };
  isEdit: boolean;
  children: React.ReactNode;
}) => {
  const [open, setOpen] = React.useState(false);
  const isMobile = useIsMobile();
  if (!isMobile) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{isEdit ? "Edit Post" : "Add New Post"}</DialogTitle>
            <DialogDescription>
              {isEdit
                ? "Make changes to your post here. Click save when you're done."
                : "Use this form to create a new post. Fill in the title and body, then click save when you're done."}
            </DialogDescription>
          </DialogHeader>
          <PostForm
            formData={formData}
            isEdit={isEdit}
            onSuccess={() => setOpen(false)}
          />
        </DialogContent>
      </Dialog>
    );
  }
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>{isEdit ? "Edit Post" : "Add New Post"}</DrawerTitle>
          <DrawerDescription>
            {isEdit
              ? "Make changes to your post here. Click save when you&apos;re done."
              : "Use this form to create a new post. Fill in the title and body, then click save when you&apos;re done."}
          </DrawerDescription>
        </DrawerHeader>
        <PostForm
          formData={formData}
          isEdit={isEdit}
          onSuccess={() => setOpen(false)}
        />

        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
export default AddEditDrawer;

function PostForm({
  formData,
  isEdit,
  onSuccess,
}: {
  formData?: { title: string; body: string; id: number };
  isEdit: boolean;
  onSuccess: () => void;
}) {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: formData?.title || "",
      body: formData?.body || "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.

    if (isEdit && formData) {
      // If editing, update the post
      updateMutation.mutate({
        userId: 1, // Assuming a static userId for now
        id: formData.id,
        title: values.title,
        body: values.body,
      });
    } else {
      // If adding a new post, create it
      addMutation.mutate({
        userId: 1, // Assuming a static userId for now
        title: values.title,
        body: values.body,
      });
    }
  }
  const editor = React.useRef(null);

  const config = React.useMemo(
    () => ({
      readonly: false, // all options from https://xdsoft.net/jodit/docs/,
      placeholder: form.getValues("body") || "Start typing...",
    }),
    [form]
  );
  const { addPost, updatePost } = useAPI();
  const queryClient = useQueryClient();

  const addMutation = useMutation({
    mutationFn: addPost,
    onSuccess: () => {
      onSuccess();
      toast.success("Post added successfully!");
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: updatePost,
    onSuccess: () => {
      onSuccess();
      toast.info(`Post with ID ${formData?.id} updated successfully!`);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Post Title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="body"
          render={() => (
            <FormItem>
              <FormLabel>Body</FormLabel>
              <JoditEditor
                ref={editor}
                value={form.getValues("body")}
                className="dark:bg-gray-800 dark:text-black"
                onChange={(newContent) => {
                  form.setValue("body", newContent);
                }}
                config={config}
                tabIndex={1} // tabIndex of textarea
                onBlur={(newContent) => form.setValue("body", newContent)}
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-center">
          <Button type="submit">
            Save
            <Save className="ml-2" />
          </Button>
        </div>
      </form>
    </Form>
  );
}
