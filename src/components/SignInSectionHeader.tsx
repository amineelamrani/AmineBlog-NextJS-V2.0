"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/UserContext";

export default function SignInSectionHeader() {
  const { currentUser } = useAuth();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      {!mounted && <span className="loading loading-dots loading-xl "></span>}
      {mounted && currentUser === null && (
        <>
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
        </>
      )}
      {mounted && currentUser !== null && (
        <div className="avatar online ">
          <div className="w-6  bg-white ring-primary ring-offset-base-100 rounded-full ring ring-offset-2">
            <Link href="/profile">
              <img src={currentUser.profilePicture} />
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
