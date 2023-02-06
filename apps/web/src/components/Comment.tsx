import { Badge } from "@jjordy/ui";
import { formatDistanceToNowStrict } from "date-fns";
import { Prisma } from "@jjordy/data";
import type { Comment } from "@/lib/data/comment";
import { serialize } from "@/lib/content";
import Content from "./Content";

type CommentProps = {
  comment: Comment;
};

export default function Comment({ comment }: CommentProps) {
  return (
    <div className="mb-4 flex flex-col rounded-2xl border border-slate-300 bg-white p-2 shadow">
      <div className="mb-2 flex items-center font-medium">
        {comment?.author?.name}
        <div className="mr-auto"></div>
        <Badge>
          {comment?.created_at &&
            formatDistanceToNowStrict(new Date(comment.created_at), {
              addSuffix: true,
            })}
        </Badge>
      </div>
      <Content content={comment?.content?.schema || []} />
    </div>
  );
}
