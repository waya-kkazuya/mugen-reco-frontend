import { formatToJST } from './dateUtils';

export const formatSinglePostData = (post) => {
  return {
    ...post,
    created_at: formatToJST(post.created_at),
  };
};
