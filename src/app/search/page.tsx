import SearchPlaceSection from "@/components/SearchPlaceSection";
import SearchResultDisplay from "@/components/SearchResultDisplay";
import dbConnect from "@/lib/dbConnect";
import Article from "@/models/Article";
import Link from "next/link";
import React from "react";

export const metadata = {
  title: "Search | Amine's Code Chronicles",
};

export default async function Page({
  searchParams,
}: {
  searchParams: {
    page?: string;
    searchTerm?: string;
    category?: string;
    sort?: string;
  };
}) {
  // Get the page number (if no exist then it is a page 1 by default)
  // If no params is presented for the search then handle a find for all (searchTerm=&category=uncategorized&sort=latest)
  // when clicking on page 2 (it make the linke like this /search?page=2)
  // when clicking on the search it trigger the search (will revalidate a tag to be all handled in the server not client side)

  const { page, searchTerm, category, sort } = await searchParams;
  const pageInt = parseInt(page || "1", 10);

  let queryArticleSearch = "";
  await dbConnect();
  if (!searchTerm || searchTerm.length === 0) {
    queryArticleSearch = Article.find({});
  } else {
    queryArticleSearch = Article.find({ $text: { $search: searchTerm } });
  }

  if (category && category !== "uncategorized") {
    queryArticleSearch.where("category").in([category]);
  }

  if (!sort || sort === "latest") {
    queryArticleSearch.sort("-createdAt");
  } else if (sort === "oldest") {
    queryArticleSearch.sort("createdAt");
  }

  //will limit the number of queries to 7 so if we have 7 then next page would be available if we have less than 7 then it has to be disabled (if we are on a page more than 1 then previous always available)

  if (!page || pageInt <= 1) {
    queryArticleSearch.limit(7);
  } else {
    queryArticleSearch.skip((page - 1) * 6).limit(7);
  }

  queryArticleSearch = await queryArticleSearch
    .populate("author", "name profilePicture")
    .exec();

  return (
    <div className="flex flex-col w-full">
      {!queryArticleSearch && (
        <div className="toast z-50">
          <div className="alert alert-error">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 shrink-0 stroke-current"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <span>An error happened while trying to go to the server!</span>
          </div>
        </div>
      )}
      <SearchPlaceSection
        searchTerm={searchTerm}
        category={category}
        sort={sort}
      />
      <SearchResultDisplay articles={queryArticleSearch} />
      {/* <PaginationSection /> Here I would add the pagination handling inside this componenet so it will be a Link  */}
      <div className="join flex mx-auto mb-6">
        {pageInt > 1 ? (
          <Link
            href={`/search?page=${pageInt - 1}&searchTerm=${
              searchTerm || ""
            }&category=${category || "uncategorized"}&sort=${sort || "latest"}`}
            className="join-item btn"
          >
            «
          </Link>
        ) : (
          <button className="join-item btn " disabled>
            «
          </button>
        )}
        <button className="join-item btn pointer-events-none">
          Page {pageInt}
        </button>
        {queryArticleSearch.length > 6 ? (
          <Link
            href={`/search?page=${pageInt + 1}&searchTerm=${
              searchTerm || ""
            }&category=${category || "uncategorized"}&sort=${sort || "latest"}`}
            className="join-item btn"
          >
            »
          </Link>
        ) : (
          <button className="join-item btn " disabled>
            »
          </button>
        )}
      </div>
    </div>
  );
}
