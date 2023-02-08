import { Modal } from "@jjordy/ui";
import Layout from "@/components/Layout";
import { useRouter } from "next/router";
import { FormSchema } from "@/components/Forms";
import useUser from "@/hooks/useUser";
import { JSONFormSchema } from "@jjordy/form-schema";

const SIGN_IN_FORM_SCHEMA: JSONFormSchema = {
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
      description: "Enter the password you used when you created your account",
      isNotEmpty: true,
      errorMessage: "Please enter your password",
    },
  },
  type: "object",
};

export default function SignInPage() {
  const { push } = useRouter();
  const { signin } = useUser({ anonymous: true });
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
          schema={SIGN_IN_FORM_SCHEMA}
        />
      </Modal>
    </Layout>
  );
}
