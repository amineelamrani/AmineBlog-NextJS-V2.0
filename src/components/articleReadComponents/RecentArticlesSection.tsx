import dbConnect from "@/lib/dbConnect";
import Article from "@/models/Article";
import React from "react";
import ArticleResultItemCard from "../ArticleResultItemCard";
import { ArticleTypes } from "@/lib/types";

export default async function RecentArticlesSection() {
  await dbConnect();
  const queryHomeArticlesOld = await Article.find({})
    .select("-content")
    .sort("-createdAt")
    .limit(3)
    .populate("author", "name profilePicture")
    .exec();
  const queryHomeArticles = queryHomeArticlesOld as unknown as ArticleTypes[];
  return (
    <>
      {queryHomeArticles && (
        <div
          id="recent-articles-section"
          className="flex flex-col items-center w-full gap-5"
        >
          <h1 className="text-2xl">Recent Articles</h1>
          <div className="w-full flex flex-wrap py-5 items-stretch">
            {queryHomeArticles.map((article, index) => (
              <ArticleResultItemCard article={article} key={index} />
            ))}
          </div>
        </div>
      )}
    </>
  );
}
