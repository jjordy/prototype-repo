import { Ticket } from "@/lib/data/ticket";
import { formatDistanceToNowStrict } from "date-fns";
import Link from "next/link";
import Avatar from "../Avatar";
import Priority from "../Priority";

export function TicketListItem({ ticket }: { ticket: Ticket }) {
  return (
    <div className="mb-4 flex h-24 flex-col rounded-2xl border border-slate-300 bg-white shadow">
      <div className=" flex w-full items-center p-2 font-semibold text-slate-700">
        <Avatar name={ticket?.assignee?.name} className="mr-2" />
        <Link href={`/tickets/${ticket?.id}`} className="hover:animate-pulse">
          {ticket?.title}{" "}
        </Link>
        <div className="mr-auto"></div>
        <Priority level={ticket?.priority} />
        <div className="mx-4 rounded bg-slate-100 p-1 text-xs font-bold text-slate-700 ">
          {ticket?.status}
        </div>
      </div>
      <div className=" flex w-full items-start p-2 font-semibold text-slate-700">
        <div className="mr-auto"></div>
        <div className=" mx-4 text-sm font-semibold text-slate-500">
          {ticket?.created_at &&
            formatDistanceToNowStrict(new Date(ticket.created_at), {
              addSuffix: true,
            })}
        </div>
      </div>
    </div>
  );
}
