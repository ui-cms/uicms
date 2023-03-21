import { useRouter } from "next/router";
import Page from "@/components/page";

export default function NewCollection() {
  const router = useRouter();
  const repoId = router.query.new;

  return (
    <Page title="New collection">
      <h1>New collection</h1>
      <pre>{JSON.stringify(router.query.new)}</pre>
    </Page>
  );
}
