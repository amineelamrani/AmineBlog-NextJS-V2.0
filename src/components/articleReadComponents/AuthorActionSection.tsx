"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import CopySvgComponent from "./CopySvgComponent";
import { useTheme } from "next-themes";

export default function AuthorActionSection() {
  // const theme = localStorage.getItem("BlogTheme"); //to add a global state later for theme switching
  // const theme = "dark";
  const { theme } = useTheme();

  const handleCopyText = async (e) => {
    try {
      await navigator.clipboard.writeText(e.target.baseURI);
    } catch (error) {
      return;
    }
  };

  return (
    <>
      <Image
        src={
          theme === "dark"
            ? "/likeSVGs/like-border-white.svg"
            : "/likeSVGs/like-border-black.svg"
        }
        alt=""
        className="w-5 h-5 md:w-8 md:h-8 hover:scale-105 hover:cursor-pointer"
        width={5}
        height={5}
      />
      <button className="btn btn-tiny md:btn-base" onClick={handleCopyText}>
        <CopySvgComponent theme={theme} />
        Copy link
      </button>
    </>
  );
}
