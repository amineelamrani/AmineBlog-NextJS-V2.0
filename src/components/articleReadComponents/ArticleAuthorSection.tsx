import React from "react";
import Image from "next/image";
import AuthorActionSection from "./AuthorActionSection";
import { Author } from "@/lib/types";

interface AuthorSectionProps {
  articleId: string;
  author: Author;
}

export default function ArticleAuthorSection({
  articleId,
  author,
}: AuthorSectionProps) {
  // This component will take the articleId and also the author + the current user late to see if he is liked it alreadu
  return (
    <>
      {author.name && (
        <div className="flex justify-between gap-5 w-full px-5 lg:px-14 py-5 border-t-2 border-b-2">
          <div className="flex gap-2 items-center">
            <Image
              src={author.profilePicture}
              alt="author image"
              width={14}
              height={14}
              className="w-8 h-8 md:w-14 md:h-14 rounded-full border bg-white"
            />
            <ul className="flex flex-col items-start ">
              <li className="font-bold text-base md:text-lg">{author.name}</li>
              <li className="text-base-content text-sm md:text-base">Admin</li>
            </ul>
          </div>
          <div className="flex gap-4 items-center">
            <AuthorActionSection articleId={articleId} />
          </div>
        </div>
      )}
    </>
  );
}
