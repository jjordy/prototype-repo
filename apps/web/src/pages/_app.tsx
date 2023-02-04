import "@/css/globals.css";
import "@jjordy/ui/styles.css";
import { SWRConfig } from "swr";
import { Inter } from "@next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function App({ Component, pageProps }: any) {
  return (
    <div className={inter.className}>
      <SWRConfig value={{ refreshInterval: 0 }}>
        <Component {...pageProps} />
      </SWRConfig>
    </div>
  );
}
