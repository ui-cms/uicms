import Layout from "@/components/layout";
import { StateManagement } from "@/services/stateManagement/stateManagement";
import "@/styles/_globals.scss";

export default function App({ Component, pageProps }) {
  return (
    <StateManagement>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </StateManagement>
  );
}
