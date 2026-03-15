"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { supabase } from "@/lib/supabase";
import type { Community } from "@/types";

export default function CreatePostPage() {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [communityId, setCommunityId] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    apiFetch<Community[]>("/communities").then((data) => {
      setCommunities(data);
      if (data.length > 0) setCommunityId(data[0].id);
    });
  }, []);

  const uploadImage = async (token: string) => {
    if (!imageFile) return null;

    const signed = await apiFetch<{ token: string; path: string }>("/storage/upload-url", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ filename: imageFile.name, contentType: imageFile.type || "image/jpeg" })
    });

    const { error } = await supabase.storage.from("post-images").uploadToSignedUrl(signed.path, signed.token, imageFile);
    if (error) throw error;

    const { data } = supabase.storage.from("post-images").getPublicUrl(signed.path);
    return data.publicUrl;
  };

  const submit = async () => {
    try {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) throw new Error("Please log in first.");

      const image_url = await uploadImage(token);
      await apiFetch("/posts", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ community_id: communityId, title, content, image_url })
      });

      window.location.href = "/";
    } catch (error) {
      alert((error as Error).message);
    }
  };

  return (
    <div className="rounded border bg-white p-4">
      <h1 className="mb-4 text-2xl font-bold">Create Post</h1>
      <select className="mb-3 w-full rounded border p-2" value={communityId} onChange={(e) => setCommunityId(e.target.value)}>
        {communities.map((community) => (
          <option key={community.id} value={community.id}>{community.name}</option>
        ))}
      </select>
      <input className="mb-3 w-full rounded border p-2" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <textarea className="mb-3 w-full rounded border p-2" placeholder="Write your post..." rows={5} value={content} onChange={(e) => setContent(e.target.value)} />
      <input className="mb-3 w-full" type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] ?? null)} />
      <button onClick={submit} className="rounded bg-indigo-600 px-4 py-2 text-white">Publish</button>
    </div>
  );
}
