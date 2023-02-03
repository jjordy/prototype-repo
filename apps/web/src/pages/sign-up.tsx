import { useCallback } from "react";
import { Card, Input, Button } from "@jjordy/ui";
import { useForm } from "react-hook-form";
import Layout from "@/components/Layout";
import { api } from "@/lib";
import { useRouter } from "next/router";
import { useSWRConfig } from "swr";

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
      <div className="flex items-center justify-center">
        <Card className="max-w-2xl">
          <div className="flex items-center justify-center">
            <h1 className="text-xl font-semibold tracking-wide">Sign up</h1>
          </div>
          <hr className="my-8 block" />
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
        </Card>
      </div>
    </Layout>
  );
}
