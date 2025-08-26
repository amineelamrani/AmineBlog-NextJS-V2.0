"use client";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    const homePage = async () => {
      const res = await fetch("/api/v2/articles", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      console.log(data);
    };
    homePage();
  });
  return <div>Home page</div>;
}
