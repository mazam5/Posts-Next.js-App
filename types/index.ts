export type Post = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

export type NewPost = { title: string; body: string; userId: number };
