import { FormSchema } from "@/components/Forms";
import { Modal } from "@jjordy/ui";
import { useRouter } from "next/router";
import useTickets from "@/hooks/useTickets";
import { JSONFormSchema } from "@jjordy/form-schema";

export default function CreateTicket({ schema }: { schema: JSONFormSchema }) {
  const { push } = useRouter();
  const { create } = useTickets({});
  return (
    <Modal
      open
      onClose={() => push("/")}
      title={<h1 className="text-2xl">Create a new ticket</h1>}
    >
      <hr />
      <FormSchema
        debug
        name="create_ticket_form"
        schema={schema}
        defaultValues={{}}
        onSubmit={create}
      />
    </Modal>
  );
}
