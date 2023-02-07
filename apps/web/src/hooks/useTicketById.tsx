import { useRouter } from "next/router";
import useAuth from "./useAuth";
import useSWR from "swr";
import { Ticket } from "@/lib/data/ticket";
import { useCallback } from "react";
import { api } from "@/lib";
import useToast from "./useToast";
import { trpc } from "@/lib/clients/trpc";

type UseTicketsProps = {
  id: number;
};

export default function useTicketById({ id }: UseTicketsProps) {
  const { push } = useRouter();
  const { createToast } = useToast({});
  useAuth({ onFail: () => push("/sign-in") });
  const { data: ticket, refetch } = trpc.ticket.byId.useQuery({
    id: id,
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
      refetch();
    },
  });

  const { mutate: updateTicket } = trpc.ticket.update.useMutation({
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
      refetch();
    },
  });

  return {
    ticket,
    createComment,
    updateTicket,
  };
}
