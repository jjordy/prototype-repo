import { useCallback } from "react";
import { Card, Button, Input, Modal } from "@jjordy/ui";
import { useForm } from "react-hook-form";
import Layout from "@/components/Layout";
import { api } from "@/lib";
import { useRouter } from "next/router";
import Link from "next/link";
import { useSWRConfig } from "swr";
import { FormSchema } from "@/components/Forms";

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
      <Modal
        open
        onClose={() => push("/")}
        title={<h1 className="text-2xl">Sign In</h1>}
      >
        <FormSchema
          name="login_form"
          defaultValues={{ email: "", password: "" }}
          onSubmit={signin}
          debug
          schema={{
            $schema: "http://json-schema.org/draft-07/schema#",
            properties: {
              email: {
                type: "string",
                component: "email",
                title: "Email",
                description:
                  "Enter your email address you used when you created your account",
                isNotEmpty: true,
                errorMessage: "Please enter your email",
              },
              password: {
                type: "string",
                component: "password",
                description:
                  "Enter the password you used when you created your account",
                isNotEmpty: true,
                errorMessage: "Please enter your password",
              },
            },
            type: "object",
            // required: ["email", "password"],
          }}
        />
      </Modal>
    </Layout>
  );
}
