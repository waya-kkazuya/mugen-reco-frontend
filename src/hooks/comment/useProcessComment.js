import { useMutateComment } from './useMutateComment';

export const useProcessComment = (postId) => {
  const { createCommentMutation, deleteCommentMutation } = useMutateComment(postId);

  const handleCommentCreateSubmit = (formData, retryCount = 0) => {
    return createCommentMutation
      .mutateAsync({
        comment: formData.comment.trim(),
      })
      .then(() => {
        // console.log('Comment created successfully');
      })
      .catch((err) => {
        if (err.response?.data?.detail === 'The CSRF token has expired.' && retryCount === 0) {
          return new Promise((resolve) => setTimeout(resolve, 500)).then(() =>
            handleCommentCreateSubmit(formData, retryCount + 1)
          );
        }
        throw err;
      });
  };

  const handleCommentDeleteSubmit = (commentId) => {
    if (window.confirm('このコメントを削除しますか？')) {
      deleteCommentMutation.mutate(commentId);
    }
  };

  return {
    handleCommentCreateSubmit,
    handleCommentDeleteSubmit,
  };
};
