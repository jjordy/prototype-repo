import { useCallback } from "react";
import Layout from "@/components/Layout";
import { api } from "@/lib";
import { useRouter } from "next/router";
import { useSWRConfig } from "swr";
import useAuth from "@/hooks/useAuth";
import { NextPageContext } from "next";
import client from "@jjordy/data";
import { isAuthenticated } from "@/lib/auth";
import { FormSchema } from "@jjordy/form-schema";
import { ComponentDictionary, controls } from "@/components/Forms";
import getSchema from "@/lib/schema";
import { getUserById } from "@/lib/data/user";

type ProfileProps = {
  profile: any;
  schema: any;
};

export default function MyProfile({ profile, schema }: ProfileProps) {
  useAuth({ onFail: () => push("/sign-in") });
  const { push } = useRouter();
  const { mutate } = useSWRConfig();
  const updateProfile = useCallback((values: any) => {
    api
      .put("/user", values)
      .then(() => mutate("/user"))
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return (
    <Layout>
      <div className="flex items-center justify-center">
        <h1 className="text-xl font-semibold tracking-wide">My Profile</h1>
      </div>
      <hr className="my-8 block" />
      <FormSchema
        name="create_ticket_form"
        schema={schema}
        debug
        defaultValues={profile}
        uiSchema={{
          controls,
        }}
        components={ComponentDictionary}
        onSubmit={updateProfile}
      />
    </Layout>
  );
}

export async function getServerSideProps(ctx: NextPageContext) {
  const { query } = ctx;
  const authenticated = isAuthenticated(ctx);
  let _props: any = {};
  if (authenticated && authenticated.sub) {
    _props.profile = await getUserById({
      id: parseInt(authenticated.sub as string, 10),
    });
  }
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
    // this fixes serializing dates some how
    // just wild
    props: { ...JSON.parse(JSON.stringify(_props)), schema },
  };
}
