import type { Comment } from "@/types";
import { sanitizeHtml } from "@/lib/sanitize";

// Renders top-level comments and one-level replies.
export default function CommentList({ comments }: { comments: Comment[] }) {
  const roots = comments.filter((comment) => comment.parent_comment_id === null);

  return (
    <div className="space-y-4">
      {roots.map((root) => {
        const replies = comments.filter((child) => child.parent_comment_id === root.id);
        return (
          <div key={root.id} className="rounded border bg-white p-3">
            <p className="text-sm font-medium">{root.users?.username ?? "unknown"}</p>
            <div
              className="text-sm"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(root.content) }}
            />
            {replies.length > 0 && (
              <div className="mt-3 space-y-2 border-l-2 border-slate-200 pl-3">
                {replies.map((reply) => (
                  <div key={reply.id}>
                    <p className="text-xs font-medium">{reply.users?.username ?? "unknown"}</p>
                    <div
                      className="text-sm"
                      dangerouslySetInnerHTML={{ __html: sanitizeHtml(reply.content) }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
