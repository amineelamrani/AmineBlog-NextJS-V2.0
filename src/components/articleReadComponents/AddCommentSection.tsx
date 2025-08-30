"use client";
import { useAuth } from "@/context/UserContext";
import { useTheme } from "next-themes";
import Link from "next/link";
import React from "react";

export default function AddCommentSection({ articleId }) {
  const { currentUser } = useAuth();
  const { theme } = useTheme();
  return (
    <>
      {currentUser === null && (
        <h1 className="text-info">
          You must be logged in to comment.{" "}
          <Link href="/sign-in" className="text-accent">
            Login
          </Link>
        </h1>
      )}
      {currentUser !== null && (
        // We have a client component so when to click need to discuss with the DB - to do so I will make it as a <form> and the action would be when we click on the send button and create a server component to fetch from the DB
        <div className="flex items-center">
          <label className="input input-bordered flex  w-full h-8 md:h-12">
            <input type="text" className="grow" placeholder="Add comment..." />
          </label>

          <svg
            fill={theme === "dark" ? "#ffffff" : "#000000"}
            className="w-8 h-8 md:w-12 md:h-12 px-1 hover:scale-105 hover:cursor-pointer"
            viewBox="0 0 32 32"
            id="icon"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M27.71,4.29a1,1,0,0,0-1.05-.23l-22,8a1,1,0,0,0,0,1.87l9.6,3.84,3.84,9.6A1,1,0,0,0,19,28h0a1,1,0,0,0,.92-.66l8-22A1,1,0,0,0,27.71,4.29ZM19,24.2l-2.79-7L21,12.41,19.59,11l-4.83,4.83L7.8,13,25.33,6.67Z"></path>
            <rect
              id="_Transparent_Rectangle_"
              data-name="<Transparent Rectangle>"
              style={{ fill: "none" }}
              width="32"
              height="32"
            ></rect>
          </svg>
        </div>
      )}
    </>
  );
}
