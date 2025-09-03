"use client";
import { verifyAccount } from "@/app/actions";
import WarningComponent from "@/components/WarningComponent";
import { useAuth } from "@/context/UserContext";
import { useRouter, useParams } from "next/navigation";
import React, { useState } from "react";

export default function Page() {
  const { userMail } = useParams<{ userMail: string }>();
  const [error, setError] = useState({ error: false, message: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [inputData, setInputData] = useState("");
  const { storeUser } = useAuth();
  const router = useRouter();

  const handleKeyDown = async (e) => {
    if (e.key === "Enter" && inputData !== "" && inputData.length > 2) {
      setIsLoading(true);
      e.preventDefault();
      // launch server function to verify the account
      const isVerified = await verifyAccount(
        decodeURIComponent(userMail),
        inputData
      );
      if (isVerified !== null) {
        storeUser(isVerified);
        setIsLoading(false);
        router.push("/");
      }
    }
  };

  return (
    <div className="flex flex-col my-5 items-center min-w-96 mx-auto w-fit p-10">
      <div className="w-80 pb-5">
        {error.error && <WarningComponent text={error.message} />}
      </div>
      <h1 className="text-3xl">Confirm Account</h1>
      <p className="pt-5 pb-10 text-center">
        Please enter below the unique code sent to you via email <br /> in order
        to confirm your account!
      </p>
      <label className="form-control w-full max-w-xs">
        <div className="label">
          <span className="label-text">
            Paste the code sent to you via mail
          </span>
        </div>
        <div className="flex gap-1">
          <input
            type="text"
            placeholder="Type here"
            className="input input-bordered w-full max-w-xs"
            value={inputData}
            onChange={(e) => {
              setIsLoading(false);
              setInputData(e.target.value);
            }}
            onKeyDown={handleKeyDown}
          />
          {isLoading && (
            <span className="loading loading-spinner loading-lg"></span>
          )}
        </div>

        <div className="label">
          <span className="label-text-alt">
            Check spam folder if you don&apos;t find it in your inbox!
          </span>
        </div>
      </label>
    </div>
  );
}
