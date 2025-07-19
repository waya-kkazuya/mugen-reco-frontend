import axios from 'axios';
import { useAppDispatch } from '../../app/hooks';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { toggleCsrfState } from '../../slices/appSlice';
import { useAppSelector } from '../../app/hooks';
import { currentUser } from '../../slices/appSlice';

// selectedCategoryをデフォルトでundefinedにする
export const useMutateLike = (postId, selectedCategory = undefined) => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const username = useAppSelector(currentUser);

  const toggleLikeMutation = useMutation({
    mutationFn: async () =>
      axios.post(
        `${import.meta.env.VITE_REACT_APP_API_URL}/posts/${postId}/like-toggle`,
        {}, // POSTなので空のBodyが必要
        {
          withCredentials: true,
        }
      ),
    onSuccess: (res) => {
      // 投稿についたlike_count(総いいね数)とis_liked(いいねしているかの状態)キャッシュを更新
      // 1. home画面一覧キャッシュの更新（既存の処理）
      if (selectedCategory !== undefined) {
        const queryKey = ['posts', selectedCategory]; //対象のカテゴリ（すべての投稿=nullを含む）
        queryClient.setQueryData(queryKey, (oldCacheData) => {
          if (!oldCacheData) return oldCacheData;

          return {
            ...oldCacheData,
            pages: oldCacheData.pages.map((page) => ({
              ...page,
              posts: page.posts.map((post) =>
                post.post_id === postId
                  ? {
                      ...post,
                      like_count: res.data.like_count,
                      is_liked: res.data.is_liked,
                    }
                  : post
              ),
            })),
          };
        });
      }

      // 2. Profile画面 - 自分の投稿キャッシュの更新
      queryClient.setQueryData(['userPosts', username], (oldData) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            posts: page.posts.map((post) =>
              post.post_id === postId
                ? {
                    ...post,
                    like_count: res.data.like_count,
                    is_liked: res.data.is_liked,
                  }
                : post
            ),
          })),
        };
      });

      // 3. Profile画面 - いいねした投稿キャッシュの更新
      queryClient.setQueryData(['userLikedPosts', username], (oldData) => {
        if (!oldData) return oldData;

        // いいねを解除した場合、リストから投稿を削除
        if (!res.data.is_liked) {
          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              posts: page.posts.filter((post) => post.post_id !== postId),
            })),
          };
        }

        // いいねを追加した場合の処理
        if (res.data.is_liked) {
          // まず既存の投稿リストに該当投稿があるかチェック
          const postExists = oldData.pages.some((page) =>
            page.posts.some((post) => post.post_id === postId)
          );

          if (postExists) {
            // 既にリストにある場合は like_count のみ更新
            return {
              ...oldData,
              pages: oldData.pages.map((page) => ({
                ...page,
                posts: page.posts.map((post) =>
                  post.post_id === postId
                    ? {
                        ...post,
                        like_count: res.data.like_count,
                        is_liked: res.data.is_liked,
                      }
                    : post
                ),
              })),
            };
          } else {
            // 新しい投稿にいいねした場合はキャッシュを無効化
            queryClient.invalidateQueries(['userLikedPosts', username]);
            // 即座に再フェッチを実行
            queryClient.refetchQueries(['userLikedPosts', username]);

            return oldData;
          }
        }

        return oldData;
      });

      // 4. 詳細画面キャッシュの更新
      const detailQueryKey = ['single', postId];
      queryClient.setQueryData(detailQueryKey, (oldDetailData) => {
        if (!oldDetailData) return oldDetailData;

        return {
          ...oldDetailData,
          like_count: res.data.like_count,
          is_liked: res.data.is_liked,
        };
      });
    },
    onError: (err) => {
      // alert(`${err.response.data.detail}\n${err.message}`);
      if (err.response.data.detail === 'The CSRF token has expired.') {
        dispatch(toggleCsrfState()); //失敗した時はCSRFを再度取得
      }

      throw err;
    },
  });

  return {
    toggleLikeMutation,
  };
};
