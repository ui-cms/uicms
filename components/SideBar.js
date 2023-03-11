import { Suspense } from "react";
import { Loading } from "./layout/page";

export default function SideBar({}) {
  return (
    <Suspense fallback={<Loading />}>
      <aside className="">Sidebar</aside>
    </Suspense>
  );
}
