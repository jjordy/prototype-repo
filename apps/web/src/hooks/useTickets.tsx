import { trpc } from "@/lib/clients/trpc";
import { useRouter } from "next/router";
import useAuth from "./useAuth";
import useToast from "./useToast";

export default function useTickets({ id }: { id?: number }) {
  const { push } = useRouter();
  const { createToast } = useToast({});
  const { user } = useAuth({ onFail: () => push("/sign-in") });

  const { data: { items: tickets } = { items: [] }, refetch: refetchTickets } =
    trpc.ticket.list.useQuery(
      {
        id: user?.id,
      },
      { enabled: Boolean(user?.id) }
    );
  const { data: { items: otherTickets } = { items: [] } } =
    trpc.ticket.list.useQuery(
      {
        NOT: [{ assignee: { id: user?.id || 0 } }],
      },
      {
        enabled: Boolean(user?.id),
      }
    );

  const { data: ticket, refetch: refetchById } = trpc.ticket.byId.useQuery(
    {
      id: id ? id : 0,
    },
    { enabled: Boolean(id) }
  );

  const { mutate: update } = trpc.ticket.update.useMutation({
    onError: () => {
      createToast({
        title: "Error",
        content: "Unable to update ticket.",
        variant: "error",
      });
    },
    onSuccess: () => {
      createToast({
        title: "Success",
        content: "Ticket updated!",
        variant: "primary",
      });
      refetchById();
    },
  });

  const { mutate: create } = trpc.ticket.add.useMutation({
    onError: () => {
      createToast({
        title: "Error",
        content: "Unable to create ticket.",
        variant: "error",
      });
    },
    onSuccess: (data) => {
      createToast({
        title: "Success",
        content:
          "Your ticket creation is in progress, you will receive another notification when your ticket is ready.",
        variant: "primary",
      });
      refetchTickets();
      push(`/tickets/${data.id}`);
    },
  });

  const { mutate: createComment } = trpc.comment.create.useMutation({
    onError: () => {
      createToast({
        title: "Error",
        content: "Unable to create comment",
        variant: "error",
      });
    },
    onSuccess: () => {
      createToast({
        title: "Success",
        content: "Comment created!",
        variant: "primary",
      });
      refetchById();
    },
  });

  return {
    tickets,
    ticketById: ticket,
    otherTickets,
    update,
    create,
    createComment,
  };
}
