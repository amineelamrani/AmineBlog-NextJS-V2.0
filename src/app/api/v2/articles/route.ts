import "@/models/index";
import type { NextRequest } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Article from "@/models/Article";

export async function GET(request: NextRequest) {
  // Function to get all articles (limit of 6 and when needed can provide more)
  await dbConnect();

  const searchParams = request.nextUrl.searchParams;
  const page = searchParams.get("page") * 1 || 1;
  const limit = searchParams.get("limit") * 1 || 6;

  const queryArticles = await Article.find({})
    .select("-content")
    .sort("-createdAt")
    .skip((page - 1) * limit)
    .limit(limit)
    .populate("author", "name profilePicture")
    .exec();
  console.log({ page, limit });
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
      message: "success",
      result: { queryArticles },
    },
    { status: 202 }
  );
}
