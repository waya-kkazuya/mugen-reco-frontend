import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProcessAuth } from '../../hooks/auth/useProcessAuth';
import { validateLoginInput } from '../../utils/validation';

export default function Login() {
  const { handleLoginSubmit } = useProcessAuth();
  // フォームの値を保存
  // フォームデータ
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  // 🔹 リアルタイムエラー: 入力時の形式チェック
  const [realtimeErrors, setRealtimeErrors] = useState({
    username: [],
    password: [],
  });

  // 送信時のエラー（APIエラーなど）
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUsernameChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, username: value }));

    // ✅ 送信エラーをクリア（ユーザーが入力を始めたら）入力する＝ここに到達する
    if (submitError) {
      setSubmitError('');
    }

    // リアルタイムバリデーション
    const errors = [];
    if (value.length > 50) {
      errors.push('ユーザー名が長すぎます');
    }

    setRealtimeErrors((prev) => ({
      ...prev,
      username: errors,
    }));
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, password: value }));

    // ✅ 送信エラーをクリア
    if (submitError) {
      setSubmitError('');
    }

    // リアルタイムバリデーション
    const errors = [];
    if (value.length > 100) {
      errors.push('パスワードが長すぎます');
    }

    setRealtimeErrors((prev) => ({
      ...prev,
      password: errors,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    setIsSubmitting(true);

    // ✅ 送信時に全バリデーションを実行
    const validation = validateLoginInput(formData.username, formData.password);

    if (!validation.isValid) {
      setRealtimeErrors(validation.errors);
      setIsSubmitting(false);
      return;
    }

    try {
      await handleLoginSubmit(formData);
      // 成功時の処理は useMutation の onSuccess で実行される
    } catch (error) {
      console.error('Login error:', error);

      // ✅ 必要最低限のエラーハンドリング
      if (error.response?.status === 401) {
        // 認証失敗
        setSubmitError('ユーザー名またはパスワードが間違っています');
      } else if (error.response?.data?.detail === 'The CSRF token has expired.') {
        // CSRFトークンエラー
        setSubmitError('セッションが期限切れです。ページを再読み込みしてください');
      } else {
        // その他すべてのエラー
        setSubmitError('ログインに失敗しました。再試行してください');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      {/* ロゴ */}
      <div className="text-center mb-6">
        <Link
          to="/home"
          className="inline-block px-6 py-2 bg-yellow-400 rounded-full text-2xl font-extrabold text-white hover:bg-yellow-500 transition"
        >
          無限レコ
        </Link>
      </div>

      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">ログイン</h2>

      {/* 送信処理のエラー */}
      {submitError && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {submitError}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">ユーザー名</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
            value={formData.username}
            onChange={handleUsernameChange}
            placeholder="ユーザー名を入力"
            required
          />
        </div>
        {/* ✅ リアルタイムエラー: フィールド直下に表示 */}
        {realtimeErrors.username.map((error, index) => (
          <p key={index} className="mt-1 text-sm text-red-600 flex items-center">
            <span className="mr-2">❌</span>
            {error}
          </p>
        ))}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">パスワード</label>
          <input
            type="password"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
            value={formData.password}
            onChange={handlePasswordChange}
            placeholder="パスワードを入力"
            required
          />
        </div>
        {/* ✅ リアルタイムエラー: フィールド直下に表示 */}
        {realtimeErrors.password.map((error, index) => (
          <p key={index} className="mt-1 text-sm text-red-600 flex items-center">
            <span className="mr-2">❌</span>
            {error}
          </p>
        ))}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          {isSubmitting ? 'ログイン中...' : 'ログイン'}
        </button>
      </form>

      {/* 登録誘導リンク */}
      <p className="text-sm text-center text-gray-600 mt-4">
        アカウントをお持ちでない方は{' '}
        <Link to="/register" className="text-blue-600 hover:underline cursor-pointer">
          新規登録
        </Link>
      </p>
    </div>
  );
}
