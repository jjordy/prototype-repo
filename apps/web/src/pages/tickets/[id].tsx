import Layout from "@/components/Layout";
import { isAuthenticated } from "@/lib/auth";
import { Card, Badge } from "@jjordy/ui";
import { NextPageContext } from "next";
import { useRouter } from "next/router";
import useAuth from "@/hooks/useAuth";
import { getTicketById } from "@/lib/data/ticket";
import Priority from "@/components/Priority";
import { formatDistanceToNowStrict } from "date-fns";
import Link from "next/link";
import { FormSchema } from "@/components/Forms";
import { useCallback } from "react";
import { api } from "@/lib";
import useSWR from "swr";

type IndexPageProps = {
  ticket: Awaited<ReturnType<typeof getTicketById>>;
  children: React.ReactNode;
};

export default function TicketByIdPage({ ticket: ssTicket }: IndexPageProps) {
  const { push, query } = useRouter();
  const { user } = useAuth({ onFail: () => push("/sign-in") });
  const { data: ticket, mutate } = useSWR(`/tickets/${query?.id}`, api.get, {
    fallbackData: ssTicket,
  });
  const createComment = useCallback((values: { comment: string }) => {
    api
      .post("/comments", {
        content: values?.comment,
        author_id: user?.id,
        ticket_id: ticket?.id,
      })
      .then(() => mutate())
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return (
    <Layout>
      <Card>
        <h2 className="my-4 text-2xl font-medium">{ticket?.title}</h2>
        <hr className="my-8" />
        <div className="flex">
          <div className="w-5/6">
            <div className="min-h-[550px]">{ticket?.content}</div>
            <div className="min-h-[200px]">
              <h4 className="text-lg font-medium">Comments</h4>
              <hr className="my-4" />

              {ticket?.comments?.map((comment) => (
                <div
                  key={`comment_${comment?.id}`}
                  className="mb-4 rounded border border-slate-300 p-4 "
                >
                  <div className="mb-2 flex items-center">
                    <Badge variant="primary" className="mr-2">
                      {comment.author.name}
                    </Badge>
                    <div className="mr-auto"></div>
                    <Badge>
                      {formatDistanceToNowStrict(new Date(comment.created_at), {
                        addSuffix: true,
                      })}
                    </Badge>
                  </div>

                  {comment.content}
                </div>
              ))}
              <FormSchema
                defaultValues={{ comment: "" }}
                name="add_comment_form"
                onSubmit={createComment}
                schema={{
                  $schema: "http://json-schema.org/draft-07/schema#",
                  properties: {
                    comment: {
                      type: "string",
                      component: "textarea",
                      title: "Add a comment",
                      isNotEmpty: true,
                    },
                  },
                }}
              />
            </div>
          </div>
          <div className="flex w-1/6 flex-col space-y-4">
            <Priority level={ticket?.priority} />
            <div className="flex items-center justify-center rounded bg-slate-100 p-1 text-xs font-bold text-slate-700 ">
              {ticket?.status}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="ml-1 h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                />
              </svg>
            </div>
            <div className="flex items-center justify-between font-semibold">
              Assignee:{" "}
              <Link
                href={`/users/${ticket?.assignee?.id}`}
                className="rounded-2xl bg-indigo-300 px-4 py-1 text-sm font-semibold text-indigo-700"
              >
                {ticket?.assignee?.name}
              </Link>
            </div>
            <div className="flex items-center justify-between font-semibold">
              <span>Created: </span>
              <span className="rounded-2xl bg-slate-300 px-4 py-1 text-sm font-semibold text-slate-700">
                {ticket?.created_at &&
                  formatDistanceToNowStrict(new Date(ticket?.created_at), {
                    addSuffix: true,
                  })}
              </span>
            </div>
            <div className="flex items-center justify-between font-semibold">
              <span>Updated: </span>
              <span className="rounded-2xl bg-slate-300 px-4 py-1 text-sm font-semibold text-slate-700">
                {ticket?.updated_at &&
                  formatDistanceToNowStrict(new Date(ticket?.updated_at), {
                    addSuffix: true,
                  })}
              </span>
            </div>
          </div>
        </div>
      </Card>
    </Layout>
  );
}

export async function getServerSideProps(ctx: NextPageContext) {
  const { query } = ctx;
  const authenticated = isAuthenticated(ctx);
  let _props: any = {};
  if (authenticated && authenticated.sub) {
    _props.ticket = await getTicketById({
      id: parseInt(query.id as string, 10),
    });
  }
  return {
    // this fixes serializing dates some how
    // just wild
    props: { ...JSON.parse(JSON.stringify(_props)) },
  };
}
