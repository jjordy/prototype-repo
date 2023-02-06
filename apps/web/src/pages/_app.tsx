import "@/css/globals.css";
import "@jjordy/ui/styles.css";
import { SWRConfig } from "swr";
import { Inter } from "@next/font/google";
import { trpc } from "@/lib/trpc";

const inter = Inter({ subsets: ["latin"] });

function App({ Component, pageProps }: any) {
  return (
    <div className={inter.className}>
      <SWRConfig value={{ refreshInterval: 0 }}>
        <Component {...pageProps} />
      </SWRConfig>
    </div>
  );
}

export default trpc.withTRPC(App);
