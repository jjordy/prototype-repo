import Layout from "@/components/Layout";
import { Modal } from "@jjordy/ui";
import { useRouter } from "next/router";
import { FormSchema } from "@jjordy/form-schema";
import { ComponentDictionary, controls } from "@/components/Forms";
import { NextPageContext } from "next";
import getSchema from "@/lib/form-schema";
import useTickets from "@/hooks/useTickets";

export default function CreateTicket({ schema }: any) {
  const { push } = useRouter();
  const { create } = useTickets({});
  return (
    <Layout>
      <Modal
        open
        onClose={() => push("/")}
        title={<h1 className="text-2xl">Create a new ticket</h1>}
      >
        <hr />
        <FormSchema
          debug
          name="create_ticket_form"
          schema={schema}
          defaultValues={{}}
          uiSchema={{
            controls,
          }}
          components={ComponentDictionary}
          onSubmit={create}
        />
      </Modal>
    </Layout>
  );
}

export async function getServerSideProps(ctx: NextPageContext) {
  const schema = getSchema("Ticket", {
    // Omit properties from the base schema we dont need.
    omit: ["comments", "author", "id", "updated_at", "created_at"],
    mutate: (key, values) => {
      if (key === "content") {
        return { ...values, component: "rte" };
      }
      return values;
    },
  });
  return {
    props: {
      schema,
    },
  };
}
