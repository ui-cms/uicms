import Loader from "@/components/loader";
import Page from "@/components/page";
import useStorage from "@/hooks/useStorage";

export default function Test() {
  const [testVal, setTestVal] = useStorage("test", "localStorage");
  return (
    <Page authProtected={true}>
      <div className="p-4">
        <h1>Test page</h1>
        {testVal && <div>{testVal}</div>}
        <div>
          <button onClick={() => setTestVal(new Date().getTime())}>
            Set time in localStorage
          </button>
        </div>

        <div>
          <button
            className="primary"
            onClick={() => setTestVal(new Date().getTime())}
          >
            Primary
          </button>
        </div>

        <div>
          <button
            className="primary light"
            onClick={() => setTestVal(new Date().getTime())}
          >
            Primary
          </button>
        </div>

        <div>
          <input placeholder="Enter name here" type="text" />
        </div>
        <div>
          <label>
            <input placeholder="Enter name here" type="checkbox" />
            check
          </label>
          <Loader />
        </div>
      </div>
    </Page>
  );
}
