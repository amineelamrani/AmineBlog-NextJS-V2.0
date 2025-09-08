"use client";
import React, { useEffect, useRef, useState } from "react";
import ArticleResultItemCard from "./ArticleResultItemCard";
import { ArticleTypes } from "@/lib/types";

export default function LoadMoreHomePage() {
  const [fetchedArticles, setFetchedArticles] = useState<ArticleTypes[] | null>(
    null
  );
  const [pageIndex, setPageIndex] = useState<number>(1);
  const buttonLoadRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const fetchData = async (page: number, limit: number) => {
      const res = await fetch(`/api/v2/articles?page=${page}&limit=${limit}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();

      if (data && data.status === "success") {
        if (data.result.queryArticles.length < 6) {
          if (fetchedArticles !== null) {
            const newArr = [...fetchedArticles].concat(
              data.result.queryArticles
            );
            setFetchedArticles(newArr);
            if (buttonLoadRef.current) {
              buttonLoadRef.current.disabled = true;
            }
            return;
          } else {
            const newArr = [...data.result.queryArticles];
            setFetchedArticles(newArr);
            if (buttonLoadRef.current) {
              buttonLoadRef.current.disabled = true;
            }
            return;
          }
        }
        if (fetchedArticles !== null) {
          const newArr = [...fetchedArticles].concat(data.result.queryArticles);
          setFetchedArticles(newArr);
        } else {
          setFetchedArticles(data.result.queryArticles);
        }
      }
    };

    if (pageIndex > 1) {
      fetchData(pageIndex, 6);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageIndex]);

  const handleClick = () => {
    setPageIndex((pageIndex) => pageIndex + 1);
  };

  return (
    <>
      {fetchedArticles && (
        <div className="w-full flex flex-wrap py-5 items-stretch">
          {fetchedArticles.map((article: ArticleTypes, index: number) => {
            return <ArticleResultItemCard article={article} key={index} />;
          })}
        </div>
      )}
      <button
        onClick={handleClick}
        ref={buttonLoadRef}
        className="btn mx-auto mb-5"
      >
        <span className="text-xl font-black animate-bounce">&#11107;</span> Load
        More
      </button>
    </>
  );
}
