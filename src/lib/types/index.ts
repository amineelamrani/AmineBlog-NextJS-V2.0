export interface ArticleTypes {
  _id: string;
  image: string;
  title: string;
  summary: string;
  content: string;
  author: Author;
  timesLiked: number;
  createdAt: string;
  category: string[];
  readTime: number;
  updatedAt: string;
}

export interface Author {
  name: string;
  profilePicture: string;
  _id: string;
}

export interface CommentTypes {
  comment: string;
  articleId: string;
  owner: string;
  ownerName: string;
  ownerPicture: string;
  likedBy: string[];
  _id: string;
  createdAt: string;
}
