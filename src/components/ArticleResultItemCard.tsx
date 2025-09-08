import Link from "next/link";
import Image from "next/image";
import { JSX } from "react";
import { ArticleTypes } from "@/lib/types";

interface Props {
  article: ArticleTypes;
}

export default function ArticleResultItemCard({ article }: Props) {
  let categories: (JSX.Element | undefined)[] = [];

  if (article) {
    categories = article.category.map((item: string, index: number) => {
      if (index < 3) {
        return (
          <li key={index} className="badge badge-outline">
            {item}
          </li>
        );
      }
    });
  }

  return (
    <>
      {article && (
        <div className="w-full md:w-1/2 lg:w-1/3 p-5">
          <div className="p-5 shadow-2xl flex flex-col gap-3 w-full h-full overflow-hidden">
            <Link href={`/article/read/${article._id}`}>
              <div
                className="overflow-hidden transition ease-in-out hover:scale-90 w-full h-72 md:h-60 lg:h-72 bg-cover bg-center"
                style={{ backgroundImage: `url(${article.image})` }}
              ></div>
            </Link>

            <div className="flex flex-col justify-between h-full">
              <div className="flex flex-col gap-3">
                <ul className="flex gap-1 flex-wrap">{categories}</ul>
                <Link href={`/article/read/${article._id}`}>
                  <h1 className="font-black text-xl capitalize">
                    {article.title}
                  </h1>
                </Link>
                <p>{article.summary}</p>
              </div>

              <div id="author-section" className="flex gap-2 items-center ">
                <Image
                  src={article.author.profilePicture}
                  alt="Author profile picture"
                  className="w-10 h-10 border bg-white rounded-full"
                  width={10}
                  height={10}
                />
                <div className="">
                  <h2 className="text-lg font-bold">{article.author.name}</h2>
                  <p className="flex items-center gap-1">
                    {new Date(article.createdAt)
                      .toDateString()
                      .split(" ")
                      .slice(1)
                      .join(" ")}{" "}
                    - {article.timesLiked}{" "}
                    <span className="font-bold text-xl ">&#9829;</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
