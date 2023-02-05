import { useCallback } from "react";
import { useForm } from "react-hook-form";
import Layout from "@/components/Layout";
import { api } from "@/lib";
import { useRouter } from "next/router";
import { useSWRConfig } from "swr";
import useAuth from "@/hooks/useAuth";
import { NextPageContext } from "next";
import client from "@jjordy/data";
import { isAuthenticated } from "@/lib/auth";
import useSWR from "swr";
import { FormSchema } from "@jjordy/form-schema";
import { ComponentDictionary, controls } from "@/components/Forms";
import { ListPlaceholder } from "@jjordy/ui";
import getSchema, { titleCase } from "@/lib/getSchema";
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
  console.log(schema);
  return (
    <Layout>
      <div className="flex items-center justify-center">
        <h1 className="text-xl font-semibold tracking-wide">My Profile</h1>
      </div>
      <hr className="my-8 block" />

      {schema ? (
        <FormSchema
          name="create_ticket_form"
          schema={schema}
          defaultValues={profile}
          uiSchema={{
            controls,
          }}
          components={ComponentDictionary}
          onSubmit={updateProfile}
        />
      ) : (
        <ListPlaceholder />
      )}
    </Layout>
  );
}

export async function getServerSideProps(ctx: NextPageContext) {
  const authenticated = isAuthenticated(ctx);
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
    mutate: (key: string, values: any) => ({
      title: titleCase(key),
      ...values,
    }),
  });
  if (authenticated && authenticated.sub) {
    const profile = await client.user.findFirst({
      where: { id: authenticated.sub as unknown as number },
      select: {
        email: true,
        id: true,
        name: true,
        phone_number: true,
        address_1: true,
        address_2: true,
        city: true,
        state: true,
        zip_code: true,
      },
    });
    return {
      props: {
        profile,
        schema,
      },
    };
  }
  return {
    props: {
      schema,
    },
  };
}
