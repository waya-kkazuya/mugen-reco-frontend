import { useParams, Link } from 'react-router-dom';
import PostContent from '../../components/PostDetail/PostContent';
import CommentForm from '../../components/PostDetail/CommentForm';
import CommentList from '../../components/PostDetail/CommentList';
import { useQuerySinglePost } from '../../hooks/posts/useQuerySinglePost';
import NotFoundPage from '../../pages/NotFoundPage';
import { useAppSelector } from '../../app/hooks';
import { isAuthenticated } from '../../slices/appSlice';

export default function PostDetail() {
  const { postId } = useParams(); // ← URLの/posts/:postId から自動取得
  const isLoggedIn = useAppSelector(isAuthenticated);
  const {
    data: dataSinglePost,
    isLoading: isLoadingPost,
    error,
    isError,
  } = useQuerySinglePost(postId);

  if (isLoadingPost) return <p>Loading...</p>;

  // 404エラー（投稿が見つからない）
  if (isError && error?.response?.status === 404) {
    return <NotFoundPage />;
  }

  if (!dataSinglePost) return <p>投稿が見つかりませんでした。</p>;

  return (
    <div className="max-w-2xl mx-auto mt-6 sm:mt-10 px-4">
      <PostContent post={dataSinglePost} postId={postId} />

      <div className="mt-2">
        {/* ログインしている場合のみCommentFormを表示 */}
        {isLoggedIn && <CommentForm postId={postId} />}
        {/* ログインしていない場合のメッセージ（オプション） */}
        {!isLoggedIn && (
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gray-100 border border-gray-300 rounded text-center">
            <p className="text-sm sm:text-base text-gray-600">
              コメントを投稿するには
              <Link
                to="/login"
                state={{ from: `/posts/${postId}` }} // 戻り先を記録
                className="text-blue-600 hover:underline ml-1 font-medium"
              >
                ログイン
              </Link>
              が必要です。
            </p>
          </div>
        )}
      </div>

      <CommentList postId={postId} />
    </div>
  );
}
