import Layout from "@/components/Layout";
import { api } from "@/lib";
import { Modal } from "@jjordy/ui";
import { useRouter } from "next/router";
import { FormSchema } from "@jjordy/form-schema";
import useSWR from "swr";
import { ComponentDictionary, controls } from "@/components/Forms";

export default function CreateTicket() {
  const { push } = useRouter();
  const { data } = useSWR("/tickets/json-schema", api.get);
  return (
    <Layout>
      <Modal
        open
        onClose={() => push("/")}
        title={<h1 className="text-2xl">Create a new ticket</h1>}
      >
        <hr />
        {data && (
          <FormSchema
            name="create_ticket_form"
            schema={data}
            defaultValues={{}}
            uiSchema={{
              // rowMap: [["name", "status"]],
              controls,
            }}
            components={ComponentDictionary}
            onSubmit={(v) => console.log(v)}
          />
        )}
      </Modal>
    </Layout>
  );
}
