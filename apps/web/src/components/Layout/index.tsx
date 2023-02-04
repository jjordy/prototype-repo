import Link from "next/link";
import useAuth from "@/hooks/useAuth";
import s from "./index.module.css";
import { Button, Card } from "@jjordy/ui";
import { useRouter } from "next/router";
import cn from "classnames";
import Logo from "./Logo";

type LayoutProps = {
  children?: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  const { pathname } = useRouter();
  const { authenticated, user } = useAuth();
  return (
    <div className={s.wrapper}>
      <nav className={s.nav}>
        <div className="container mx-auto">
          <div className="flex w-full items-center">
            <ul className="mr-auto flex items-center">
              <li>
                <Logo />
              </li>
            </ul>
            {authenticated && user ? (
              <ul className="flex items-center space-x-8">
                <Link
                  href="/tickets/create"
                  className="rounded-lg bg-indigo-500 px-2.5 py-1.5 text-white"
                >
                  Create Ticket
                </Link>
                <li>{user.name}</li>
                <li className="text-slate-600">|</li>
                <li>
                  <Link href="/profile" className="text-slate-600">
                    My Profile
                  </Link>
                </li>
                <li>
                  <Link href="/api/v1/logout " className="text-slate-600">
                    Logout
                  </Link>
                </li>
              </ul>
            ) : (
              <ul className="flex items-center space-x-8">
                <li>
                  <Link href="/sign-in">Sign In</Link>
                </li>
                <li>
                  <Link href="/sign-up">Sign Up</Link>
                </li>
              </ul>
            )}
          </div>
        </div>
      </nav>
      {!authenticated && <main className={s.main}>{children}</main>}
      {authenticated && (
        <main className={s.main}>
          <div className="flex space-x-4">
            <div className={s.sidebar}>
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
                    href={`/tickets?assignee=${user?.id}`}
                    className={cn("p-2", {
                      "font-bold": pathname.includes("/tickets"),
                    })}
                  >
                    My Tickets
                  </Link>
                </div>
              </Card>
            </div>
            <div className={s.content}>
              <Card>{children}</Card>
            </div>
          </div>
        </main>
      )}
    </div>
  );
}
