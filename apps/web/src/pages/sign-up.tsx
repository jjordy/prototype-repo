import { useCallback } from "react";
import { Card, Input, Button } from "@jjordy/ui";
import { useForm } from "react-hook-form";
import Layout from "@/components/Layout";
import { api } from "@/lib";
import { useRouter } from "next/router";
import { useSWRConfig } from "swr";
import { Modal } from "@jjordy/ui";

export default function SignUpPage() {
  const { mutate } = useSWRConfig();
  const { handleSubmit, register } = useForm();
  const { push } = useRouter();
  const signin = useCallback((values: any) => {
    api
      .post("/sign-up", values)
      .then(({ path }) => {
        if (path) {
          mutate("/auth");
          push(path);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return (
    <Layout>
      <Modal
        open
        onClose={() => push("/")}
        title={<h1 className="text-2xl">Sign Up</h1>}
      >
        <form onSubmit={handleSubmit(signin)}>
          <Input
            type="text"
            {...register("name")}
            label="Name"
            placeholder="John Doe"
          />
          <Input
            type="email"
            {...register("email")}
            label="Email Address"
            placeholder="johndoe@email.com"
          />
          <div className="flex w-full items-center space-x-4">
            <Input
              type="password"
              {...register("password")}
              placeholder="********"
              label="Password"
            />
            <Input
              type="password"
              {...register("confirm_password")}
              placeholder="********"
              label="Confirm Password"
            />
          </div>
          <Input
            type="tel"
            {...register("phone_number")}
            placeholder="+1*******"
            label="Phone Number (Optional)"
          />
          <Button className="my-8 w-full">Sign Up</Button>
        </form>
      </Modal>
    </Layout>
  );
}
