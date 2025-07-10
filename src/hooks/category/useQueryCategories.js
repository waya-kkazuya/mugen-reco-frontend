import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

// 投稿一覧の閲覧にはJWT認証は不要、withCredentialsは不要
export const useQueryCategories = () => {
  const getCategories = async () => {
    const { data } = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/categories`);
    return data;
  };
  // キャッシュに保存する設定、エラーも返り値に存在
  return useQuery({
    queryKey: 'categories',
    queryFn: getCategories,
    // staleTime: 1000 * 30 // 30秒（または 60秒程度）
    staleTime: Infinity, // 再フェッチのタイミングを後で調整、CategoryなのでInfinity
  });
};
