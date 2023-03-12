import Page from "@/components/layout/page";
import useStorage from "@/hooks/useStorage";

export default function Test() {
  const [testVal, setTestVal] = useStorage("test", "localStorage");
  return (
    <Page authProtected={false}>
      <h1>Test page</h1>
      {testVal && <p>{testVal}</p>}
      <button
        onClick={() => setTestVal(new Date().getTime())}
      >
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

      <button
        className="secondary"
        onClick={() => setTestVal(new Date().getTime())}
      >
        Secondary
      </button>
      <button
        className="secondary light"
        onClick={() => setTestVal(new Date().getTime())}
      >
        Primary
      </button>
    </Page>
  );
}
