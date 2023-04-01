import { useRouter } from "next/router";
import Page from "@/components/page";

export default function CollectionConfiguration() {
  const router = useRouter();
  const [repoId, collectionId] = router.query.configuration || [];

  return (
    <Page title="Collection configuration">
      <h1>Collection configuration</h1>

      <pre>{JSON.stringify(router.query.configuration)}</pre>
    </Page>
  );
}
