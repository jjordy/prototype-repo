import Layout from "@/components/Layout";
import { FormSchema } from "@/components/Forms/index";
import { useRouter } from "next/router";
import useAuth from "@/hooks/useAuth";
import { NextPageContext } from "next";
import getSchema from "@/lib/schema";
import useToast from "@/hooks/useToast";
import { Card } from "@jjordy/ui";
import { trpc } from "@/lib/clients/trpc";
import { JSONFormSchema } from "@jjordy/form-schema";

type ProfileProps = {
  schema: JSONFormSchema;
};

export default function MyProfile({ schema }: ProfileProps) {
  const { push } = useRouter();
  const { user } = useAuth({ onFail: () => push("/sign-in") });
  const { createToast } = useToast();
  const { data: profile, refetch } = trpc.user.byId.useQuery(
    { id: (user && user.id) || 0 },
    { enabled: Boolean(user?.id) }
  );

  const { mutate } = trpc.user.update.useMutation({
    onSuccess: () => {
      refetch();
      createToast({
        title: "Success",
        content: "Profile updated",
        variant: "primary",
      });
    },
    onError: () => {
      createToast({
        title: "Error",
        content: "Unable to update profile",
        variant: "error",
      });
    },
  });
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
            onSubmit={mutate}
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
