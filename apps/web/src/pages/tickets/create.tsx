import Layout from "@/components/Layout";
import { api } from "@/lib";
import { Modal } from "@jjordy/ui";
import { useRouter } from "next/router";
import { FormSchema } from "@jjordy/form-schema";
import useSWR from "swr";
import { ComponentDictionary, controls } from "@/components/Forms";
import { NextPageContext } from "next";
import getSchema, { titleCase } from "@/lib/getSchema";
import { useCallback } from "react";

type Ticket = any;

export default function CreateTicket({ schema }: any) {
  const { push } = useRouter();
  const createTicket = useCallback((data: Ticket) => {
    api
      .post("/tickets", data)
      .then((data) => console.log(data))
      .catch((err) => console.log(err));
  }, []);
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
          onSubmit={createTicket}
        />
      </Modal>
    </Layout>
  );
}

export async function getServerSideProps(ctx: NextPageContext) {
  const schema = getSchema("Ticket", {
    // Omit properties from the base schema we dont need.
    omit: ["comments", "author", "id", "updated_at", "created_at"],
    // mutate the properties to add a title :)
    // this is a keyword our form handler looks for on the json schema.
    mutate: (key: string, values: any) => {
      if (key === "content") {
        return {
          title: titleCase(key),
          component: "rte",
          ...values,
        };
      }
      return {
        title: titleCase(key),
        ...values,
      };
    },
  });
  return {
    props: {
      schema,
    },
  };
}
