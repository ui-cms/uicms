import Page from "@/components/page";

export default function NewRepo() {
  // Path for this page is /repo/new
  // Value for [repo] param will be "repo"
  return (
    <Page title="New repo">
      <h1>New repo</h1>
      <pre>
        <p>license: none;</p>
        <p>readme: created by UICMS;</p>
        <p>topics: [uicms];</p>
        <p>uicms.config.json;</p>
        <p>private: true</p>
      </pre>
    </Page>
  );
}
