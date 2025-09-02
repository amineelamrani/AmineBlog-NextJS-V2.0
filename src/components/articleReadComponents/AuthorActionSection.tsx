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
// import { revalidateTag } from "next/cache";

export default function AuthorActionSection({ articleId }) {
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

  const handleCopyText = async (e) => {
    try {
      await navigator.clipboard.writeText(e.target.baseURI);
    } catch (error) {
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
      {!isArticleLiked && (
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
      {isArticleLiked && (
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
      <button className="btn btn-tiny md:btn-base" onClick={handleCopyText}>
        <CopySvgComponent theme={theme} />
        Copy link
      </button>
    </>
  );
}
