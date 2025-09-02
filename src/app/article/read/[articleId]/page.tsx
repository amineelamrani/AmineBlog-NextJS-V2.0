import dbConnect from "@/lib/dbConnect";
import Article from "@/models/Article";
import "@/models/index";
import React, { Suspense } from "react";
import Image from "next/image";
import Markdown from "react-markdown";
import ArticleAuthorSection from "@/components/articleReadComponents/ArticleAuthorSection";
import ArticleCommentsSections from "@/components/articleReadComponents/ArticleCommentsSections";
import RecentArticlesSection from "@/components/articleReadComponents/RecentArticlesSection";
import { unstable_cache } from "next/cache";

// interface Articles {
//   _id: string;
//   image: string;
//   title: string;
//   summary: string;
//   author: {
//     name: string;
//     profilePicture: string;
//     _id: string;
//   };
//   timesLiked: number;
//   createdAt: string;
//   category: string[];
//   readTime: number;
//   updatedAt: string;
// }

const getLikingPeople = unstable_cache(
  async (articleId) => {
    return await Article.findById(articleId, "timesLiked");
  },
  ["likesNumber"],
  { tags: ["likesNumber"] }
);

export default async function page({
  params,
}: {
  params: Promise<{ articleId: string }>;
}) {
  const { articleId } = await params;
  const badgeTypes = [
    "badge-neutral",
    "badge-primary",
    "badge-secondary",
    "badge-accent",
  ];
  await dbConnect();
  const articleData = await Article.findById(articleId)
    .populate("author", "name profilePicture")
    .exec();

  const likedNumber = await getLikingPeople(articleId);

  return (
    <div className="container">
      {articleData && (
        <div className="flex flex-col mx-auto w-full items-center py-14 lg:px-24">
          {/* For errors use a reducer with context as it is better than redux it is not that super fast state changing */}
          <div id="header-section" className="flex flex-col gap-3 items-center">
            <h3 className="text-primary font-bold text-sm md:text-base">
              Published{" "}
              {new Date(articleData.createdAt)
                .toDateString()
                .split(" ")
                .slice(1)
                .join(" ")}
            </h3>
            <h1 className="text-2xl md:text-4xl font-bold text-center px-10 capitalize">
              {articleData.title}
            </h1>
            <p className="text-center text-sm md:text-base text-base-content">
              {articleData.summary}
            </p>
            <div className="flex gap-2 flex-wrap items-center justify-center">
              {articleData.category.map((element, index) => (
                <div
                  className={`badge ${badgeTypes[index % 4]}`}
                  key={index + 10000}
                >
                  {element}
                </div>
              ))}
            </div>
          </div>
          <div
            id="cover-image"
            className="mx-auto mt-14 h-40 sm:h-46 md:h-90 w-full relative"
          >
            <Image
              src={articleData.image}
              fill
              alt=""
              className="object-cover"
            />
            <div className="absolute left-6 -bottom-7">
              <h1 className={`font-bold text-base md:text-xl`}>
                👋 Liked By {likedNumber?.timesLiked} Person
                {articleData.timesLiked > 1 && "s"}
              </h1>
            </div>
          </div>

          <div id="article-content" className="prose max-w-full py-10">
            {/* Now I have a content as a markdown and need to translate it to html */}
            <Markdown>{articleData.content}</Markdown>
          </div>

          {/* Need here the article author section => Client component cause we need click */}
          <ArticleAuthorSection
            articleId={articleId}
            author={articleData.author}
          />
          {/* Comments also as well need to be in the client */}
          <Suspense fallback={<p>Loading Comments Section ...</p>}>
            <ArticleCommentsSections articleId={articleId} />
          </Suspense>

          {/* Recent articles section to be handled in the server side as well */}
          <Suspense fallback={<p>Loading Recent Articles...</p>}>
            <RecentArticlesSection />
          </Suspense>
        </div>
      )}
    </div>
  );
}
