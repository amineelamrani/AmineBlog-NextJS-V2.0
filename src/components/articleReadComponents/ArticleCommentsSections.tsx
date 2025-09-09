import dbConnect from "@/lib/dbConnect";
import Comment from "@/models/Comment";
import React from "react";
import CommentComponent from "./CommentComponent";
import AddCommentSection from "./AddCommentSection";
import { unstable_cache } from "next/cache";
import { CommentTypes } from "@/lib/types";

const getComments = unstable_cache(
  async (articleId) => {
    return await Comment.find({ articleId })
      .populate("owner", "name profilePicture")
      .sort("-createdAt");
  },
  ["comments"],
  { tags: ["comments"] }
);

export default async function ArticleCommentsSections({
  articleId,
}: {
  articleId: string;
}) {
  //fetch comments related to that article and display them
  await dbConnect();

  const queryArticleCommentsold = await getComments(articleId); //useed unstable cache for this request in order to revalidate them when comment added succesfully
  const queryArticleComments =
    queryArticleCommentsold as unknown as CommentTypes[];
  return (
    <div
      id="article-comments-section"
      className="flex flex-col gap-5 w-full lg:px-14 py-5"
    >
      <AddCommentSection articleId={articleId} />

      {queryArticleComments && (
        <>
          <div className="flex gap-2 items-center">
            <h2>Comments </h2>
            <p className="border px-2">{queryArticleComments.length}</p>
          </div>

          <div className="lg:px-10">
            {queryArticleComments.map((element: CommentTypes) => (
              <CommentComponent comment={element} key={`${element._id}`} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
