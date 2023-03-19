import { Button } from "@/components/button";
import { CheckBox, TextInput } from "@/components/form";
import Loader from "@/components/loader";
import Page from "@/components/page";
import useStorage from "@/hooks/useStorage";
import { useState } from "react";

export default function Test() {
  const [testVal, setTestVal] = useStorage("test", "localStorage");
  const [loading, setLoading] = useState(false);
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
          <TextInput placeholder="Enter name here" type="text" />
        </div>
        <div>
          <CheckBox>Testing checkbox here</CheckBox>
          <Loader />
        </div>

        <Button
          loading={loading}
          className=""
          onClick={() => setLoading(!loading)}
        >
          Test me
        </Button>

        <Button
          loading={loading}
          className=""
          onClick={() => setLoading(!loading)}
        >
          Anoe more bigger button
        </Button>

        <Button
          loading={loading}
          className="primary"
          onClick={() => setLoading(!loading)}
        >
          why
        </Button>
      </div>
    </Page>
  );
}
