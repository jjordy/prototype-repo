import Layout from "@/components/Layout";
import { JSONFormSchema } from "@jjordy/form-schema";
import { NextPageContext } from "next";
import getSchema from "@/lib/form-schema";
import CreateTicket from "@/features/ticket/Create";

export default function CreateTicketPage(props: { schema: JSONFormSchema }) {
  return (
    <Layout>
      <CreateTicket {...props} />
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
