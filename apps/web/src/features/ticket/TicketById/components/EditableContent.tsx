import Content from "@/components/Content";
import { FormSchema } from "@/components/Forms";
import { Ticket } from "@jjordy/sync";
import { useState } from "react";

export default function EditableContent({
  ticket,
  update,
}: {
  ticket?: Ticket;
  update: any;
}) {
  const [editTicketContent, setEditTicketContent] = useState(false);
  const content: any = ticket?.content;
  return (
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
          onSubmit={update}
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
  );
}
