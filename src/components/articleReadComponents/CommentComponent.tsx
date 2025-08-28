import React from "react";
import {
  differenceInDays,
  differenceInHours,
  differenceInMonths,
} from "date-fns";
import Image from "next/image";

export default function CommentComponent({ comment }) {
  const creationDate = new Date(comment.createdAt);
  const daysDifference = differenceInDays(Date.now(), creationDate);
  return (
    <div className="flex w-full gap-4 items-start py-5 border-b-2 border-neutral">
      <div className="min-w-10 w-1/12 flex items-start justify-center">
        {comment.owner && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={comment.owner.profilePicture}
            alt="comment"
            width={10}
            height={10}
            className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-black bg-white"
          />
        )}
        {!comment.owner && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src="https://img.icons8.com/?size=100&id=Ib9FADThtmSf&format=png&color=000000"
            alt="comment"
            width={10}
            height={10}
            className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-black bg-white"
          />
        )}
      </div>

      <div className="flex flex-col w-11/12 text-wrap">
        <div className="flex items-center gap-1 w-full md:gap-2">
          <h1 className="font-bold text-sm md:text-base">
            @{comment.ownerName}
          </h1>
          {daysDifference === 0 && (
            <p className="text-xs">
              {differenceInHours(Date.now(), creationDate)} Hour ago
            </p>
          )}
          {daysDifference < 30 && daysDifference > 0 && (
            <p className="text-xs">{daysDifference} day ago</p>
          )}
          {daysDifference >= 30 && (
            <p className="text-xs">
              {differenceInMonths(Date.now(), creationDate)} day ago
            </p>
          )}
        </div>
        <p className="py-2 w-full text-xs md:text-base text-wrap overflow-hidden">
          {comment.content}
        </p>
        <div className="flex items-center gap-1">
          <Image
            src="/likeSVGs/like-border-white.svg"
            alt=""
            className="w-4 md:w-8 hover:scale-110 hover:cursor-pointer"
            width={8}
            height={8}
          />

          <p className="text-sm md:text-base">{comment.likedBy.length} like</p>
        </div>
      </div>
    </div>
  );
}
