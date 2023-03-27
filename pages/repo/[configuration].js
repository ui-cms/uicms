import { useRouter } from "next/router";
import Page, { Heading } from "@/components/page";
import { useEffect, useState } from "react";
import useGitHubApi from "@/hooks/useGitHubApi";
import useStateManagement from "@/services/stateManagement/stateManagement";
import { Button } from "@/components/button";

export default function RepoConfiguration() {
  const router = useRouter();
  const repoId = router.query.configuration;
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [repo, setRepo] = useState(null);
  const githubApi = useGitHubApi();
  const { state, dispatchAction } = useStateManagement();

  useEffect(() => {
    if (!repo && repoId && state.repos.length > 0 && loading) {
      const _repo = state.repos.find((r) => r.id === Number(repoId));
      setRepo(_repo);
      setLoading(false);
    }
  }, [loading, repo, repoId, state.repos]);

  return (
    <Page
      title="Repo configuration"
      heading={{
        title: repo?.name,
        subtitle: "Configuration",
        extra: (
          <>
            <Button type="primaryLight">Save</Button>
            <Button type="primary" className="ml-2">Publish</Button>
          </>
        ),
      }}
    >
      <pre>{JSON.stringify(repo, null, 4)}</pre>
    </Page>
  );
}
