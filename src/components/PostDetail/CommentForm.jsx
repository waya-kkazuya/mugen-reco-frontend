import { useState } from 'react';
import { useProcessComment } from '../../hooks/comment/useProcessComment';
import { validateCommentForm } from '../../utils/validation';

export default function CommentForm({ postId }) {
  const { handleCommentCreateSubmit } = useProcessComment(postId);
  const [formData, setFormData] = useState({
    comment: '',
  });

  // エラー状態管理
  const [realtimeErrors, setRealtimeErrors] = useState({
    comment: [],
  });

  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCommentChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, comment: value }));

    const errors = [];
    if (value.length > 200) {
      errors.push('コメントは200文字以下で入力してください');
    }

    setRealtimeErrors((prev) => ({
      ...prev,
      comment: errors,
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
    const validation = validateCommentForm(formData);

    // エラーがある場合は送信しない
    if (!validation.isValid) {
      setRealtimeErrors(validation.errors);
      setIsSubmitting(false);
      return;
    }

    try {
      await handleCommentCreateSubmit(formData);
      // 成功時は formData をリセット
      setFormData({ comment: '' });
      setRealtimeErrors({ comment: [] });
    } catch (error) {
      console.error('Comment creation error:', error);

      // エラーハンドリング
      if (error.response?.status === 422) {
        setSubmitError('入力内容に問題があります。確認してください');
      } else if (error.response?.data?.detail === 'The CSRF token has expired.') {
        setSubmitError('セッションが期限切れです。ページを再読み込みしてください');
      } else {
        setSubmitError('コメントの投稿に失敗しました。再試行してください');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mb-4 sm:mb-6">
      {/* 送信処理のエラー */}
      {submitError && (
        <div className="mb-3 sm:mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm sm:text-base">
          {submitError}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div>
          <textarea
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm sm:text-base"
            rows="3"
            placeholder="コメントを入力...（200文字以下）"
            value={formData.comment}
            onChange={handleCommentChange}
            disabled={isSubmitting}
            required
          />

          {/* コメントエラー表示 */}
          {realtimeErrors.comment.map((error, index) => (
            <p key={index} className="mt-1 text-xs sm:text-sm text-red-600 flex items-center">
              <span className="mr-2">❌</span>
              {error}
            </p>
          ))}
        </div>

        <div className="flex justify-end mt-3 sm:mt-4">
          <button
            type="submit"
            disabled={isSubmitting || formData.comment.trim().length === 0}
            className={`bg-blue-600 text-white px-4 py-2 rounded transition font-semibold ${
              isSubmitting || formData.comment.trim().length === 0
                ? 'bg-gray-400 cursor-not-allowed'
                : 'hover:bg-blue-700'
            }`}
          >
            {isSubmitting ? 'コメント投稿中...' : 'コメントを投稿'}
          </button>
        </div>
      </form>
    </div>
  );
}
