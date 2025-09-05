import React from "react";
import {
  differenceInDays,
  differenceInHours,
  differenceInMonths,
} from "date-fns";
import CommentLikeImage from "./CommentLikeImage";
import { getCurrentUser } from "@/app/actions";

export default async function CommentComponent({ comment }) {
  const creationDate = new Date(comment.createdAt);
  const daysDifference = differenceInDays(Date.now(), creationDate);
  const id = await getCurrentUser();
  let comment_ID: string = "";
  if (typeof comment._id === "string") {
    comment_ID = comment._id;
  } else {
    comment_ID = comment._id.toJSON();
  }
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
          {comment && !comment.likedBy.includes(id) && (
            <CommentLikeImage
              commentID={comment_ID}
              isIncluded={false}
              userId={id}
            />
          )}
          {id != null && comment && comment.likedBy.includes(id) && (
            <CommentLikeImage commentID={comment_ID} isIncluded={true} />
          )}

          <p className="text-sm md:text-base">{comment.likedBy.length} like</p>
        </div>
      </div>
    </div>
  );
}
