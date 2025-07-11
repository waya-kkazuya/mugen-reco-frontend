import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useMutateAuth } from './useMutateAuth';
import { logoutUser, setLoggedInUser } from '../../slices/appSlice';

// hooksとして使うのでuse○○と命名する
// バリデーションロジックはこちらに記載する
export const useProcessAuth = () => {
  const navigate = useNavigate();

  const queryClient = useQueryClient();
  const { checkUserNameMutation, loginMutation, registerMutation, logoutMutation } =
    useMutateAuth();

  const checkUsernameAvailability = async (username) => {
    try {
      const response = await checkUserNameMutation.mutateAsync(username);
      return {
        isAvailable: response.data.is_available,
        message: response.data.message,
      };
    } catch (error) {
      return { error: error.message };
    }
  };

  const handleRegisterSubmit = async (formData) => {
    await checkUserNameMutation
      .mutateAsync(formData.username)
      .then((checkUserNameResponse) => {
        // console.log('ユーザー名チェック完了');
        if (!checkUserNameResponse.data.is_available) {
          const error = new Error('このユーザー名は既に使用されています');
          error.type = 'USERNAME_UNAVAILABLE';
          throw error;
        }
        // console.log('次の処理（登録）へ');
        return registerMutation.mutateAsync({
          username: formData.username,
          password: formData.password,
        });
      })
      .then((registerResponse) => {
        // 登録完了、次の処理（ログイン）へ
        return loginMutation.mutateAsync({
          username: formData.username,
          password: formData.password,
        });
      });
  };

  const handleLoginSubmit = async (formData, retryCount = 0) => {
    return loginMutation
      .mutateAsync({
        username: formData.username,
        password: formData.password,
      })
      .catch((error) => {
        if (error.response?.data?.detail === 'The CSRF token has expired.' && retryCount === 0) {
          return new Promise((resolve) => setTimeout(resolve, 500)).then(() =>
            handleLoginSubmit(formData, retryCount + 1)
          );
        }
        throw error;
      });
  };

  const logout = async () => {
    await logoutMutation.mutateAsync();
    // GETメソッドで取得したものをキャッシュしているので、それを削除する必要がある
    queryClient.removeQueries({ queryKey: ['posts'] });
    queryClient.removeQueries({ queryKey: ['user'] });
    queryClient.removeQueries({ queryKey: ['single'] });
    navigate('/login'); // ログアウトしたらログイン画面に戻る
  };

  return {
    checkUsernameAvailability,
    registerMutation,
    loginMutation,
    logout,
    handleRegisterSubmit,
    handleLoginSubmit,
    setLoggedInUser,
    logoutUser,
  };
};
