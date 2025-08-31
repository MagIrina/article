export interface CommentActionType {
  comment: string,
  action: 'like' | 'dislike' | 'violate',
}
