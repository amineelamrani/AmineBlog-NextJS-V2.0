import "@/models/index";
import dbConnect from "@/lib/dbConnect";
import Article from "@/models/Article";
import SearchComponent from "@/components/SearchComponent";
import ArticleResultItemCard from "@/components/ArticleResultItemCard";
import LoadMoreHomePage from "@/components/LoadMoreHomePage";
import { ArticleTypes } from "@/lib/types";

// so like this we would build our home page for SEO (no need to have an API to call it then do some client work like in the MERN project - so this is what is different in Nextjs)

// Algo decision => First render would be SEO freindly but next when clicking on load more then it won't be anymore SEO but something like react
// The first items would be rendered from the server and then we would have a client component

export default async function Home() {
  // const search = await searchParams;
  // const page = parseInt(search?.page || "1");
  const page = 1;
  await dbConnect();
  const queryHomeArticles1 = await Article.find({})
    .select("-content")
    .sort("-createdAt")
    .skip((page - 1) * 6)
    .limit(6)
    .populate("author", "name profilePicture")
    .exec();
  const queryHomeArticles = queryHomeArticles1 as unknown as ArticleTypes[];

  return (
    <>
      {queryHomeArticles && (
        <div className="flex flex-col container mx-auto w-full">
          <div
            id="search-section"
            className="prose lg:prose-xl py-10 flex flex-col items-center mx-auto"
          >
            <h3>Welcome to My Blog</h3>
            <h1 className="text-center">Amine&apos;s Code Chronicles</h1>
            <p className="text-center pb-3">
              Here you&apos;ll find a variety of articles and tutorials on
              topics such as web development, software engineering, and
              programming languages.
            </p>
            <SearchComponent />
          </div>

          <div id="articles-section" className="">
            <div
              id="articles-display-section"
              className="w-full flex flex-wrap py-5 items-stretch"
            >
              {queryHomeArticles.map((article: ArticleTypes, index: number) => {
                return <ArticleResultItemCard article={article} key={index} />;
              })}
            </div>
          </div>

          <LoadMoreHomePage />
        </div>
      )}
    </>
  );
}
