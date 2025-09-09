"use client";
import ActionConfirmation from "@/components/ActionConfirmation";
import { useAuth } from "@/context/UserContext";
import Image from "next/image";
import React, { useState } from "react";
import { deleteUserAccount, logOutAccount } from "../actions";
import { useRouter } from "next/navigation";

export default function Page() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState({ error: false, message: "" });
  const { currentUser, resetUser } = useAuth();
  const router = useRouter();

  const signOutAPI = async () => {
    // Call a server function to reset the cookies
    const isLogOut = await logOutAccount();
    // make currentUser in the local store to its initial value
    if (isLogOut) {
      resetUser();
      router.push("/sign-in");
    }
    // redirect to /sign-in
  };

  const handleDeleteAccount = async () => {
    // call delete account function and reset cookies
    const isDeleted = await deleteUserAccount();
    //make currentUser to initial value
    if (isDeleted) {
      resetUser();
      router.push("/");
    }
  };

  if (currentUser === null) {
    return (
      <div className="w-full flex items-center py-15">
        <span className="loading loading-spinner text-center w-12 mx-auto"></span>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full items-center py-14 gap-3">
      {error.error && (
        <div className="toast z-50">
          <div className="alert alert-error">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 shrink-0 stroke-current"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <span>{error.message} </span>
          </div>
        </div>
      )}
      <h1 className="text-2xl">Welcome {currentUser.name}</h1>
      <h1 className="text-2xl">Email : {currentUser.email}</h1>
      <h1 className="text-4xl font-bold">Profile Page</h1>
      <div
        id="ProfilePicture-Section"
        className="flex flex-col items-center gap-3"
      >
        <h1>Your Profile Picture</h1>
        <Image
          src={currentUser.profilePicture}
          alt="profile picture"
          className=" w-32 h-32 rounded-full bg-white border-2 p-2"
          width={250}
          height={250}
        />
      </div>

      <div
        id="delete-signOut-seeCommentsUser-dashboardAdmin"
        className="flex gap-10 py-5"
      >
        <ActionConfirmation
          action="sign Out"
          handleClick={async () => {
            await signOutAPI();
          }}
        />

        <ActionConfirmation
          action="Delete Account"
          handleClick={async () => {
            await handleDeleteAccount();
          }}
        />
      </div>
    </div>
  );
}
