import { formatDate, formatToJST } from './dateUtils';

export const formatPostData = (pageData) => {
  return {
    ...pageData,
    posts: pageData.posts.map((post) => ({
      ...post,
      created_at: formatToJST(post.created_at),
    })),
  };
};
