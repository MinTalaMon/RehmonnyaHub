# RehmonnyaHub MVP

RehmonnyaHub is a scalable Reddit-style community platform for Mon people.

## Stack
- **Frontend:** Next.js + TypeScript + TailwindCSS
- **Backend:** Node.js + Express + TypeScript
- **Database/Auth/Storage:** Supabase (Postgres + Auth + Storage)

## Project Structure
- `backend/` Express API with Supabase integration.
- `backend/supabase/schema.sql` SQL schema, indexes, RLS policies, storage bucket policy.
- `frontend/` Next.js app with pages for feed, communities, post details, auth, profile, create-post.

## 1) Supabase setup and login
1. Open your Supabase project dashboard.
2. Go to **SQL Editor** and run `backend/supabase/schema.sql`.
3. In **Project Settings > API**, copy:
   - Project URL
   - anon/public key
   - service role key
4. In **Authentication > Providers**, keep Email provider enabled.
5. In **Storage**, confirm bucket `post-images` exists (schema script creates it).

## 2) Configure environment
### Backend (`backend/.env`)
```bash
cp backend/.env.example backend/.env
```
Set `SUPABASE_SERVICE_ROLE_KEY` to your real service role key.

### Frontend (`frontend/.env.local`)
```bash
cp frontend/.env.local.example frontend/.env.local
```

## 3) Install and run locally
```bash
cd backend && npm install
npm run dev
```

In a second terminal:
```bash
cd frontend && npm install
npm run dev
```

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:4000`

## 4) Seed initial communities and posts
- Seed starter communities:
```bash
cd backend
npm run seed
```
- Optional: create posts from UI after logging in.

## 5) API endpoints
- `GET /users/:id`
- `GET /communities`
- `GET /communities/:slug`
- `GET /posts?sort=latest|top`
- `GET /posts/:id`
- `POST /posts`
- `DELETE /posts/:id`
- `GET /posts/:id/comments`
- `POST /posts/:id/comments`
- `DELETE /comments/:id`
- `POST /vote`
- `POST /storage/upload-url`

Auth routes are handled by Supabase Auth from the frontend (`signUp`, `signInWithPassword`, `signOut`).

## 6) How to check database tables
1. In Supabase dashboard, go to **Table Editor**.
2. Check: `users`, `communities`, `posts`, `comments`, `votes`.
3. In **SQL Editor**, run:
```sql
select * from public.users order by created_at desc;
select * from public.posts order by created_at desc;
```

## 7) How to add images
1. In Create Post page, choose image file.
2. Frontend asks backend for signed upload URL.
3. Frontend uploads to Supabase Storage bucket `post-images`.
4. Public URL is attached to post as `image_url`.

## 8) Test login, posting, comments, voting
1. Register from `/register`.
2. Login from `/login`.
3. Create a post from `/create-post`.
4. Open post detail and add comment/reply (one-level nesting).
5. Upvote/downvote from feed cards.
6. If your profile has `is_admin=true`, test deleting posts/comments via API.

## 9) Deploy instructions (Vercel frontend)
1. Push repo to GitHub.
2. Import project into Vercel.
3. Set root directory to `frontend`.
4. Add environment variables in Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_API_BASE_URL` (deployed backend URL)
5. Deploy.

For backend deployment, run `backend` on any Node host (Railway/Render/Fly), set backend env vars, and point `NEXT_PUBLIC_API_BASE_URL` to that backend.
