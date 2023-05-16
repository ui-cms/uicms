import useGitHubApi from "@/hooks/useGitHubApi";
import useStateManagement from "@/services/stateManagement/stateManagement";
import { useEffect, useState } from "react";
import Page from "@/components/page";
import Script from "next/script";
import { useRouter } from "next/router";
import { Button } from "@/components/button";
import { TextInputWithLabel } from "pages/[repo]/configuration";
import { UICMS_CONFIGS } from "@/helpers/constants";

export default function Item() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const githubApi = useGitHubApi();
  const { state, dispatchAction } = useStateManagement();
  const [title, setTitle] = useState("");

  async function save() {
    if (title.trim().length < 3) {
      alert("Item title is too short!");
      return false;
    }

    const id = new Date().getTime();
    const slug = title
      .trim()
      .toLowerCase()
      .replaceAll(" ", "_")
      .replace(/[^a-z0-9_]+/g, "") //todo:non english/latin allowed
      .substring(0, 29);

    const folder = `${id}_${slug}`;
    debugger;
    // to amke slug, clean title, cut max 30 chars
  }

  function onChange({ name, value }) {
    setTitle(value);
  }

  return (
    <Page
      title="New item"
      loading={loading}
      heading={{
        title: "New item",
        buttons: (
          <Button type="primary" size="sm" onClick={save}>
            Next
          </Button>
        ),
      }}
    >
      <fieldset className="w-50 w-100-sm">
        <TextInputWithLabel
          name="name"
          value={title}
          onChange={onChange}
          label="Title"
          placeholder="A cool item title"
          required={true}
        />
      </fieldset>
    </Page>
  );
}
