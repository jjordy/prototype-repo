import Layout from "@/components/Layout";
import { FormSchema } from "@/components/Forms/index";
import { NextPageContext } from "next";
import getSchema from "@/lib/form-schema";
import { Card } from "@jjordy/ui";
import { JSONFormSchema } from "@jjordy/form-schema";
import useUser from "@/hooks/useUser";

type ProfileProps = {
  schema: JSONFormSchema;
};

export default function MyProfile({ schema }: ProfileProps) {
  const { profile, update } = useUser();
  return (
    <Layout>
      <Card>
        <div className="flex items-center justify-center">
          <h1 className="text-xl font-semibold tracking-wide">My Profile</h1>
        </div>
        <hr className="my-8 block" />
        {schema && profile && (
          <FormSchema
            name="create_ticket_form"
            schema={schema}
            debug
            defaultValues={profile}
            onSubmit={update}
          />
        )}
      </Card>
    </Layout>
  );
}

export async function getServerSideProps(ctx: NextPageContext) {
  const schema = getSchema("User", {
    omit: [
      "hash",
      "salt",
      "created_at",
      "updated_at",
      "assigned_tickets",
      "owned_tickets",
      "id",
    ],
  });
  return {
    props: { schema },
  };
}
