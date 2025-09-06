import React from "react";
import ArticleResultItemCard from "./ArticleResultItemCard";

export default function SearchResultDisplay({ articles }) {
  return (
    <div id="result-placeholder" className="flex flex-col py-10 gap-5">
      <h1 className="text-3xl">Search Results :</h1>
      <div className="w-full flex flex-wrap py-5 items-stretch">
        {!articles && (
          <div className="toast toast-top toast-center z-50">
            <div className="alert alert-warning">
              <span className="loading loading-spinner loading-xs"></span>
              <span>Searching for results ... </span>
            </div>
          </div>
        )}
        {articles &&
          articles.map((article, index) => {
            if (index < 6) {
              return (
                <ArticleResultItemCard
                  article={article}
                  key={`article-search-${article._id}-${index}`}
                />
              );
            }
          })}
      </div>
    </div>
  );
}
