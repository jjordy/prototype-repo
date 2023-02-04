import { useCallback } from "react";
import { Card, Input, Button } from "@jjordy/ui";
import { useForm } from "react-hook-form";
import Layout from "@/components/Layout";
import { api } from "@/lib";
import { useRouter } from "next/router";
import { useSWRConfig } from "swr";
import useAuth from "@/hooks/useAuth";
import { NextPageContext } from "next";
import client from "@jjordy/data";
import { isAuthenticated } from "@/lib/auth";

type ProfileProps = {
  profile: any;
};

export default function MyProfile({ profile }: ProfileProps) {
  useAuth({ onFail: () => push("/sign-in") });
  const { push } = useRouter();
  const { mutate } = useSWRConfig();
  const { handleSubmit, register } = useForm({ defaultValues: profile });
  const updateProfile = useCallback((values: any) => {
    api
      .post("/update-profile", values)
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
      <form onSubmit={handleSubmit(updateProfile)}>
        <Input
          type="text"
          {...register("name")}
          inline
          label="Name"
          placeholder="John Doe"
        />
        <Input
          type="email"
          disabled
          inline
          {...register("email")}
          label="Email Address"
          placeholder="johndoe@email.com"
        />
        <Input
          type="text"
          inline
          {...register("address_1")}
          label="Address 1"
          placeholder="1234 Splendid lane"
        />

        <Input
          type="text"
          inline
          {...register("address_2")}
          label="Address 2"
          placeholder="1234 Splendid lane"
        />
        <Input
          type="text"
          inline
          {...register("city")}
          label="City"
          placeholder="Gulfport"
        />
        <Input
          type="text"
          {...register("state")}
          inline
          label="State"
          placeholder="MS"
        />
        <Input
          type="text"
          {...register("zip_code")}
          inline
          label="Zip Code"
          placeholder="39507"
        />
        <Input
          type="tel"
          {...register("phone_number")}
          inline
          placeholder="+1*******"
          label="Phone Number (Optional)"
        />
        <Button className="my-8 w-full">Sign Up</Button>
      </form>
    </Layout>
  );
}

export async function getServerSideProps(ctx: NextPageContext) {
  const authenticated = isAuthenticated(ctx);
  console.log(authenticated);
  if (authenticated && authenticated.sub) {
    const profile = await client.user.findFirst({
      where: { id: authenticated.sub as unknown as number },
    });
    return {
      props: {
        profile,
      },
    };
  }
  return {
    props: {},
  };
}
