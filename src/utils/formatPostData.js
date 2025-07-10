import { formatDate } from './dateUtils';

export const formatPostData = (pageData) => {
  return {
    ...pageData,
    posts: pageData.posts.map((post) => ({
      ...post,
      created_at: formatDate(post.created_at),
    })),
  };
};
