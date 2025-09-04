"use client";
import React, { useActionState } from "react";
import { useRouter, useParams } from "next/navigation";
import WarningComponent from "@/components/WarningComponent";
import { handleResetPasswordForm } from "@/app/actions";
import { useAuth } from "@/context/UserContext";

const initialValue = {
  error: {
    error: false,
    message: "",
  },
  currentUser: null,
};

export default function Page() {
  const { userMail } = useParams<{ userMail: string }>();
  const [state, formAction, isLoading] = useActionState(
    handleResetPasswordForm,
    initialValue
  );
  const { storeUser } = useAuth();
  const router = useRouter();

  // when there is no error and state.currentUser not null - then update currentUser in context and go to home page
  if (!state.error.error && !isLoading && state.currentUser !== null) {
    storeUser(state.currentUser);

    setTimeout(() => {
      router.push("/");
    }, 100); // 100ms delay, adjust as needed
  }

  return (
    <div className="flex flex-col my-5 items-center min-w-96 mx-auto w-fit p-10">
      <div className="w-80 pb-5">
        {state.error.error && <WarningComponent text={state.error.message} />}
      </div>
      <h1 className="text-3xl">Confirm Account</h1>
      <p className="pt-5 pb-10 text-center">
        Please enter below the unique code sent to you via email <br /> in order
        to confirm your account!
      </p>

      <form action={formAction} className="w-full flex flex-col gap-3">
        <label className="input input-bordered flex items-center gap-2 w-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-4 w-4 opacity-70"
          >
            <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
          </svg>
          <input
            type="text"
            className="grow"
            placeholder="Token"
            name="token"
            required
          />
        </label>

        <label className="input input-bordered flex items-center gap-2 w-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-4 w-4 opacity-70"
          >
            <path
              fillRule="evenodd"
              d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
              clipRule="evenodd"
            />
          </svg>
          <input
            type="password"
            className="grow"
            name="password"
            placeholder="Password"
            required
          />
        </label>

        <label className="input input-bordered flex items-center gap-2 w-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-4 w-4 opacity-70"
          >
            <path
              fillRule="evenodd"
              d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
              clipRule="evenodd"
            />
          </svg>
          <input
            type="password"
            className="grow"
            name="confirmPassword"
            placeholder="Confirm Password"
            required
          />
        </label>
        <label className="hidden input input-bordered items-center gap-2 w-full">
          <input
            type="text"
            className="grow"
            name="email"
            readOnly
            value={decodeURIComponent(userMail)}
            required
          />
        </label>
        <button
          className="btn btn-primary"
          type="submit"
          disabled={isLoading ? true : false}
        >
          {isLoading ? (
            <span className="loading loading-dots loading-xs"></span>
          ) : (
            "Reset Password"
          )}
        </button>
      </form>
    </div>
  );
}
