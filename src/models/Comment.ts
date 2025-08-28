import mongoose from "mongoose";

export interface Comments extends mongoose.Document {
  content: string;
  articleId: mongoose.Schema.Types.ObjectId;
  owner: mongoose.Schema.Types.ObjectId;
  ownerName: string;
  ownerPicture: string;
  likedBy: mongoose.Schema.Types.ObjectId[];
}

const commentSchema = new mongoose.Schema<Comments>(
  {
    content: {
      type: String,
      required: [true, "You should provide the content of the comment"],
      maxLength: 150,
    },
    articleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Article",
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    ownerName: {
      type: String,
      required: [
        true,
        "You should provide the name of the owner - even if the ref is given",
      ],
    },
    ownerPicture: {
      type: String,
    },
    likedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

const Comment: mongoose.Model<Comments> =
  mongoose.models.Comment || mongoose.model<Comments>("Comment", commentSchema);

export default Comment;
