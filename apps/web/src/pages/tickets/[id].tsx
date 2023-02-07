import { useState } from "react";
import Layout from "@/components/Layout";
import Comment from "@/components/Comment";
import { Card } from "@jjordy/ui";
import { useRouter } from "next/router";
import Priority from "@/components/Priority";
import { formatDistanceToNowStrict } from "date-fns";
import Link from "next/link";
import { FormSchema } from "@/components/Forms";
import useTicketById from "@/hooks/useTicketById";
import Content from "@/components/Content";

export default function TicketByIdPage() {
  const { query } = useRouter();
  const [editTicketContent, setEditTicketContent] = useState(false);
  const { createComment, updateTicket, ticket } = useTicketById({
    id: Number(query.id),
  });
  const content: any = ticket?.content;
  return (
    <Layout>
      <h2 className="my-4 text-2xl font-medium">{ticket?.title}</h2>
      <div className="flex space-x-8">
        <div className="w-5/6">
          <Card className="p-16">
            <div className=" group min-h-[550px]">
              <div className="relative flex justify-end">
                <button
                  onClick={() => setEditTicketContent((prev) => !prev)}
                  className="absolute hidden text-sm font-semibold uppercase text-slate-700 underline group-hover:block"
                >
                  Edit
                </button>
              </div>
              {editTicketContent ? (
                <FormSchema
                  defaultValues={{
                    content: content?.schema,
                    id: ticket?.id,
                  }}
                  name="edit_ticket_content_form"
                  debug
                  onSubmit={updateTicket}
                  schema={{
                    $schema: "http://json-schema.org/draft-07/schema#",
                    properties: {
                      content: {
                        type: "object",
                        component: "rte",
                        title: "Edit Ticket",
                        isNotEmpty: true,
                      },
                      id: {
                        type: "number",
                        component: "hidden",
                      },
                    },
                  }}
                />
              ) : (
                <Content content={content?.schema || []} />
              )}
            </div>
          </Card>
        </div>
        <div className="flex w-1/6 flex-col items-stretch">
          <Card className="h-full">
            <div className="flex flex-col space-y-4">
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
                {ticket?.assignee?.name && (
                  <Link
                    href={`/users/${ticket?.assignee?.id}`}
                    className="rounded-2xl bg-indigo-300 px-4 py-1 text-sm font-semibold text-indigo-700"
                  >
                    {ticket?.assignee?.name}
                  </Link>
                )}
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
          </Card>
        </div>
      </div>
      <div className="flex space-x-8">
        <div className="w-5/6">
          <div className="min-h-[200px] pt-8">
            <h4 className="text-lg font-medium">Comments</h4>
            <hr className="my-4" />
            <FormSchema
              defaultValues={{ comment: "" }}
              name="add_comment_form"
              debug
              onSubmit={createComment}
              schema={{
                $schema: "http://json-schema.org/draft-07/schema#",
                properties: {
                  comment: {
                    type: "object",
                    component: "rte",
                    title: "Add a comment",
                    isNotEmpty: true,
                  },
                },
              }}
            />
            {ticket?.comments?.map((comment) => (
              <Comment comment={comment} key={`comment_${comment?.id}`} />
            ))}
          </div>
        </div>
        <div className="w-1/6"></div>
      </div>
    </Layout>
  );
}
