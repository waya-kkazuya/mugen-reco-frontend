import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useAppDispatch } from '../../app/hooks';
import { setLoggedInUser, logoutUser, toggleCsrfState } from '../../slices/appSlice';

export const useMutateAuth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  const checkUserNameMutation = useMutation({
    mutationFn: async (username) => {
      return await axios.get(
        `${import.meta.env.VITE_REACT_APP_API_URL}/check-username/${username}`
      );
    },
    onSuccess: (res) => {
      console.log(res.data);
      console.log(`usernameチェック、res.data.available: ${res.data.is_available}`);
      console.log(`usernameチェック、res.data.message: ${res.data.message}`);
    },
    // onError部分を削除することでエラーを外側に伝播させる
    // onError: (err) => {
    //   alert(`${err.response.data.detail}\n${err.message}`);
    // },
  });

  const loginMutation = useMutation({
    mutationFn: async (user) => {
      return await axios.post(`${import.meta.env.VITE_REACT_APP_API_URL}/login`, user, {
        withCredentials: true,
      });
    },
    onSuccess: (res) => {
      console.log(`ログイン成功、res.data.username: ${res.data.username}`);
      dispatch(setLoggedInUser(res.data.username)); // Reduxにログインユーザー情報を保存
      // ProtectedRoute から渡された state を取得
      const from = location.state?.from || '/home';
      console.log(from); // '/profile?tab=liked-posts'

      navigate(from, { replace: true });
    },
    onError: (err) => {
      if (err.response.data.detail === 'The CSRF token has expired.') {
        dispatch(toggleCsrfState());
      }
      // エラーを外部に伝播させる
      throw err;
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (user) => {
      return await axios.post(`${import.meta.env.VITE_REACT_APP_API_URL}/register`, user, {
        withCredentials: true,
      });
    },
    onError: (err) => {
      // alert(`${err.response.data.detail}\n${err.message}`);
      if (err.response.data.detail === 'The CSRF token has expired.') {
        dispatch(toggleCsrfState());
      }
      // エラーを外部に伝播させる
      throw err;
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      return await axios.post(
        `${import.meta.env.VITE_REACT_APP_API_URL}/logout`,
        {},
        {
          withCredentials: true,
        }
      );
    },
    onSuccess: () => {
      dispatch(logoutUser()); // Reduxからユーザー情報を消去
      navigate('/home');
    },
    onError: (err) => {
      alert(`${err.response.data.detail}\n${err.message}`);
      // #ログアウトでもCSRFtokenが必要
      if (err.response.data.detail === 'The CSRF token has expired') {
        dispatch(toggleCsrfState());
      }
    },
  });

  return { checkUserNameMutation, loginMutation, registerMutation, logoutMutation };
};
