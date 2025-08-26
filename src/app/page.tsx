import "@/models/index";
import Link from "next/link";
import dbConnect from "@/lib/dbConnect";
import Article from "@/models/Article";

// so like this we would build our home page for SEO (no need to have an API to call it then do some client work like in the MERN project - so this is what is different in Nextjs)

interface Props {
  searchParams?: { page?: string };
}

export default async function Home({ searchParams }: Props) {
  const search = await searchParams;
  const page = parseInt(search?.page || "1");
  console.log(page);
  await dbConnect();
  const queryHomeArticles = await Article.find({})
    .select("-content")
    .sort("-createdAt")
    .skip((page - 1) * 6)
    .limit(6)
    .populate("author", "name profilePicture")
    .exec();

  return (
    <div>
      <h1>Home page</h1>
      <Link href={`?page=${2}`}>
        <button>Load more</button>
      </Link>
    </div>
  );
}
