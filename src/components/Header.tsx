"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ThemeSwitch from "./ThemeSwitch";

export default function Header() {
  const [theme, setTheme] = useState<string>("light");

  const handleThemeSwap = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTheme(e.target.checked ? "dark" : "light");
  };

  useEffect(() => {
    localStorage.setItem("BlogTheme", theme);
  }, [theme]);

  return (
    <div className="flex justify-between items-center py-3 w-full">
      <Link href="/">
        <div className="flex gap-1 items-center">
          <Image
            src={theme === "light" ? "/AppLogo-white.svg" : "/AppLogo-dark.svg"}
            alt="icon-blog"
            width={8}
            height={8}
            className="w-8"
          />
          <h1 className="text-xs md:text-base hidden sm:flex">
            Amine&apos;s Co
            <samp className="font-bold italic">de Chronicles</samp>
          </h1>
        </div>
      </Link>

      <div className="hidden md:flex gap-5 items-center ">
        <Link href="/">Home</Link>
        <Link href="/about">About</Link>
        <Link href="/search">Search</Link>
      </div>

      <div className="flex gap-2 items-center">
        <ThemeSwitch theme={theme} handleThemeSwap={handleThemeSwap} />
        <Link href="/sign-in">
          <button className="btn btn-sm px-5 text-xs md:text-base">
            Log in
          </button>
        </Link>
        <Link href="/sign-up">
          <button className="btn btn-sm px-5 btn-primary text-xs md:text-base hidden sm:flex">
            Sign up
          </button>
        </Link>
        <div className="dropdown dropdown-bottom dropdown-end md:hidden">
          <div tabIndex={0}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block h-5 w-5 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </div>

          <ul
            tabIndex={0}
            className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-5 shadow"
          >
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/about">About</Link>
            </li>
            <li>
              <Link href="/search">Search</Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
