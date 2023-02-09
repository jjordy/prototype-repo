import Priority from "./components/Priority";
import Status from "./components/Status";
import useAuth from "@/hooks/useAuth";
import useTickets from "@/hooks/useTickets";
import { Card } from "@jjordy/ui";
import { useRouter } from "next/router";
import EditableContent from "./components/EditableContent";
import UserLabel from "./components/UserLabel";
import DateLabel from "./components/DateLabel";
import Sidebar from "./components/Sidebar";
import Main from "./components/Main";
import Comments from "./components/Comments";

export default function TicketById() {
  const { query } = useRouter();
  const { user } = useAuth();
  const {
    createComment,
    update,
    ticketById: ticket,
  } = useTickets({
    id: Number(query.id),
  });
  return (
    <>
      <h2 className="my-4 text-2xl font-medium">{ticket?.title}</h2>
      <div className="flex space-x-8">
        <Main>
          <Card className="p-16">
            <EditableContent ticket={ticket} update={update} />
          </Card>
          <Comments ticket={ticket} user={user} createComment={createComment} />
        </Main>
        <Sidebar>
          <Priority level={ticket?.priority} />
          <Status status={ticket?.status} />
          <UserLabel label="Assignee" name={ticket?.assignee?.name} />
          <UserLabel label="Creator" name={ticket?.author?.name} />
          <DateLabel date={ticket?.created_at} label="Created" />
          <DateLabel date={ticket?.updated_at} label="Updated" />
        </Sidebar>
      </div>
    </>
  );
}
