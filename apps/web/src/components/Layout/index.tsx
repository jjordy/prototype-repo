import Link from "next/link";
import useAuth from "@/hooks/useAuth";
import s from "./index.module.css";
import { useRouter } from "next/router";
import Logo from "./Logo";
import useToast from "@/hooks/useToast";
import classNames from "classnames";
import { BiCheckShield, BiX } from "react-icons/bi";

type LayoutProps = {
  children?: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  const { toasts, deleteToast } = useToast({});
  console.log(toasts);
  const { authenticated, user } = useAuth();
  return (
    <div className={s.wrapper}>
      <div className="relative">
        <div className="fixed right-0 z-10 flex h-12 items-center">
          {toasts?.map((toast) => (
            <div
              key={`active_toast_${toast.title}`}
              className={classNames(
                "z-10 mt-24 mr-24 w-96 rounded-2xl p-4",
                toast.variant === "primary" && " bg-indigo-500 text-white",
                toast.variant === "error" && "bg-red-500 text-white"
              )}
            >
              <div className="flex items-center">
                {toast.variant === "primary" && (
                  <BiCheckShield className="mr-2" />
                )}
                <div className="flex flex-col">
                  <div className="font-semibold">{toast.title}</div>
                  {toast.content}
                </div>
                <div className="mr-auto"></div>
                <button
                  className="flex items-center rounded bg-slate-200 p-0.5 text-xs text-slate-700"
                  onClick={() => deleteToast(toast)}
                >
                  Clear <BiX className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
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
      <main className={s.main}>
        <div>{children}</div>
      </main>
    </div>
  );
}
