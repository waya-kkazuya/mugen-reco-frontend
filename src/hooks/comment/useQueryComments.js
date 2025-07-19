import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

// 投稿一覧の閲覧にはJWT認証（withCredentials）は不要
export const useQueryComments = (postId) => {
  const getComments = async () => {
    const { data } = await axios.get(
      `${import.meta.env.VITE_REACT_APP_API_URL}/posts/${postId}/comments`
    );
    return data;
  };
  // キャッシュに保存する設定、エラーも返り値に存在
  return useQuery({
    queryKey: ['comments', postId],
    queryFn: getComments,
    staleTime: 1000 * 30, // 30秒
  });
};
