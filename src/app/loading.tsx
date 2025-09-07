import React from "react";

export default function Loading() {
  return (
    <div>
      <div className="prose lg:prose-xl py-10 flex flex-col items-center mx-auto">
        <h1 className="text-center">
          Amine&apos;s Code Chronicles{" "}
          <span className="loading loading-infinity loading-xl"></span>
        </h1>

        <div className="flex w-full flex-col gap-4">
          <div className="skeleton h-32 w-full"></div>
          <div className="skeleton h-4 w-28"></div>
          <div className="skeleton h-4 w-full"></div>
          <div className="skeleton h-4 w-full"></div>
        </div>
      </div>
    </div>
  );
}
