import { Badge } from "@jjordy/ui";
import { formatDistanceToNowStrict } from "date-fns";
import { Prisma } from "@jjordy/data";
import type { Comment } from "@/lib/data/comment";
import { serialize } from "@/lib/content";
import Content from "./Content";
import { Card } from "@jjordy/ui";

type CommentProps = {
  comment: Comment;
};

export default function Comment({ comment }: CommentProps) {
  return (
    <Card className="mb-4">
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
    </Card>
  );
}
