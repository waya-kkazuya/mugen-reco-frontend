import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useQuerySinglePost = (postId) => {
  const getSinglePost = async () => {
    // ログイン不要
    const { data } = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/posts/${postId}`, {
      withCredentials: true,
    });
    return data;
  };
  return useQuery({
    queryKey: ['single', postId],
    queryFn: () => getSinglePost(postId),
    enabled: !!postId,
    staleTime: 1000 * 60 * 1, // 1分間キャッシュを新鮮とみなす、調整必要
    onError: (err) => {
      // console.log(`${err.response.data.detail}\n${err.message}`);
    },
  });
};
