import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';
import { formatPostData } from '../../utils/formatPostData';

// 投稿一覧の閲覧にはJWT認証は不要、withCredentialsはが必要
// usernameはReduxから取得
export const useQueryUserPosts = (username) => {
  const fetchUserPosts = async ({ pageParam = null }) => {
    const { data } = await axios.get(
      `${import.meta.env.VITE_REACT_APP_API_URL}/users/${username}/posts`,
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
    queryKey: ['userPosts', username], //拡張して他のユーザーのProfile画面をみるときのためにusernameが必要
    queryFn: fetchUserPosts,
    getNextPageParam: (lastPage) => lastPage.last_evaluated_key ?? undefined,
    staleTime: 1000 * 60 * 1, // 1分間キャッシュを再利用
    enabled: !!username,
  });
};
