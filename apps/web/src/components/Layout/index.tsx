import Link from "next/link";
import s from "./index.module.css";

export default function Layout({ children }) {
  return (
    <>
      <nav className={s.nav}>
        <ul className="mr-auto flex items-center">
          <li>
            <Link href="/">Logo</Link>
          </li>
        </ul>
        <ul className="flex items-center">
          <li>
            <Link href="/">1</Link>
          </li>
          <li>
            <Link href="/">2</Link>
          </li>
          <li>
            <Link href="/">3</Link>
          </li>
        </ul>
      </nav>
      <main className={s.content}>{children}</main>
    </>
  );
}
