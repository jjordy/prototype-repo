import Link from "next/link";
import useAuth from "@/hooks/useAuth";
import s from "./index.module.css";
import { useRouter } from "next/router";
import Logo from "./Logo";
import useToast from "@/hooks/useToast";
import classNames from "classnames";
import { BiCheckShield, BiX } from "react-icons/bi";
import Toasts from "../Toasts";

type LayoutProps = {
  children?: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  const { authenticated, user } = useAuth();
  return (
    <div className={s.wrapper}>
      <Toasts />
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
                  <Link href="/api/logout " className="text-slate-600">
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
      <main className={s.main}>
        <div>{children}</div>
      </main>
    </div>
  );
}
