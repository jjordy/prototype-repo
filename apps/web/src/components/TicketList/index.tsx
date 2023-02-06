import { Ticket } from "@/lib/data/ticket";
import { TicketListItem } from "./ListItem";

export function TicketList({
  tickets,
  title,
}: {
  tickets: Ticket[];
  title: string;
}) {
  return (
    <div>
      <h2 className="my-4 text-xl font-medium text-slate-700">{title}</h2>
      {tickets.map((ticket) => (
        <TicketListItem
          ticket={ticket}
          key={`ticket_list_item_${ticket?.id}`}
        />
      ))}
    </div>
  );
}

export * from "./ListItem";
