import Layout from "@/components/Layout";
import { useRouter } from "next/router";
import { Modal } from "@jjordy/ui";
import { FormSchema } from "@/components/Forms";
import getSchema from "@/lib/form-schema";
import { JSONFormSchema } from "@jjordy/form-schema";
import useUser from "@/hooks/useUser";

export default function SignUpPage({ schema }: { schema: JSONFormSchema }) {
  const { push } = useRouter();
  const { signup } = useUser({ anonymous: true });
  return (
    <Layout>
      <Modal
        open
        onClose={() => push("/")}
        title={<h1 className="text-2xl">Sign Up</h1>}
      >
        <FormSchema
          schema={schema}
          uiSchema={{
            controls: {},
            rowMap: [
              ["email"],
              ["name"],
              ["password", "confirm_password"],
              ["phone_number"],
            ],
          }}
          name="sign_up_form"
          defaultValues={{}}
          onSubmit={signup}
        />
      </Modal>
    </Layout>
  );
}

export async function getServerSideProps() {
  const schema = getSchema("User", {
    omit: [
      "hash",
      "salt",
      "created_at",
      "updated_at",
      "assigned_tickets",
      "owned_tickets",
      "id",
      "address_1",
      "address_2",
      "city",
      "state",
      "comments",
      "zip_code",
    ],
    add: {
      password: {
        title: "Password",
        type: "string",
        component: "password",
        description:
          "Enter a password please include one capital letter, one special character and one number.",
      },
      confirm_password: {
        title: "Confirm Password",
        type: "string",
        component: "password",
        description: "Please confirm your password.",
      },
    },
  });
  return {
    props: { schema },
  };
}
