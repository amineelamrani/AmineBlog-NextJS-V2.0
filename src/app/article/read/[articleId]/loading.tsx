import React from "react";

export default function Loading() {
  return (
    <div>
      <div className="prose lg:prose-xl py-10 flex flex-col items-center mx-auto">
        <div className="skeleton h-60 w-full"></div>
      </div>
    </div>
  );
}
