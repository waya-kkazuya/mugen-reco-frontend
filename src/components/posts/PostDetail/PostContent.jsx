import { useState } from 'react';
import { Ellipsis, Crown, Medal, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { categoryIconMap, defaultCategoryIcon } from '../../../constants/categoryIcons';
import { useAppSelector } from '../../../app/hooks';
import { currentUser } from '../../../slices/appSlice';
import { useProcessPost } from '../../../hooks/posts/useProcessPost';
import { LikeButton } from '../../common/LikeButton';
import { useProcessLike } from '../../../hooks/like/useProcessLike';

export default function PostDetail({ post, postId }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { handlePostDeleteSubmit } = useProcessPost(postId);
  const navigate = useNavigate();
  const username = useAppSelector(currentUser);
  const CategoryIcon = categoryIconMap[post?.category] || defaultCategoryIcon;
  const isOwner = username === post?.username;
  const { handleLikeToggle, isLoading } = useProcessLike(postId, undefined);
  const [deleteError, setDeleteError] = useState('');

  const handleDelete = async () => {
    setDeleteError('');

    try {
      await handlePostDeleteSubmit(postId);
      setIsMenuOpen(false);
    } catch (error) {
      console.error('Delete error:', error);

      if (error.response?.status === 403) {
        setDeleteError('削除する権限がありません');
      } else if (error.response?.status === 404) {
        setDeleteError('投稿が見つかりません');
      } else {
        setDeleteError('削除に失敗しました。再試行してください');
      }
    }
  };

  return (
    <div>
      {/* エラーメッセージ表示 */}
      {deleteError && (
        <div className="mb-2 p-2 sm:p-3 bg-red-100 border border-red-400 text-red-700 rounded text-xs sm:text-sm">
          {deleteError}
        </div>
      )}

      <div className="relative w-full bg-white border border-gray-200 rounded-xl shadow">
        {/* ヘッダー部分（アイコン + カテゴリ） */}
        <div className="bg-yellow-400 px-4 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4 text-center relative rounded-t-2xl">
          <div className="absolute -top-4 sm:-top-5 left-1/2 transform -translate-x-1/2 z-10">
            <div className="bg-blue-100 p-1.5 sm:p-2 rounded-full shadow hover:shadow-md transition">
              <CategoryIcon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            </div>
          </div>
          <span className="text-xs sm:text-sm font-semibold text-blue-900">{post.category}</span>
        </div>

        {/* 右上のメニュー */}
        {isOwner && (
          <div className="absolute top-3 sm:top-4 right-3 sm:right-4">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <Ellipsis className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 hover:text-blue-600" />
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-28 sm:w-32 bg-white border rounded shadow z-50 text-sm">
                <button
                  onClick={() => navigate(`/posts/${postId}/edit`)}
                  className="block w-full px-3 sm:px-4 py-2 text-left hover:bg-gray-100"
                >
                  編集する
                </button>
                <button
                  onClick={handleDelete}
                  className="block w-full px-3 sm:px-4 py-2 text-left hover:bg-gray-100 text-red-600"
                >
                  削除する
                </button>
              </div>
            )}
          </div>
        )}

        {/* メイン部分 */}
        <div className="mt-4 sm:mt-6 px-4 sm:px-6">
          {/* タイトル */}
          <h2 className="text-lg sm:text-xl md:text-2xl text-center font-bold text-gray-800 mt-1 leading-tight">
            {post.title}
          </h2>

          {/* 説明 */}
          <p className="mt-3 sm:mt-4 text-center text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base leading-relaxed">
            {post.description}
          </p>

          {/* おすすめベスト3 */}
          <ul className="space-y-2 sm:space-y-3 text-gray-700 mb-6 sm:mb-8 mx-2 sm:mx-4 lg:mx-20">
            <li className="flex items-start sm:items-center space-x-2 sm:space-x-3 pb-2 sm:pb-3">
              <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0 mt-1 sm:mt-0">
                <Crown className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
                <span className="text-sm sm:text-base lg:text-lg font-semibold text-yellow-600 whitespace-nowrap">
                  1位
                </span>
              </div>
              <span className="leading-relaxed text-sm sm:text-base lg:text-lg flex-1">
                {post.recommend1}
              </span>
            </li>
            <li className="flex items-start sm:items-center space-x-2 sm:space-x-3 pb-2 sm:pb-3">
              <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0 mt-1 sm:mt-0">
                <Medal className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                <span className="text-sm sm:text-base lg:text-lg font-semibold text-gray-500 whitespace-nowrap">
                  2位
                </span>
              </div>
              <span className="leading-relaxed text-sm sm:text-base lg:text-lg flex-1">
                {post.recommend2}
              </span>
            </li>
            <li className="flex items-start sm:items-center space-x-2 sm:space-x-3">
              <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0 mt-1 sm:mt-0">
                <Award className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
                <span className="text-sm sm:text-base lg:text-lg font-semibold text-orange-600 whitespace-nowrap">
                  3位
                </span>
              </div>
              <span className="leading-relaxed text-sm sm:text-base lg:text-lg flex-1">
                {post.recommend3}
              </span>
            </li>
          </ul>
        </div>

        {/* フッター部分 */}
        <div className="bg-gray-50 border-t border-gray-200 px-4 sm:px-6 py-3 sm:py-4 rounded-b-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 text-xs sm:text-sm text-gray-500">
              <span>Posted by @{post.username}</span>
              <span>{post.created_at}</span>
            </div>
            <div className="flex justify-end sm:justify-start">
              <LikeButton
                handleLikeToggle={handleLikeToggle}
                isLiked={post.is_liked}
                likeCount={post.like_count}
                isLoading={isLoading}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
