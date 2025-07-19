"use client";
import { Suspense } from "react";
import GroupUpdateComponent from "~/app/_components/groupUpdateComponent";

export default function GroupNameUpdatePage() {
    return (
      <Suspense fallback={<p>Loading...</p>}>
        <GroupUpdateComponent />
      </Suspense>
    )
}
