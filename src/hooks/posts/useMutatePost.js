import axios from 'axios';
import { useAppDispatch } from '../../app/hooks';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { toggleCsrfState } from '../../slices/appSlice';
import { useNavigate } from 'react-router-dom';

export const useMutatePost = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  const createPostMutation = useMutation({
    mutationFn: async (post) =>
      axios.post(`${import.meta.env.VITE_REACT_APP_API_URL}/posts`, post, {
        withCredentials: true,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(['posts']); // すべての投稿関連キャッシュを無効化
      navigate('/home'); // Home画面に遷移でuseQueryPostでPostsのキャッシュが作成される流れ
    },
    onError: (err) => {
      if (err.response.data.detail === 'The CSRF token has expired.') {
        dispatch(toggleCsrfState()); // 失敗した時はCSRFを再取得
      }

      throw err;
    },
  });

  const updatePostMutation = useMutation({
    mutationFn: async (post) =>
      axios.put(
        `${import.meta.env.VITE_REACT_APP_API_URL}/posts/${post.postId}`,
        {
          category: post.category,
          title: post.title,
          description: post.description,
          recommend1: post.recommend1,
          recommend2: post.recommend2,
          recommend3: post.recommend3,
        },
        {
          withCredentials: true,
        }
      ),
    onSuccess: (res, variables) => {
      queryClient.invalidateQueries(['posts']); // すべての投稿関連キャッシュを無効化
      queryClient.setQueryData(['single', variables.id], res.data); // 詳細画面用のキャッシュも更新
      navigate(`/posts/${variables.id}`, { replace: true });
    },
    onError: (err) => {
      if (err.response?.data?.detail === 'The CSRF token has expired.') {
        dispatch(toggleCsrfState()); // 失敗した時はCSRFを再取得
      }

      throw err;
    },
  });

  const deletePostMutation = useMutation({
    mutationFn: async (id) =>
      axios.delete(`${import.meta.env.VITE_REACT_APP_API_URL}/posts/${id}`, {
        withCredentials: true,
      }),
    onSuccess: (res, variables) => {
      queryClient.invalidateQueries(['posts']); // すべての投稿関連キャッシュを無効化
      queryClient.removeQueries(['single', variables.id]); // 個別投稿のキャッシュも削除
      navigate('/home');
    },
    onError: (err) => {
      if (err.response.data.detail === 'The CSRF token has expired.') {
        dispatch(toggleCsrfState()); //失敗した時はCSRFを再度取得
      }

      throw err;
    },
  });

  return {
    createPostMutation,
    updatePostMutation,
    deletePostMutation,
  };
};
