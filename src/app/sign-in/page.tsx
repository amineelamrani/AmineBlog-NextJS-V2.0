"use client";
import OAuth from "@/components/OAuth";
import WarningComponent from "@/components/WarningComponent";
import Link from "next/link";
import React, { useActionState, useState } from "react";
import { handleSignInSubmit, SignInInterface } from "../actions";
import { useRouter } from "next/navigation";

interface User {
  email: string;
  name: string;
  profilePicture: string;
}

const initialSignInState: SignInInterface = {
  error: {
    error: false,
    message: "",
  },
  currentUser: null,
};

export default function Page() {
  //Manage global states only currentUser & theme ()
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [theme, setTheme] = useState("black"); // This not needed here but just to highlight to be stored in the global state manager
  const router = useRouter();

  const [state, formAction, signInLoading] = useActionState(
    handleSignInSubmit,
    initialSignInState
  );

  // const submitSignIn = handleSignInSubmit.bind(null);
  console.log(state, signInLoading);

  if (!state.error.error && !signInLoading && state.currentUser !== null) {
    // In the global state used in context or redux store it
    console.log("Logged in successfully");
    //If I setCurrentUser directly here I would be in an infinite loop - so what to do I will update the parent state and directly redirect to /
    // setCurrentUser({ ...state.currentUser }); //and also cannot redirect while it set a state
    // router.push("/");
  }
  console.log(currentUser);

  return (
    <div className="flex flex-col py-14 items-center gap-5 w-full md:min-w-96 mx-auto md:w-fit">
      <div className="flex flex-col items-center gap-3 p-10 border border-neutral">
        {state.error.error && <WarningComponent text={state.error.message} />}
        <h1 className="text-xl md:text-3xl ">Amine&apos;s Code Chronicles</h1>
        <p className="text-center text-xs md:text-base">
          Unlock the Future of Tech - Dive into Amine&apos;s Code Chronicles and
          <br />
          Eleva
        </p>
        <form className="w-full flex flex-col gap-3" action={formAction}>
          <label className="input input-bordered flex items-center gap-2 w-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-4 w-4 opacity-70"
            >
              <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
              <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
            </svg>
            <input
              type="text"
              className="grow"
              placeholder="Email"
              name="email"
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

          <button
            className="btn btn-primary"
            type="submit"
            disabled={signInLoading ? true : false}
          >
            {signInLoading ? (
              <span className="loading loading-dots loading-xs"></span>
            ) : (
              "Log In"
            )}
          </button>
        </form>

        <OAuth />

        <div
          id="or-holder"
          className="relative w-full flex flex-col items-center"
        >
          <hr className="w-full border-neutral" />
          <p className="-translate-y-1/2 text-center bg-base-100 px-2 font-bold">
            OR
          </p>
        </div>
        <Link href="/forgot-password">
          <button>Forgot password?</button>
        </Link>
      </div>
      <p className="text-center border border-neutral w-full py-3">
        Don&apos;t have an account?{" "}
        <Link href="/sign-up" className="text-primary font-bold">
          Sign Up
        </Link>
      </p>
    </div>
  );
}
