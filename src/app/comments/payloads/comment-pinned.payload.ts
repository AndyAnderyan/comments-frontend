export interface CommentPinnedPayload {
  objectKey: {
    objectTypeId: string,
    objectId: string,
  }
  pinnedCommentId: string | null
}
