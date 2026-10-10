"use client";

import dynamic from "next/dynamic";

const GlobeExplorer = dynamic(() => import("./GlobeExplorer"), {
  ssr: false,
  loading: () => (
    <div aria-hidden="true" className="mx-auto aspect-square w-full max-w-[520px]" />
  ),
});

export default function GlobeExplorerLazy() {
  return <GlobeExplorer />;
}
