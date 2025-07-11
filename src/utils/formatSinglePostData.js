import { formatDate } from './dateUtils';

export const formatSinglePostData = (post) => {
  return {
    ...post,
    created_at: formatDate(post.created_at),
  };
};
