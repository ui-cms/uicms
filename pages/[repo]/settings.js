import { useRouter } from "next/router";
import Page, { Heading } from "@/components/page";
import { useEffect, useState } from "react";
import useGitHubApi from "@/hooks/useGitHubApi";
import useStateManagement from "@/services/stateManagement/stateManagement";
import { Button } from "@/components/button";

export default function RepoSettings() {
  const router = useRouter();
  const repoId = router.query.repo;
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [repo, setRepo] = useState(null);
  const githubApi = useGitHubApi();
  const { state, dispatchAction } = useStateManagement();

  useEffect(() => {
    if (repoId && state.repos.length > 0) {
      const _repo = state.repos.find((r) => r.id === Number(repoId));
      setRepo(_repo);
      setLoading(false);
    }
  }, [repoId, state.repos]);

  return (
    <Page
      title="Repo configuration"
      heading={{
        title: repo?.name,
        subtitle: "Configuration",
        extra: (
          <>
            <Button type="primaryLight">Save</Button>
            <Button type="primary" className="ml-2">
              Publish
            </Button>
          </>
        ),
      }}
    >
      <pre>{JSON.stringify(repo, null, 4)}</pre>

      {repo?.pushed_at && (
        <small className="text-dark mt-4">
          The last push (update) to this repo was made on{" "}
          {new Date(repo.pushed_at).toLocaleString()}.
        </small>
      )}
    </Page>
  );
}
