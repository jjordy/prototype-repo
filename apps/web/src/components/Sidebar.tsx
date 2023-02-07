import { Card } from "@jjordy/ui";
import Link from "next/link";
import cn from "classnames";
import { useRouter } from "next/router";

export default function Sidebar() {
  const { pathname } = useRouter();

  return (
    <div className="min-w-[250px]">
      <Card>
        <div className="flex flex-col text-slate-800">
          <Link
            href="/"
            className={cn("border-b border-slate-200 p-2", {
              "font-bold": pathname === "/",
            })}
          >
            Home
          </Link>
          <Link
            href={`/boards`}
            className={cn("p-2", {
              "font-bold": pathname.includes("/tickets"),
            })}
          >
            Boards
          </Link>
          <Link
            href={`/tickets`}
            className={cn("p-2", {
              "font-bold": pathname.includes("/tickets"),
            })}
          >
            Tickets
          </Link>
        </div>
      </Card>
    </div>
  );
}
