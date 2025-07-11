import { useAppSelector } from '../../app/hooks';
import { currentUser } from '../../slices/appSlice';
import { useMutatePost } from './useMutatePost';
import { useNavigate } from 'react-router-dom';

// 担当する責務を意識
export const useProcessPost = (postId) => {
  const { createPostMutation, updatePostMutation, deletePostMutation } = useMutatePost();
  const navigate = useNavigate();
  const username = useAppSelector(currentUser);

  const handlePostCreateSubmit = async (formData, retryCount = 0) => {
    createPostMutation
      .mutateAsync({
        username: username, //ユーザー情報を保存
        category: formData.selectedCategory,
        title: formData.title,
        description: formData.description.trim() || null,
        recommend1: formData.recommend1,
        recommend2: formData.recommend2,
        recommend3: formData.recommend3,
      })
      .then(() => {
        // 成功時はUI側のformData初期化
        navigate('/home');
      })
      .catch((err) => {
        if (err.response?.data?.detail === 'The CSRF token has expired.' && retryCount === 0) {
          console.log('CSRF token expired, retrying frist time...');
          return new Promise((resolve) => setTimeout(resolve, 500)).then(() =>
            handlePostCreateSubmit(formData, retryCount + 1)
          );
        }
        throw err;
      });
  };

  const handlePostUpdateSubmit = async (formData, retryCount = 0) => {
    updatePostMutation
      .mutateAsync({
        postId,
        category: formData.selectedCategory,
        title: formData.title,
        description: formData.description.trim() || null,
        recommend1: formData.recommend1,
        recommend2: formData.recommend2,
        recommend3: formData.recommend3,
      })
      .then(() => {
        navigate(`/posts/${postId}`);
      })
      .catch((err) => {
        if (err.response?.data?.detail === 'The CSRF token has expired.' && retryCount === 0) {
          console.log('CSRF token expired, retrying frist time...');
          return new Promise((resolve) => setTimeout(resolve, 500)).then(() =>
            handlePostUpdateSubmit(formData, retryCount + 1)
          );
        }
        throw err;
      });
  };

  const handlePostDeleteSubmit = (postId) => {
    if (window.confirm('この投稿を削除しますか？\nこの操作は取り消せません。')) {
      deletePostMutation.mutate(postId);
    }
  };

  return {
    handlePostCreateSubmit,
    handlePostUpdateSubmit,
    handlePostDeleteSubmit,
  };
};
