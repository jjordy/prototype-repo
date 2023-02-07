import Sidebar from "@/components/Sidebar";
import { TicketList } from "@/components/TicketList";
import useTickets from "@/hooks/useTickets";

export default function Dashboard() {
  const { tickets, otherTickets } = useTickets({});
  return (
    <div className="flex space-x-4">
      <Sidebar />
      <div className="w-full">
        <TicketList tickets={tickets} title="My Tickets" />
        <TicketList tickets={otherTickets} title="Other Tickets" />
      </div>
    </div>
  );
}
