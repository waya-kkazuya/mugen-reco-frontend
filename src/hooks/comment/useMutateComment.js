import axios from 'axios';
import { useAppDispatch } from '../../app/hooks';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { toggleCsrfState } from '../../slices/appSlice';

export const useMutateComment = (postId) => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const createCommentMutation = useMutation({
    mutationFn: async (comment) => {
      const response = await axios.post(
        `${import.meta.env.VITE_REACT_APP_API_URL}/posts/${postId}/comments`,
        comment,
        {
          withCredentials: true,
        }
      );
      return response;
    },
    onSuccess: (res) => {
      const previousComments = queryClient.getQueryData(['comments', postId]);
      if (previousComments) {
        queryClient.setQueryData(['comments', postId], [...previousComments, res.data]); // ２つのキーでキャッシュを保存
      }
    },
    onError: (err) => {
      if (err.response.data.detail === 'The CSRF token has expired.') {
        dispatch(toggleCsrfState()); //失敗した時はCSRFを再度取得
      }

      throw err;
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: async (commentId) =>
      axios.delete(
        `${import.meta.env.VITE_REACT_APP_API_URL}/posts/${postId}/comments/${commentId}`,
        {
          withCredentials: true,
        }
      ),
    onSuccess: (res, commentId) => {
      const previousComments = queryClient.getQueryData(['comments', postId]);
      if (previousComments) {
        queryClient.setQueryData(
          ['comments', postId],
          previousComments.filter((comment) => comment.comment_id !== commentId)
        );
      }
    },
    onError: (err) => {
      alert(`${err.response.data.detail}\n${err.message}`);
      if (
        err.response.data.detail === 'The JWT has expired' ||
        err.response.data.detail === 'The CSRF token has expired.'
      ) {
        dispatch(toggleCsrfState()); //失敗した時はCSRFを再度取得
      }
    },
  });

  return {
    createCommentMutation,
    deleteCommentMutation,
  };
};
