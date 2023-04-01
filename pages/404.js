import Page from "@/components/page";
import Link from "next/link";

export default function Custom404() {
  return (
    <Page title="Page not found" authProtected={false} absolute={true}>
      <h1>404 - Page Not Found</h1>
      <br />
      <Link href="/">Home</Link>
    </Page>
  );
}
