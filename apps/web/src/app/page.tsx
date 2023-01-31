import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "./page.module.css";
import { getUser } from "@/lib";

const inter = Inter({ subsets: ["latin"] });

export default async function Home() {
  const user = await getUser({ id: 1 });
  return <main className={styles.main}></main>;
}
