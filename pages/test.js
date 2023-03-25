import { Button } from "@/components/button";
import DropDown from "@/components/dropdown";
import { CheckBox, TextInput } from "@/components/form";
import Loader from "@/components/loader";
import Page from "@/components/page";
import useStorage from "@/hooks/useStorage";
import Link from "next/link";
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
          <Button onClick={() => setTestVal(new Date().getTime())}>
            Set time in localStorage
          </Button>
        </div>

        <div>
          <Button
            className="primary"
            onClick={() => setTestVal(new Date().getTime())}
          >
            Primary
          </Button>
        </div>

        <div>
          <Button
            className="primary light"
            onClick={() => setTestVal(new Date().getTime())}
          >
            Primary
          </Button>
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
          type="primary"
          onClick={() => setLoading(!loading)}
        >
          Primary
        </Button>
        <Button
          loading={loading}
          type="primaryLight"
          onClick={() => setLoading(!loading)}
        >
          Primary light
        </Button>

        <div>
          <Link href="repo/new">New repo page</Link>
        </div>
        <div>
          <Link href="repo/repoIdHere">Repo configuration page</Link>
        </div>
        <div>
          <Link href="collection/repoIdHere">New collection page</Link>
        </div>
        <div>
          <Link href="collection/repoIdHere/collectionIdHere">
            Collection configuration page
          </Link>
        </div>
        <div>
          <Link href="/repoIdHere/collectionIdHere/itemSlughere">
            Item page
          </Link>
        </div>
        <div>
          <DropDown
            handle={<a href="#">Test DD</a>}
          >
            <ul>
              <li>Text</li>
              <li><Button>Button</Button></li>
              <li><a>Button</a></li>
            </ul>
          </DropDown>
        </div>
      </div>
    </Page>
  );
}
