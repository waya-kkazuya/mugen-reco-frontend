import { Routes, Route } from 'react-router-dom';
import Home from '../pages/posts/Home';
import PostCreate from '../pages/posts/PostCreate';
import PostDetail from '../pages/posts/PostDetail';
import PostEdit from '../pages/posts/PostEdit';
import Login from '../pages/users/Login';
import Register from '../pages/users/Register';
import Layout from '../components/layout/Layout';
import Profile from '../pages/users/Profile';
import ProtectedRoute from './ProtectedRoute';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/home" element={<Home />} />
        <Route
          path="/posts/new"
          element={
            <ProtectedRoute>
              <PostCreate />
            </ProtectedRoute>
          }
        />
        <Route path="/posts/:postId" element={<PostDetail />} />
        <Route
          path="/posts/:postId/edit"
          element={
            <ProtectedRoute>
              <PostEdit />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}
