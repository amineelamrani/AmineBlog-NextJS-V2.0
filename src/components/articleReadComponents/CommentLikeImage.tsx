"use client";
import React, { useContext, useEffect, useState } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { addCommentLike, revalidateComments } from "@/app/actions";

export default function CommentLikeImage({ isIncluded, commentID }) {
  //   const theme = "dark";
  const [mounted, setMounted] = useState(false);
  const [include, setInclude] = useState(isIncluded);
  const { theme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const handleClick = async () => {
    // adding like in the database
    const addCommLike = await addCommentLike(commentID);
    if (addCommLike) {
      setInclude(true);
    }
    // revalidateTag for comments
    // setInclude to true
  };

  return (
    <>
      {!isIncluded && theme === "dark" && (
        <Image
          src={"/likeSVGs/like-border-white.svg"}
          alt=""
          className="w-4 md:w-8 hover:scale-110 hover:cursor-pointer"
          width={8}
          height={8}
          onClick={handleClick}
        />
      )}
      {!isIncluded && theme === "light" && (
        <Image
          src={"/likeSVGs/like-border-black.svg"}
          alt=""
          className="w-4 md:w-8 hover:scale-110 hover:cursor-pointer"
          width={8}
          height={8}
          onClick={handleClick}
        />
      )}
      {isIncluded && theme === "dark" && (
        <Image
          src={"/likeSVGs/like-full-white.svg"}
          alt=""
          className="w-4 md:w-8"
          width={8}
          height={8}
        />
      )}
      {isIncluded && theme === "light" && (
        <Image
          src={"/likeSVGs/like-full-black.svg"}
          alt=""
          className="w-4 md:w-8"
          width={8}
          height={8}
        />
      )}
    </>
  );
}
