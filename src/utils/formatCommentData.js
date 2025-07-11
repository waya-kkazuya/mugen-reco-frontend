import { formatDate } from './dateUtils';

export const formatCommentData = (comments) => {
  return comments.map((comment) => ({
    ...comment,
    created_at: formatDate(comment.created_at),
  }));
};
