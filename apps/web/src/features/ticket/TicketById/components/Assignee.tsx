import { Ticket } from "@jjordy/sync";
import Link from "next/link";

export default function Assignee({ ticket }: { ticket: Ticket | undefined }) {
  return (
    <div className="flex items-center justify-between font-semibold">
      Assignee:{" "}
      {ticket?.assignee?.name && (
        <Link
          href={`/users/${ticket?.assignee?.id}`}
          className="rounded-2xl bg-indigo-300 px-4 py-1 text-sm font-semibold text-indigo-700"
        >
          {ticket?.assignee?.name}
        </Link>
      )}
    </div>
  );
}
