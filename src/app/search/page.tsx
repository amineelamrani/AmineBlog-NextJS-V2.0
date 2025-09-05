import SearchPlaceSection from "@/components/SearchPlaceSection";
import SearchResultDisplay from "@/components/SearchResultDisplay";
import dbConnect from "@/lib/dbConnect";
import Article from "@/models/Article";
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

  if (!page || pageInt <= 1) {
    queryArticleSearch.limit(6);
  } else {
    queryArticleSearch.skip((page - 1) * 6).limit(6);
  }

  queryArticleSearch = await queryArticleSearch
    .populate("author", "name profilePicture")
    .exec();

  return (
    <div className="flex flex-col w-full">
      <SearchPlaceSection
        searchTerm={searchTerm}
        category={category}
        sort={sort}
      />
      <SearchResultDisplay />
      {/* <PaginationSection /> Here I would add the pagination handling inside this componenet so it will be a Link  */}
    </div>
  );
}
