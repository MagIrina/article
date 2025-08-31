import {UserInfoType} from "./user-info.type";

export interface CommentType {
  id: string,
  text: string,
  date: string,
  likesCount: number,
  dislikesCount: number,
  user: UserInfoType
}
