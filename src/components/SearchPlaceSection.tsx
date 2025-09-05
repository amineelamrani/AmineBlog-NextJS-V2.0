"use client";
import Link from "next/link";
import React, { useState } from "react";

export default function SearchPlaceSection({ searchTerm, category, sort }) {
  // when clicking on the Search button, we will go to the page with the terms sat on its url <Link> button
  const [inputSearchTerm, setInputSearchTerm] = useState(searchTerm || "");
  const [inputSortTerm, setInputSortTerm] = useState(sort || "latest");
  const [inputCategoryTerm, setInputCategoryTerm] = useState(
    category || "uncategorized"
  );
  //   console.log(inputSearchTerm, inputSortTerm, inputCategoryTerm);

  return (
    <div
      id="search-placeholder"
      className="flex flex-col items-center w-full py-10 gap-10 border-b-2"
    >
      <h1 className="text-5xl font-bold">Search Articles</h1>
      <form action="" className="w-full flex flex-col items-center">
        <label className="input input-bordered flex items-center gap-2 max-w-xs md:min-w-96">
          <input
            type="text"
            className="grow"
            placeholder="Search"
            value={inputSearchTerm}
            onChange={(e) => setInputSearchTerm(e.target.value)}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-5 w-5 opacity-70 hover:cursor-pointer"
          >
            <path
              fillRule="evenodd"
              d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
              clipRule="evenodd"
            />
          </svg>
        </label>

        <div className="flex flex-col sm:flex-row w-full mx-auto justify-center gap-5 items-center py-5">
          <select
            className="select select-bordered w-full max-w-xs md:w-52"
            value={inputCategoryTerm}
            onChange={(e) => setInputCategoryTerm(e.target.value)}
          >
            <option value="uncategorized">Uncategorized</option>
            <option value="Testig">testig</option>
            <option value="Next.js">Next.js</option>
            <option value="React.js">React.js</option>
            <option value="Node.js">Node.js</option>
            <option value="Express.js">Express.js</option>
            <option value="Mongoose">Mongoose</option>
            <option value="Javascript">Javascript</option>
            <option value="MERN">MERN</option>
            <option value="full-stack">full-stack</option>
            <option value="front-end">front-end</option>
            <option value="back-end">back-end</option>
            <option value="Web-dev">Web-dev</option>
          </select>

          <div className="form-control">
            <label className="label cursor-pointer gap-3">
              <span className="label-text">Sort by Latest </span>
              <input
                type="checkbox"
                className="toggle"
                checked={inputSortTerm === "latest" ? true : false}
                onChange={(e) =>
                  setInputSortTerm(e.target.checked ? "latest" : "oldest")
                }
              />
            </label>
          </div>
        </div>
        <Link
          href={`/search?page=1&searchTerm=${inputSearchTerm}&category=${inputCategoryTerm}&sort=${inputSortTerm}`}
          className="btn"
          type="submit"
        >
          Search
        </Link>
      </form>
    </div>
  );
}
