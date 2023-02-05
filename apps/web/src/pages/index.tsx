import Layout from "@/components/Layout";
import { parseCookies } from "@/lib/auth";
import { Card } from "@jjordy/ui";
import { NextPageContext } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import cn from "classnames";
import useAuth from "@/hooks/useAuth";

export default function IndexPage() {
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
        <Card>Homepage Content</Card>
      </div>
    </div>
  );
  const unauthenticatedContent = <>Welcome to ticket desk</>;
  return (
    <Layout>{user ? authenticatedContent : unauthenticatedContent}</Layout>
  );
}

export async function getServerSideProps(ctx: NextPageContext) {
  const { headers = {} } = ctx?.req || {};
  const cookies = parseCookies(headers);
  return {
    props: {},
  };
}
