"use client";
import React, { useContext, useEffect, useState } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";

export default function CommentLikeImage() {
  //   const theme = "dark";
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <>
      {theme === "dark" && (
        <Image
          src={"/likeSVGs/like-border-white.svg"}
          alt=""
          className="w-4 md:w-8 hover:scale-110 hover:cursor-pointer"
          width={8}
          height={8}
        />
      )}
      {theme === "light" && (
        <Image
          src={"/likeSVGs/like-border-black.svg"}
          alt=""
          className="w-4 md:w-8 hover:scale-110 hover:cursor-pointer"
          width={8}
          height={8}
        />
      )}
    </>
  );
}
