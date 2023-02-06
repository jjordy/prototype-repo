import Layout from "@/components/Layout";
import { isAuthenticated } from "@/lib/auth";
import { Card } from "@jjordy/ui";
import { NextPageContext } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import cn from "classnames";
import useAuth from "@/hooks/useAuth";
import { getTickets, Ticket } from "@/lib/data/ticket";
import { formatDistanceToNowStrict } from "date-fns";
import { TicketList } from "@/components/TicketList";

type IndexPageProps = {
  myTickets: Ticket[];
  otherTickets: Ticket[];
};

export default function IndexPage({
  myTickets: tickets,
  otherTickets,
}: IndexPageProps) {
  const { pathname } = useRouter();
  const { user } = useAuth();

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

export async function getServerSideProps(ctx: NextPageContext) {
  const authenticated = isAuthenticated(ctx);
  let _props: any = {};
  if (authenticated && authenticated.sub) {
    _props.myTickets = await getTickets({
      assignee: {
        id: parseInt(authenticated.sub, 10),
      },
    });
    _props.otherTickets = await getTickets({
      NOT: [{ assignee: { id: parseInt(authenticated.sub, 10) } }],
    });
  }
  return {
    // this fixes serializing dates some how
    // just wild
    props: { ...JSON.parse(JSON.stringify(_props)) },
  };
}
