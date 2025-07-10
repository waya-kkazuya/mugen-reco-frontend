import { useNavigate } from 'react-router-dom';
import { categoryIconMap, defaultCategoryIcon } from '../constants/categoryIcons';
import { Crown, Medal, Award } from 'lucide-react';
import { useProcessLike } from '../hooks/like/useProcessLike';
import { LikeButton } from './LikeButton';

export default function Card({ post, selectedCategory }) {
  const {
    post_id,
    category,
    title,
    description,
    recommend1,
    recommend2,
    recommend3,
    username,
    like_count,
    is_liked,
    created_at,
  } = post;
  const CategoryIcon = categoryIconMap[category] || defaultCategoryIcon;
  const navigate = useNavigate();
  const { handleLikeToggle, isLoading } = useProcessLike(post_id, selectedCategory);

  return (
    <div
      onClick={() => navigate(`/posts/${post_id}`)}
      className="w-full border border-gray-200 rounded-2xl shadow hover:shadow-md transition"
    >
      {/* ヘッダー部分（アイコン + カテゴリ） */}
      <div className="bg-yellow-400 px-6 pt-6 pb-4 text-center relative rounded-t-2xl">
        <div className="absolute -top-5 left-1/2 transform -translate-x-1/2">
          <div className="bg-blue-100 p-2 rounded-full shadow hover:shadow-md transition">
            <CategoryIcon className="w-6 h-6 text-blue-600" />
          </div>
        </div>
        <span className="text-sm font-semibold text-blue-900">{category}</span>
      </div>

      {/* メイン部分 */}
      <div className="bg-white p-6">
        {/* タイトル */}
        <h2 className="text-xl text-center font-semibold text-gray-800 mb-4">{title}</h2>

        {/* 説明 */}
        <p className="text-center text-gray-600 mb-4">{description}</p>

        {/* おすすめベスト3 */}
        <ul className="space-y-3 text-gray-700 mb-4">
          <li className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 flex-shrink-0">
              <Crown className="w-5 h-5 text-yellow-500" />
              <span className="text-sm font-semibold text-yellow-600">1位</span>
            </div>
            <span className="leading-relaxed">{recommend1}</span>
          </li>
          <li className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 flex-shrink-0">
              <Medal className="w-5 h-5 text-gray-400" />
              <span className="text-sm font-semibold text-gray-500">2位</span>
            </div>
            <span className="leading-relaxed">{recommend2}</span>
          </li>
          <li className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 flex-shrink-0">
              <Award className="w-5 h-5 text-orange-600" />
              <span className="text-sm font-semibold text-orange-600">3位</span>
            </div>
            <span className="leading-relaxed">{recommend3}</span>
          </li>
        </ul>
      </div>

      {/* フッター部分 */}
      <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 rounded-b-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-500">Posted by @{username}</span>
            <span className="text-sm text-gray-500">{created_at}</span>
          </div>
          <LikeButton
            handleLikeToggle={handleLikeToggle}
            isLiked={is_liked}
            likeCount={like_count}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
