import dbConnect from "@/lib/dbConnect";
import Comment from "@/models/Comment";
import Link from "next/link";
import React from "react";
import CommentComponent from "./CommentComponent";

export default async function ArticleCommentsSections({ articleId }) {
  //fetch comments related to that article and display them
  await dbConnect();
  const queryArticleComments = await Comment.find({ articleId })
    .populate("owner", "name profilePicture")
    .sort("-createdAt");

  return (
    <div
      id="article-comments-section"
      className="flex flex-col gap-5 w-full lg:px-14 py-5"
    >
      <h1 className="text-info">
        You must be logged in to comment.{" "}
        <Link href="/sign-in" className="text-accent">
          Login
        </Link>
      </h1>
      {queryArticleComments && (
        <>
          <div className="flex gap-2 items-center">
            <h2>Comments </h2>
            <p className="border px-2">{queryArticleComments.length}</p>
          </div>

          <div className="lg:px-10">
            {queryArticleComments.map((element, index) => (
              <CommentComponent comment={element} key={index} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
