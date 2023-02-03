import Link from "next/link";
import useAuth from "../../hooks/useAuth";
import s from "./index.module.css";

type LayoutProps = {
  children?: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  const { authenticated, user } = useAuth();
  console.log(authenticated, user);
  return (
    <div className={s.wrapper}>
      <nav className={s.nav}>
        <div className="container mx-auto">
          <div className="flex items-center">
            <ul className="mr-auto flex items-center">
              <li>
                <Link href="/">Logo</Link>
              </li>
            </ul>
            <ul className="flex items-center space-x-8">
              <li>
                <Link href="/sign-in">Sign In</Link>
              </li>
              <li>
                <Link href="/sign-up">Sign Up</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <main className={s.content}>{children}</main>
    </div>
  );
}
