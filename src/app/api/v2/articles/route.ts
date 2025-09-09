import "@/models/index";
import type { NextRequest } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Article from "@/models/Article";

export async function GET(request: NextRequest) {
  // Function to get all articles (limit of 6 and when needed can provide more)
  await dbConnect();

  const searchParams = request.nextUrl.searchParams;
  let page = 1;
  let limit = 6;
  if (searchParams.get("page")) {
    const pageExtracted = Number(searchParams.get("page"));
    if (pageExtracted) {
      page = pageExtracted;
    }
  }
  if (searchParams.get("limit")) {
    const limitExtracted = Number(searchParams.get("limit"));
    if (limitExtracted) {
      limit = limitExtracted;
    }
  }
  console.log("page : ", page, " | limit : ", limit);

  const queryArticles = await Article.find({})
    .select("-content")
    .sort("-createdAt")
    .skip((page - 1) * limit)
    .limit(limit)
    .populate("author", "name profilePicture")
    .exec();
  if (!queryArticles) {
    return Response.json(
      {
        status: "fail",
        message: "No article with the provided Id",
      },
      { status: 400 }
    );
  }

  return Response.json(
    {
      status: "success",
      result: { queryArticles },
    },
    { status: 202 }
  );
}
