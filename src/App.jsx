import { useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useAppSelector } from './app/hooks';
import { selectCsrfState } from './slices/appSlice';
import { useAppDispatch } from './app/hooks';
import AppRoutes from './routes/AppRoutes';
import { fetchAuthUser } from './slices/appSlice';

function App() {
  const dispatch = useAppDispatch();
  const csrf = useAppSelector(selectCsrfState);

  // csrftokenの取得
  useEffect(() => {
    const getCsrfToken = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/csrftoken`);
        axios.defaults.headers.common['X-CSRF-Token'] = res.data.csrf_token;
      } catch (error) {
        console.error('Failed to fetch CSRF token:', error);
      }
    };

    getCsrfToken();
  }, [csrf, dispatch]);

  // 更新は初回レンダリングと同義
  useEffect(() => {
    dispatch(fetchAuthUser());
  }, []);

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
