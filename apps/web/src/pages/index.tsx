import Layout from "@/components/Layout";
import { isAuthenticated } from "@/lib/auth";
import { Card } from "@jjordy/ui";
import { NextPageContext } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import cn from "classnames";
import useAuth from "@/hooks/useAuth";
import { getTickets } from "@/lib/data/ticket";
import Priority from "@/components/Priority";

type IndexPageProps = {
  myTickets: Awaited<ReturnType<typeof getTickets>>;
  otherTickets: Awaited<ReturnType<typeof getTickets>>;
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
              href={`/tickets?assignee=${user?.id}`}
              className={cn("p-2", {
                "font-bold": pathname.includes("/tickets"),
              })}
            >
              My Tickets
            </Link>
          </div>
        </Card>
      </div>
      <div className="w-full">
        <Card>
          <h2 className="my-4 text-2xl font-medium">My Tickets</h2>
          {tickets.map((ticket) => (
            <div
              key={`ticket_list_item_${ticket.id}`}
              className="mb-4 flex items-center rounded-2xl border border-slate-500 p-4"
            >
              <div className="font-semibold text-slate-700">
                <Link href={`/tickets/${ticket.id}`}>{ticket.title}</Link>
              </div>
              <div className="mr-auto"></div>
              <Priority level={ticket.priority} />

              <div className="mx-4 rounded bg-slate-100 p-1 text-xs font-bold text-slate-700 ">
                {ticket.status}
              </div>
              {ticket.created_at}
            </div>
          ))}
          <h3 className="text-md my-4 font-medium">Other Tickets</h3>
          {otherTickets?.map((ticket) => (
            <div
              key={`ticket_list_item_${ticket.id}`}
              className="mb-4 flex items-center rounded-2xl border border-slate-500 p-4"
            >
              <div className="font-semibold text-slate-700">
                <Link href={`/tickets/${ticket.id}`}>{ticket.title}</Link>
              </div>
              <div className="mr-auto"></div>
              <div className="mx-4 rounded bg-slate-100 p-1 text-xs font-bold text-slate-700">
                {ticket.status}
              </div>
              {ticket.created_at}
            </div>
          ))}
        </Card>
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
