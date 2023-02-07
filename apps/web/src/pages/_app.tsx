import "@/css/globals.css";
import "@jjordy/ui/styles.css";
import { Inter } from "@next/font/google";
import { trpc } from "@/lib/clients/trpc";

const inter = Inter({ subsets: ["latin"] });

function App({ Component, pageProps }: any) {
  return (
    <div className={inter.className}>
      <Component {...pageProps} />
    </div>
  );
}

export default trpc.withTRPC(App);
