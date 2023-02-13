import { Page } from "@/components/layout";
import Script from "next/script";

export default function Editor() {
  return (
    <Page title="Editor">
      <h1>Editor will be here</h1>
      <Script src="https://example.com/script.js" />
    </Page>
  );
}
