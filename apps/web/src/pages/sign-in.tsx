import { useCallback } from "react";
import { Card, Button, Input } from "@jjordy/ui";
import { useForm } from "react-hook-form";
import Layout from "@/components/Layout";
import { api } from "@/lib";
import { useRouter } from "next/router";
import Link from "next/link";
import { useSWRConfig } from "swr";

export default function SignUpPage() {
  const { mutate } = useSWRConfig();
  const { push } = useRouter();
  const { handleSubmit, register } = useForm();
  const signin = useCallback((values: any) => {
    api
      .post("/sign-in", values)
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
      <div className="flex min-h-[750px] items-center justify-center">
        <Card className="max-w-xl">
          <h1 className="text-4xl tracking-wide">Sign in</h1>
          <hr className="my-4" />
          <form onSubmit={handleSubmit(signin)}>
            <Input
              type="email"
              placeholder="johndoe@email.com"
              label="Email"
              {...register("email")}
            />
            <Input
              label="Password"
              placeholder="**********"
              type="password"
              {...register("password")}
            />
            <Button className="my-8 w-full">Submit</Button>
            <div className="my-4 flex items-center justify-center">
              <Link
                href="/forgot-password"
                className=" font-semibold text-blue-900/60"
              >
                Forgot Password
              </Link>
            </div>
          </form>
        </Card>
      </div>
    </Layout>
  );
}
