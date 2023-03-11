import { useRouter } from "next/router";
import { Suspense } from "react";
import { Loading } from "./layout/page";

export default function SideBar({}) {
  const router = useRouter();
  return (
    <Suspense fallback={<Loading />}>
      <aside className="">
        Sidebar
        <a onClick={() => router.push("/signOut")} className="">
          Sign out
        </a>
      </aside>
    </Suspense>
  );
}
