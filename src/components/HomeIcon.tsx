"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export default function HomeIcon() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Image
        src={"/AppLogo-white.svg"}
        alt="icon-blog"
        width={8}
        height={8}
        className="w-8"
      />
    );
  }
  return (
    <>
      <Image
        src={theme === "light" ? "/AppLogo-white.svg" : "/AppLogo-dark.svg"}
        alt="icon-blog"
        width={8}
        height={8}
        className="w-8"
      />
    </>
  );
}
