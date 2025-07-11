import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';
import { formatPostData } from '../../utils/formatPostData';

// ユーザーがいいねした投稿一覧を取得（JWT認証が必要）
export const useQueryUserLikedPosts = (username) => {
  const fetchUserLikedPosts = async ({ pageParam = null }) => {
    const { data } = await axios.get(
      `${import.meta.env.VITE_REACT_APP_API_URL}/users/${username}/liked-posts`,
      {
        params: {
          limit: 10,
          last_evaluated_key: pageParam || undefined,
        },
        withCredentials: true,
      }
    );
    return formatPostData(data);
  };

  // キャッシュに保存する設定、エラーも返り値に存在
  return useInfiniteQuery({
    queryKey: ['userLikedPosts', username], //拡張して他のユーザーのProfile画面をみるときのためにusernameが必要
    queryFn: fetchUserLikedPosts,
    getNextPageParam: (lastPage) => lastPage.last_evaluated_key ?? undefined,
    staleTime: 1000 * 60 * 1, // 1分間キャッシュを再利用
    enabled: !!username,
  });
};
