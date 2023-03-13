import Page, { Loader } from "@/components/layout/page";
import Tabs from "@/components/tabs/tabs";
import useStorage from "@/hooks/useStorage";

export default function Test() {
  const [testVal, setTestVal] = useStorage("test", "localStorage");
  return (
    <Page authProtected={false}>
      <h1>Test page</h1>
      {testVal && <p>{testVal}</p>}
      <button onClick={() => setTestVal(new Date().getTime())}>
        Set time in localStorage
      </button>

      <button
        className="primary"
        onClick={() => setTestVal(new Date().getTime())}
      >
        Primary
      </button>

      <button
        className="primary light"
        onClick={() => setTestVal(new Date().getTime())}
      >
        Primary
      </button>

      <Loader />
    </Page>
  );
}
