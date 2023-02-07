import Layout from "@/components/Layout";
import { Card } from "@jjordy/ui";
import Link from "next/link";
import { useRouter } from "next/router";
import cn from "classnames";
import useAuth from "@/hooks/useAuth";
import { TicketList } from "@/components/TicketList";
import useTickets from "@/hooks/useTickets";

export default function IndexPage() {
  const { pathname } = useRouter();
  const { user } = useAuth();
  const { tickets, otherTickets } = useTickets({});
  const authenticatedContent = (
    <div className="flex space-x-4">
      <div className="min-w-[250px]">
        <Card>
          <div className="flex flex-col text-slate-800">
            <Link
              href="/"
              className={cn("border-b border-slate-200 p-2", {
                "font-bold": pathname === "/",
              })}
            >
              Home
            </Link>
            <Link
              href={`/boards`}
              className={cn("p-2", {
                "font-bold": pathname.includes("/tickets"),
              })}
            >
              Boards
            </Link>
            <Link
              href={`/tickets`}
              className={cn("p-2", {
                "font-bold": pathname.includes("/tickets"),
              })}
            >
              Tickets
            </Link>
          </div>
        </Card>
      </div>
      <div className="w-full">
        <TicketList tickets={tickets} title="My Tickets" />
        <TicketList tickets={otherTickets} title="Other Tickets" />
      </div>
    </div>
  );
  const unauthenticatedContent = <>Welcome to ticket desk</>;
  return (
    <Layout>{user ? authenticatedContent : unauthenticatedContent}</Layout>
  );
}
