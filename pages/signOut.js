import { withIronSessionSsr } from "iron-session/next";
import useStateManagement from "@/services/stateManagement/stateManagement";
import Page from "@/components/page";
import { IRON_SESSION_OPTIONS } from "@/helpers/constants";
import { useEffect } from "react";
import Link from "next/link";

export default function SignOut() {
  const { dispatchAction } = useStateManagement();

  // reset state management
  useEffect(() => {
    dispatchAction.reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Page authProtected={false} absolute={true}>
      <div>
        <h1>Good bye!</h1>
        <p className="my-3">
          You have been signed out of UICMS now. Note that, this doesn&apos;t
          affect your GitHub authentication.
        </p>
        <Link href="/">Home</Link>
      </div>
    </Page>
  );
}

// destroy iron-session cookie (storing auth token)
export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req }) {
    req.session.destroy();
    return {
      props: {},
    };
  },
  IRON_SESSION_OPTIONS
);
