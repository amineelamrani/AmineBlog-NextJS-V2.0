"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import CopySvgComponent from "./CopySvgComponent";
import { useTheme } from "next-themes";
import {
  checkArticleUserLikeStatus,
  handleLikingArticle,
  revalidateLikingNumber,
} from "@/app/actions";
import { useAuth } from "@/context/UserContext";
import Link from "next/link";
// import { revalidateTag } from "next/cache";

export default function AuthorActionSection({
  articleId,
}: {
  articleId: string;
}) {
  const { theme } = useTheme();
  const { currentUser } = useAuth();
  const [isArticleLiked, setIsArticleLiked] = useState(false);

  useEffect(() => {
    // check if article is liked to either activate or not the liking button
    const checkLiking = async () => {
      const liked = await checkArticleUserLikeStatus(articleId);
      if (liked) {
        setIsArticleLiked(true);
      }
    };
    checkLiking();
  }, [articleId]);

  const handleCopyText = async (e: React.MouseEvent<HTMLButtonElement>) => {
    try {
      const targetElement = e.target as HTMLButtonElement;
      await navigator.clipboard.writeText(targetElement.baseURI);
    } catch (error) {
      console.log("Error while trying to Copy the url : ", error);
      return;
    }
  };

  const handleLike = async () => {
    // when clicked call the server function to add like
    if (currentUser === null) {
      return;
    }
    const addLiking = await handleLikingArticle(articleId);
    if (addLiking) {
      setIsArticleLiked(true);
      // You should update the 'liked by X persons' as well
      revalidateLikingNumber(); // to update the number of people liking it I will revalidateTag on the server
    }
  };

  return (
    <>
      {currentUser && !isArticleLiked && (
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
          onClick={handleLike}
        />
      )}
      {currentUser && isArticleLiked && (
        <Image
          src={
            theme === "dark"
              ? "/likeSVGs/like-full-white.svg"
              : "/likeSVGs/like-full-black.svg"
          }
          alt=""
          className="w-5 h-5 md:w-8 md:h-8 "
          width={5}
          height={5}
        />
      )}
      {!currentUser && (
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
            onClick={() =>
              (
                document.getElementById("my_modal_1") as HTMLDialogElement
              ).showModal()
            }
          />
          <dialog id="my_modal_1" className="modal">
            <div className="modal-box">
              <h3 className="font-bold text-lg">Not logged in!</h3>
              <p className="py-4">
                You need to be logged in, to like the article!
              </p>
              <div className="modal-action">
                <Link href="/sign-in" className="btn">
                  Sign In
                </Link>
                <form method="dialog">
                  {/* if there is a button in form, it will close the modal */}
                  <button className="btn">Close</button>
                </form>
              </div>
            </div>
          </dialog>
        </>
      )}
      <button className="btn btn-tiny md:btn-base" onClick={handleCopyText}>
        <CopySvgComponent theme={theme} />
        Copy link
      </button>
    </>
  );
}
