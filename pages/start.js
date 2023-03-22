import Page from "@/components/page";
import Link from "next/link";

export default function Start() {
  return (
    <Page>
      <div>
        Welcome!
        <h1>
          <Link href="/editor">Editor</Link>
        </h1>
        <h1>
          <Link href="/test">Test</Link>
        </h1>
        {[...Array(50)].map((v, i) => (
          <h1 key={i}>{i}</h1>
        ))}
      </div>
    </Page>
  );
}
