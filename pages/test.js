import Loader from "@/components/loader/loader";
import Page from "@/components/page/page";
import useStorage from "@/hooks/useStorage";

export default function Test() {
  const [testVal, setTestVal] = useStorage("test", "localStorage");
  return (
    <Page authProtected={false}>
      <div className="p-4">
        <h1>Test page</h1>
        {testVal && <p>{testVal}</p>}
        <p>
          <button onClick={() => setTestVal(new Date().getTime())}>
            Set time in localStorage
          </button>
        </p>

        <p>
          <button
            className="primary"
            onClick={() => setTestVal(new Date().getTime())}
          >
            Primary
          </button>
        </p>

        <p>
          <button
            className="primary light"
            onClick={() => setTestVal(new Date().getTime())}
          >
            Primary
          </button>
        </p>

        <p>
          <input placeholder="Enter name here" type="text" />
        </p>
        <p>
          <label>
            <input placeholder="Enter name here" type="checkbox" />
            check
          </label>
          <Loader />
        </p>
      </div>
    </Page>
  );
}
