export interface Community {
  id: string;
  slug: string;
  name: string;
  description: string;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  image_url: string | null;
  score: number;
  created_at: string;
  communities?: { name: string; slug: string };
  users?: { username: string };
}

export interface Comment {
  id: number;
  content: string;
  parent_comment_id: number | null;
  created_at: string;
  users?: { username: string };
}
