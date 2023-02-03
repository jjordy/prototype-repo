import "../css/globals.css";
import "@jjordy/ui/styles.css";
import { SWRConfig } from "swr/_internal";

export default function App({ Component, pageProps }: any) {
  return (
    <SWRConfig value={{ refreshInterval: 0 }}>
      <Component {...pageProps} />
    </SWRConfig>
  );
}
