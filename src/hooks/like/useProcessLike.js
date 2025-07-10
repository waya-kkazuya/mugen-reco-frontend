import { useMutateLike } from './useMutateLike';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../app/hooks';
import { logoutUser } from '../../slices/appSlice';

export const useProcessLike = (postId, selectedCategory) => {
  const { toggleLikeMutation } = useMutateLike(postId, selectedCategory);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleLikeToggle = async (retryCount = 0) => {
    toggleLikeMutation.mutateAsync().catch((err) => {
      if (err.response?.data?.detail === 'The CSRF token has expired.' && retryCount === 0) {
        console.log('CSRF token expired, retrying frist time...');
        return new Promise((resolve) => setTimeout(resolve, 500)).then(() =>
          handleLikeToggle(retryCount + 1)
        );
      }

      if (err.response.data.detail === 'The JWT has expired') {
        console.log('The JWT has expired');
        dispatch(logoutUser);
        navigate('/login');
      }

      console.error('いいね処理でエラーが発生しました:', err);
    });
  };

  return {
    handleLikeToggle,
  };
};
