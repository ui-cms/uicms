import { useRouter } from "next/router";
import Page from "@/components/page";

export default function RepoConfiguration() {
  const router = useRouter();
  const repoId = router.query.configuration;

  return (
    <Page title="Repo configuration">
      <h1>Repo configuration</h1>
      <pre>{JSON.stringify(router.query.configuration)}</pre>
    </Page>
  );
}
