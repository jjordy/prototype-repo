import { useRouter } from "next/router";
import useAuth from "./useAuth";
import useSWR from "swr";
import { Ticket } from "@/lib/data/ticket";
import { useCallback } from "react";
import { api } from "@/lib";

type UseTicketsProps = {
  fallbackData: Ticket;
  id: number;
};

export default function useTicketById({ fallbackData, id }: UseTicketsProps) {
  const { push } = useRouter();
  const { user } = useAuth({ onFail: () => push("/sign-in") });
  const { data: ticket, mutate } = useSWR<Ticket>(`/tickets/${id}`, api.get, {
    fallbackData,
  });
  const createComment = useCallback(
    (values: { comment: string; ticket_id: number }) => {
      api
        .post("/comments", {
          content: values?.comment,
          author_id: user?.id,
          ticket_id: ticket?.id,
        })
        .then(() => mutate())
        .catch((err) => {
          console.log(err);
        });
    },
    [user, ticket]
  );
  const updateTicket = useCallback(
    (values: Ticket) => {
      api
        .put(`/tickets/${ticket?.id}`, values)
        .then(() => mutate())
        .catch((err) => {
          console.log(err);
        });
    },
    [user, ticket]
  );
  return {
    ticket,
    createComment,
    updateTicket,
  };
}
