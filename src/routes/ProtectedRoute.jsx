import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';
import { isAuthenticated, isAuthLoading } from '../slices/appSlice';

export default function ProtectedRoute({ children }) {
  const isAuthenticating = useAppSelector(isAuthLoading);
  const auth = useAppSelector(isAuthenticated);
  const location = useLocation();

  // 認証チェック中は待機
  if (isAuthenticating) {
    return <div>Loading...</div>;
  }

  // 現在のlocation情報
  // console.log('location.pathname', location.pathname); // '/profile'
  // console.log('location.search', location.search); // '?tab=liked-posts'
  return auth ? (
    children
  ) : (
    <Navigate
      to="/login"
      state={{
        from: location.pathname + location.search,
        message: 'この機能を利用するにはログインが必要です',
      }}
      replace
    />
  );
}
