import {CommentType} from "./comment.type";

export interface ArticleType {
  id: string,
  title: string,
  description: string,
  image: string,
  date: string,
  category: string,
  url: string,
}

export interface ArticleDetailType extends ArticleType {
  id: string;
  url: string;
  title: string;
  description: string;
  text: string;
  image: string;
  date: string;
  category: string;
  comments: CommentType[];
  commentsCount: number;
}
