import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Crown, Medal, Award } from 'lucide-react';
import { useQuerySinglePost } from '../../hooks/posts/useQuerySinglePost';
import { useProcessPost } from '../../hooks/posts/useProcessPost';
import { useQueryCategories } from '../../hooks/category/useQueryCategories';
import { validatePostForm } from '../../utils/validation';

export default function PostEdit() {
  const { postId } = useParams();
  const { data: categories, isLoading: categoryIsLoading } = useQueryCategories();
  const { data: post, isLoading: singlePostIsLoading } = useQuerySinglePost(postId);
  const { handlePostUpdateSubmit } = useProcessPost(postId);

  const [formData, setFormData] = useState({
    selectedCategory: '',
    title: '',
    description: '',
    recommend1: '',
    recommend2: '',
    recommend3: '',
  });
  const [realtimeErrors, setRealtimeErrors] = useState({
    category: [],
    title: [],
    description: [],
    recommend1: [],
    recommend2: [],
    recommend3: [],
  });
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 投稿データが取得できたらフォームに反映
  useEffect(() => {
    if (post) {
      setFormData({
        selectedCategory: post.category,
        title: post.title,
        description: post.description || '',
        recommend1: post.recommend1,
        recommend2: post.recommend2,
        recommend3: post.recommend3,
      });
    }
  }, [post]);

  // リアルタイムバリデーション
  const handleCategoryChange = (categoryId) => {
    setFormData((prev) => ({
      ...prev,
      selectedCategory: categoryId,
    }));

    setRealtimeErrors((prev) => ({
      ...prev,
      category: [],
    }));

    if (submitError) {
      setSubmitError('');
    }
  };

  const handleTitleChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, title: value }));

    const errors = [];
    if (value.length > 50) {
      errors.push('タイトルは50文字以下で入力してください');
    }

    setRealtimeErrors((prev) => ({
      ...prev,
      title: errors,
    }));

    if (submitError) {
      setSubmitError('');
    }
  };

  const handleDescriptionChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, description: value }));

    const errors = [];
    if (value.trim() && value.length > 300) {
      errors.push('説明は300文字以下で入力してください');
    }

    setRealtimeErrors((prev) => ({
      ...prev,
      description: errors,
    }));

    if (submitError) {
      setSubmitError('');
    }
  };

  const handleRecommend1Change = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, recommend1: value }));

    const errors = [];
    if (value.length > 50) {
      errors.push('おすすめは50文字以下で入力してください');
    }

    setRealtimeErrors((prev) => ({
      ...prev,
      recommend1: errors,
    }));

    if (submitError) {
      setSubmitError('');
    }
  };

  const handleRecommend2Change = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, recommend2: value }));

    const errors = [];
    if (value.length > 50) {
      errors.push('おすすめは50文字以下で入力してください');
    }

    setRealtimeErrors((prev) => ({
      ...prev,
      recommend2: errors,
    }));

    if (submitError) {
      setSubmitError('');
    }
  };

  const handleRecommend3Change = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, recommend3: value }));

    const errors = [];
    if (value.length > 50) {
      errors.push('おすすめは50文字以下で入力してください');
    }

    setRealtimeErrors((prev) => ({
      ...prev,
      recommend3: errors,
    }));

    if (submitError) {
      setSubmitError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    setIsSubmitting(true);

    // バリデーション実行
    const validation = validatePostForm(formData);

    if (!validation.isValid) {
      setRealtimeErrors(validation.errors);
      setIsSubmitting(false);
      return;
    }

    try {
      await handlePostUpdateSubmit(formData);
      // 成功時の処理は useProcessPost の mutation で実行される
    } catch (error) {
      console.error('Post update error:', error);

      // エラーハンドリング
      if (error.response?.status === 422) {
        setSubmitError('入力内容に問題があります。確認してください');
      } else if (error.response?.data?.detail === 'The CSRF token has expired.') {
        setSubmitError('セッションが期限切れです。ページを再読み込みしてください');
      } else {
        setSubmitError('投稿の更新に失敗しました。再試行してください');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (singlePostIsLoading || categoryIsLoading)
    return (
      <div className="max-w-2xl mx-auto mt-6 sm:mt-10 px-4">
        <p>Loading...</p>
      </div>
    );

  return (
    <div className="max-w-2xl mx-auto mt-6 sm:mt-10 bg-white p-4 sm:p-6 rounded-lg shadow">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">投稿編集</h2>

      {/* ✅ 送信エラーメッセージの表示 */}
      {submitError && (
        <div className="mb-3 sm:mb-4 p-2 sm:p-3 bg-red-100 border border-red-400 text-red-700 rounded flex items-center text-sm sm:text-base">
          <span className="mr-2">❌</span>
          {submitError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
        {/* カテゴリ選択 */}
        <div>
          <label className="block mb-1 sm:mb-2 font-medium text-gray-700 text-sm sm:text-base">
            カテゴリ
          </label>
          <div className="flex flex-wrap gap-1 sm:gap-2">
            {categories?.map((category) => (
              <button
                key={category.id}
                type="button"
                className={`px-2 sm:px-3 py-1 rounded-full border text-sm sm:text-base ${
                  formData.selectedCategory === category.id
                    ? 'bg-gray-800 text-white'
                    : 'bg-gray-100 text-gray-800 hover:bg-blue-100'
                }`}
                onClick={() => handleCategoryChange(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* ✅ カテゴリエラー表示 */}
          {realtimeErrors.category.map((error, index) => (
            <p key={index} className="mt-1 text-xs sm:text-sm text-red-600 flex items-center">
              <span className="mr-2">❌</span>
              {error}
            </p>
          ))}
        </div>

        {/* タイトル */}
        <div>
          <label className="block mb-1 font-medium text-gray-700 text-sm sm:text-base">
            タイトル
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={handleTitleChange}
            className={`w-full px-2 sm:px-3 py-2 border rounded focus:outline-none focus:ring transition-colors text-sm sm:text-base ${
              realtimeErrors.title.length > 0
                ? 'border-red-300 focus:border-red-500'
                : 'border-gray-300 focus:border-blue-200'
            }`}
            placeholder="投稿タイトルを入力（50文字以下）"
            disabled={isSubmitting}
            required
          />

          {/* ✅ タイトルエラー表示 */}
          {realtimeErrors.title.map((error, index) => (
            <p key={index} className="mt-1 text-xs sm:text-sm text-red-600 flex items-center">
              <span className="mr-2">❌</span>
              {error}
            </p>
          ))}
        </div>

        {/* 概要 */}
        <div>
          <label className="block mb-1 font-medium text-gray-700 text-sm sm:text-base">
            概要・説明
          </label>
          <textarea
            value={formData.description}
            onChange={handleDescriptionChange}
            className={`w-full px-2 sm:px-3 py-2 border rounded focus:outline-none focus:ring transition-colors text-sm sm:text-base ${
              realtimeErrors.description.length > 0
                ? 'border-red-300 focus:border-red-500'
                : 'border-gray-300 focus:border-blue-200'
            }`}
            rows="4"
            placeholder="投稿の概要を記入（300文字以下、任意）"
            disabled={isSubmitting}
          />

          {/* ✅ 概要エラー表示 */}
          {realtimeErrors.description.map((error, index) => (
            <p key={index} className="mt-1 text-xs sm:text-sm text-red-600 flex items-center">
              <span className="mr-2">❌</span>
              {error}
            </p>
          ))}
        </div>

        {/* おすすめ */}
        <div>
          <label className="flex items-center space-x-1 sm:space-x-2 mb-1 font-medium text-gray-700 text-sm sm:text-base">
            <Crown className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
            <span>1位のおすすめ</span>
          </label>
          <input
            type="text"
            value={formData.recommend1}
            onChange={handleRecommend1Change}
            className={`w-full px-2 sm:px-3 py-2 border rounded focus:outline-none focus:ring transition-colors text-sm sm:text-base ${
              realtimeErrors.recommend1.length > 0
                ? 'border-red-300 focus:border-red-500'
                : 'border-gray-300 focus:border-blue-200'
            }`}
            placeholder="1番のおすすめ（50文字以下）"
            disabled={isSubmitting}
            required
          />

          {/* ✅ おすすめ1エラー表示 */}
          {realtimeErrors.recommend1.map((error, index) => (
            <p key={index} className="mt-1 text-xs sm:text-sm text-red-600 flex items-center">
              <span className="mr-2">❌</span>
              {error}
            </p>
          ))}
        </div>
        <div>
          <label className="flex items-center space-x-1 sm:space-x-2 mb-1 font-medium text-gray-700 text-sm sm:text-base">
            <Medal className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
            <span>2位のおすすめ</span>
          </label>
          <input
            type="text"
            value={formData.recommend2}
            onChange={handleRecommend2Change}
            className={`w-full px-2 sm:px-3 py-2 border rounded focus:outline-none focus:ring transition-colors text-sm sm:text-base ${
              realtimeErrors.recommend2.length > 0
                ? 'border-red-300 focus:border-red-500'
                : 'border-gray-300 focus:border-blue-200'
            }`}
            placeholder="2番目のおすすめ（50文字以下）"
            disabled={isSubmitting}
            required
          />

          {/* ✅ おすすめ2エラー表示 */}
          {realtimeErrors.recommend2.map((error, index) => (
            <p key={index} className="mt-1 text-xs sm:text-sm text-red-600 flex items-center">
              <span className="mr-2">❌</span>
              {error}
            </p>
          ))}
        </div>
        <div>
          <label className="flex items-center space-x-1 sm:space-x-2 mb-1 font-medium text-gray-700 text-sm sm:text-base">
            <Award className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
            <span>3位のおすすめ</span>
          </label>
          <input
            type="text"
            value={formData.recommend3}
            onChange={handleRecommend3Change}
            className={`w-full px-2 sm:px-3 py-2 border rounded focus:outline-none focus:ring transition-colors text-sm sm:text-base ${
              realtimeErrors.recommend3.length > 0
                ? 'border-red-300 focus:border-red-500'
                : 'border-gray-300 focus:border-blue-200'
            }`}
            placeholder="3番目のおすすめ（50文字以下）"
            disabled={isSubmitting}
            required
          />

          {/* ✅ おすすめ3エラー表示 */}
          {realtimeErrors.recommend3.map((error, index) => (
            <p key={index} className="mt-1 text-xs sm:text-sm text-red-600 flex items-center">
              <span className="mr-2">❌</span>
              {error}
            </p>
          ))}
        </div>

        {/* 投稿ボタン */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-2 sm:py-3 rounded transition font-semibold text-sm sm:text-base ${
            isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-400 hover:bg-blue-500'
          } text-white`}
        >
          {isSubmitting ? '更新中...' : '投稿を更新'}
        </button>
      </form>
    </div>
  );
}
