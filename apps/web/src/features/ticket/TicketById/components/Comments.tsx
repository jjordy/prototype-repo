import AddComment from "./AddComment";
import Comment from "@/components/Comment";
import { Ticket, User } from "@jjordy/sync";

export default function Comments({
  createComment,
  user,
  ticket,
}: {
  ticket?: Ticket;
  user?: User;
  createComment: any;
}) {
  return (
    <div className="min-h-[200px] pt-8">
      <h4 className="text-lg font-medium">Comments</h4>
      <hr className="my-4" />
      <AddComment ticket={ticket} user={user} createComment={createComment} />
      {ticket?.comments?.map((comment) => (
        <Comment comment={comment} key={`comment_${comment?.id}`} />
      ))}
    </div>
  );
}
