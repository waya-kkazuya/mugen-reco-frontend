import { formatDate } from './dateUtils';

export const formatSingleCommentData = (comment) => {
  return {
    ...comment,
    created_at: formatDate(comment.created_at),
  };
};
