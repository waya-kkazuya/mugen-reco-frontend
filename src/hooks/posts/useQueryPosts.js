import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';
import { formatPostData } from '../../utils/formatPostData';

// 投稿一覧の閲覧にはJWT認証は不要、withCredentialsは不要
export const useQueryPosts = (selectedCategory) => {
  const fetchPosts = async ({ pageParam = null, queryKey }) => {
    const [, selectedCategory] = queryKey;
    const url = selectedCategory
      ? `${import.meta.env.VITE_REACT_APP_API_URL}/posts/category/${selectedCategory}`
      : `${import.meta.env.VITE_REACT_APP_API_URL}/posts`;
    const { data } = await axios.get(url, {
      params: {
        limit: 10,
        last_evaluated_key: pageParam || undefined, //サーバー側で文字列化する
      },
      withCredentials: true,
    });

    return formatPostData(data);
  };

  // キャッシュに保存する設定、エラーも返り値に存在
  return useInfiniteQuery({
    queryKey: ['posts', selectedCategory],
    queryFn: fetchPosts,
    getNextPageParam: (lastPage) => lastPage.last_evaluated_key ?? undefined,
    staleTime: 1000 * 60 * 1, // 1分間キャッシュを再利用
    enabled: selectedCategory !== undefined,
  });
};
