import { Badge } from "@jjordy/ui";
import { formatDistanceToNowStrict } from "date-fns";
import Content from "./Content";
import { Card } from "@jjordy/ui";
import { RouterOutput } from "@/lib/clients/trpc";

type CommentProps = {
  comment: RouterOutput["comment"]["byId"];
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
      {comment.content &&
        typeof comment?.content === "object" &&
        !Array.isArray(comment?.content) && (
          <Content content={comment?.content?.schema} />
        )}
    </Card>
  );
}
