"use client";
import React, { useEffect, useRef, useState } from "react";
import ArticleResultItemCard from "./ArticleResultItemCard";

interface Articles {
  _id: string;
  image: string;
  title: string;
  summary: string;
  author: {
    name: string;
    profilePicture: string;
    _id: string;
  };
  timesLiked: number;
  createdAt: string;
  category: string[];
  readTime: number;
  updatedAt: string;
}

export default function LoadMoreHomePage() {
  const [fetchedArticles, setFetchedArticles] = useState<Articles[] | null>(
    null
  );
  const [pageIndex, setPageIndex] = useState<number>(1);
  const buttonLoadRef = useRef(null);

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
            let newArr = [...fetchedArticles].concat(data.result.queryArticles);
            setFetchedArticles(newArr);
            buttonLoadRef.current.disabled = true;
            return;
          } else {
            let newArr = [...data.result.queryArticles];
            setFetchedArticles(newArr);
            buttonLoadRef.current.disabled = true;
            return;
          }
        }
        if (fetchedArticles !== null) {
          let newArr = [...fetchedArticles].concat(data.result.queryArticles);
          setFetchedArticles(newArr);
        } else {
          setFetchedArticles(data.result.queryArticles);
        }
      }
    };

    if (pageIndex > 1) {
      fetchData(pageIndex, 6);
    }
  }, [pageIndex]);

  const handleClick = () => {
    setPageIndex((pageIndex) => pageIndex + 1);
  };

  return (
    <>
      {fetchedArticles && (
        <div className="w-full flex flex-wrap py-5 items-stretch">
          {fetchedArticles.map((article: Articles, index: number) => {
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
