import Page from "@/components/layout/page";
import useStorage from "@/hooks/useStorage";

export default function Test() {
  const [testVal, setTestVal] = useStorage("test", "localStorage");
  return (
    <Page authProtected={false}>
      <h1>Test page</h1>
      {testVal && <p>{testVal}</p>}
      <button
        className="button is-primary"
        onClick={() => setTestVal(new Date().getTime())}
      >
        Start
      </button>
    </Page>
  );
}
