"use client";
import React, { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useRouter } from "next/navigation";
import { handleOAuthCall } from "@/app/actions";
import { useAuth } from "@/context/UserContext";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_APIKEY,
  authDomain: process.env.NEXT_PUBLIC_authDomain,
  projectId: process.env.NEXT_PUBLIC_projectId,
  storageBucket: process.env.NEXT_PUBLIC_storageBucket,
  messagingSenderId: process.env.NEXT_PUBLIC_messagingSenderId,
  appId: process.env.NEXT_PUBLIC_appId,
};

export default function OAuth() {
  const [googleResult, setGoogleResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { storeUser } = useAuth();
  const router = useRouter();

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);

  useEffect(() => {
    const oauthCallServer = async (dataToFetch) => {
      const dataOaut = await handleOAuthCall(
        dataToFetch.email,
        dataToFetch.name,
        dataToFetch.profilePicture
      );

      if (dataOaut && dataOaut.status === "success") {
        storeUser({
          email: dataOaut.data.email,
          name: dataOaut.data.name,
          profilePicture: dataOaut.data.profilePicture,
        });
        router.push("/");
      }
    };

    if (googleResult !== null) {
      oauthCallServer({
        email: googleResult.email,
        name: googleResult.displayName,
        profilePicture: googleResult.photoURL,
      });
    }
  }, [googleResult]);

  const provider = new GoogleAuthProvider();

  const handleClick = async () => {
    setIsLoading(true);
    signInWithPopup(auth, provider).then((result) => {
      setGoogleResult(result.user);
    });
  };

  return (
    <div className="w-full mb-2">
      <button
        className="btn btn-neutral w-full"
        onClick={handleClick}
        disabled={isLoading ? true : false}
      >
        OAuth
      </button>
    </div>
  );
}
