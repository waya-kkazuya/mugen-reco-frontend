import { Link } from 'react-router-dom';
import { useProcessAuth } from '../../hooks/auth/useProcessAuth';
import {
  validateUsername,
  validatePassword,
  validateConfirmPassword,
} from '../../utils/validation';
import { useState, useMemo } from 'react';
import { debounce } from 'lodash';

export default function Register() {
  const { checkUsernameAvailability, handleRegisterSubmit } = useProcessAuth();
  // フォームの値を保存
  const [formData, setFormData] = useState({
    username: '', // ← ユーザー名の値
    password: '',
    confirmPassword: '',
  });

  // usernameのチェックの状態
  const [usernameCheckState, setUsernameCheckState] = useState({
    isChecking: false,
    isAvailable: null,
    checkMessage: '',
  });

  // リアルタイムエラー文章の内容の保存状態
  const [realtimeErrors, setRealtimeErrors] = useState({
    username: [], // ← ユーザー名のエラー配列
    password: [],
    confirmPassword: [],
  });

  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // UI層の責務: デバウンス処理（ユーザー入力制御）
  // ※無限ループの可能性に注意
  const debouncedUsernameCheck = useMemo(() => {
    return debounce(async (username) => {
      if (!username || username.length < 3) {
        // APIチェック結果をクリア
        setUsernameCheckState((prev) => ({
          ...prev,
          isChecking: false,
          isAvailable: null,
          checkMessage: '', // これでメッセージが表示されなくなる
        }));
        return;
      }

      // フロントエンドエラーがある場合もAPIチェックをスキップ
      const frontendErrors = validateUsername(username);
      if (frontendErrors.errors.length > 0) {
        setUsernameCheckState((prev) => ({
          ...prev,
          isChecking: false,
          isAvailable: null,
          checkMessage: '',
        }));
        return;
      }

      setUsernameCheckState((prev) => ({
        ...prev,
        isChecking: true,
        checkMessage: 'ユーザー名を確認中...',
      }));

      try {
        // useProcessAuthの関数を呼び出し
        const response = await checkUsernameAvailability(username);
        // console.log('response.data', response);

        if (response) {
          const isAvailable = response.isAvailable ?? null;
          // console.log('isAvailable', isAvailable);
          const message = response.message || 'チェック完了';
          // console.log('message', message);

          setUsernameCheckState((prev) => ({
            ...prev,
            isChecking: false,
            isAvailable: isAvailable,
            checkMessage: message,
          }));
        } else {
          // console.error('result is undefined or null');
          setUsernameCheckState((prev) => ({
            ...prev,
            isChecking: false,
            isAvailable: null,
            checkMessage: 'チェックに失敗しました',
          }));
        }

        // リアルタイムエラーにも反映、エラーメッセージはまた別に追加する必要あり
        if (response.isAvailable === false) {
          setRealtimeErrors((prev) => ({
            ...prev,
            username: [...prev.username, 'このユーザー名は既に使用されています'],
          }));
        } else if (response.isAvailable === true) {
          // 重複エラーを削除、エラー配列の中から
          setRealtimeErrors((prev) => ({
            ...prev,
            username: prev.username.filter((err) => !err.includes('既に使用されています')),
          }));
        }
      } catch (error) {
        setUsernameCheckState((prev) => ({
          ...prev,
          isChecking: false,
          isAvailable: null,
          checkMessage: 'チェックに失敗しました',
        }));
      }
    }, 800);
  }, [checkUsernameAvailability]);

  // ユーザー名のリアルタイムバリデーションの処理
  const handleUsernameChange = (e) => {
    let value = e.target.value;

    // 🔹 即座の文字制限
    value = value.replace(/[^a-zA-Z0-9_.-]/g, ''); // 半角英数字と_.-記号３種類
    value = value.toLowerCase(); // 小文字に変換
    if (value.length > 20) value = value.slice(0, 20); // 20文字で切り詰め

    // 🔹 状態更新
    setFormData((prev) => ({ ...prev, username: value }));

    // 🔹 リアルタイムバリデーション実行
    const validation = validateUsername(value);
    setRealtimeErrors((prev) => ({ ...prev, username: validation.errors }));

    // デバウンス付きリアルタイムチェック
    if (validation.errors.length === 0 && value.length >= 3) {
      debouncedUsernameCheck(value);
    }
  };

  // パスワードのリアルタイムバリデーション
  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;

    // 🔹 状態更新
    setFormData((prev) => ({ ...prev, password: newPassword }));

    // 🔹 リアルタイムバリデーション実行
    const validation = validatePassword(newPassword, formData.username);
    setRealtimeErrors((prev) => ({
      ...prev,
      password: validation.errors,
    }));

    // 🔹 パスワード確認も再チェック（パスワードが変更されたら確認も再チェック）
    if (formData.confirmPassword) {
      const confirmValidation = validateConfirmPassword(newPassword, formData.confirmPassword);
      setRealtimeErrors((prev) => ({
        ...prev,
        confirmPassword: confirmValidation.errors,
      }));
    }
  };

  // 🆕 パスワード確認のリアルタイムバリデーション
  const handleConfirmPasswordChange = (e) => {
    const newConfirmPassword = e.target.value;

    // 🔹 状態更新
    setFormData((prev) => ({ ...prev, confirmPassword: newConfirmPassword }));

    // 🔹 リアルタイムバリデーション実行
    const validation = validateConfirmPassword(formData.password, newConfirmPassword);
    setRealtimeErrors((prev) => ({
      ...prev,
      confirmPassword: validation.errors,
    }));
  };

  // 登録ボタンを押した時の処理
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(''); //入力し始めたら空にする
    setIsSubmitting(true);

    // 全てのバリデーションを実行
    const usernameValidation = validateUsername(formData.username);
    const passwordValidation = validatePassword(formData.password, formData.username);
    const confirmPasswordValidation = validateConfirmPassword(
      formData.password,
      formData.confirmPassword
    );

    // エラーがある場合は送信しない
    if (
      !usernameValidation.isValid ||
      !passwordValidation.isValid ||
      !confirmPasswordValidation.isValid
    ) {
      setRealtimeErrors((prev) => ({
        ...prev,
        username: usernameValidation.errors,
        password: passwordValidation.errors,
        confirmPassword: confirmPasswordValidation.errors,
      }));
      setIsSubmitting(false);
      return;
    }

    try {
      await handleRegisterSubmit(formData);
      // 成功時の処理は各 mutation の onSuccess で実行される
    } catch (error) {
      // console.error('Registration error:', error);

      // 最小限のエラーハンドリング
      if (error.type === 'USERNAME_UNAVAILABLE') {
        setSubmitError('このユーザー名は既に使用されています');
      } else if (error.response?.data?.detail === 'The CSRF token has expired.') {
        setSubmitError('セッションが期限切れです。ページを再読み込みしてください');
      } else {
        setSubmitError('登録に失敗しました。再試行してください');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      {/* アプリ名ロゴリンク */}
      <div className="text-center mb-6">
        <Link
          to="/home"
          className="inline-block px-6 py-2 bg-yellow-400 rounded-full text-2xl font-extrabold text-white hover:bg-yellow-500 transition"
        >
          無限レコ
        </Link>
      </div>

      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">ユーザー登録</h2>

      {/* 送信処理のエラー */}
      {submitError && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {submitError}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* ユーザー名フィールド */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">ユーザー名</label>
          <input
            type="text"
            value={formData.username}
            onChange={handleUsernameChange}
            className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring transition-colors ${
              realtimeErrors.username.length > 0
                ? 'border-red-300 focus:border-red-500' // エラー時は赤色
                : 'border-gray-300 focus:border-blue-500' // 正常時はグレー
            }`}
            placeholder="3-20文字、半角英数字のみ、記号は.-_のみ"
            maxLength={20}
            required
          />
        </div>
        {/* usernameエラーメッセージの表示 */}
        {realtimeErrors.username.length > 0 ? (
          // エラーがある場合: ❌マーク
          realtimeErrors.username.map((error, index) => (
            <p key={index} className="mt-1 text-sm text-red-600 flex items-center">
              <span className="mr-2">❌</span>
              {error}
            </p>
          ))
        ) : formData.username.length >= 3 &&
          !usernameCheckState.isChecking &&
          usernameCheckState.isAvailable === true ? (
          // エラーがない場合: ✅マーク
          <p className="mt-1 text-sm text-green-600 flex items-center">
            <span className="mr-2">✅</span>
            このユーザー名は利用可能です
          </p>
        ) : null}

        {/* パスワードフィールド */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">パスワード</label>
          <input
            type="password"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
            value={formData.password}
            onChange={handlePasswordChange}
            placeholder="8文字以上、大文字・小文字・数字・記号を含む"
            required
          />
        </div>
        {/* passwordエラーメッセージの表示 */}
        {realtimeErrors.password.map((error, index) => (
          <p key={index} className="mt-1 text-sm text-red-600">
            {error}
          </p>
        ))}

        {/* パスワード確認フィールド */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">パスワード（確認）</label>
          <input
            type="password"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
            value={formData.confirmPassword}
            onChange={handleConfirmPasswordChange}
            placeholder="もう一度入力"
            required
          />
        </div>
        {/* confirmPasswordエラーメッセージの表示 */}
        {realtimeErrors.confirmPassword.map((error, index) => (
          <p key={index} className="mt-1 text-sm text-red-600">
            {error}
          </p>
        ))}

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-2 rounded transition ${
            isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          } text-white`}
        >
          {isSubmitting ? '登録中...' : '登録'}
        </button>
      </form>

      {/* ログイン誘導リンク */}
      <p className="text-sm text-center text-gray-600 mt-4">
        すでにアカウントをお持ちの方は{' '}
        <Link to="/login" className="text-blue-600 hover:underline cursor-pointer">
          ログイン
        </Link>
      </p>
    </div>
  );
}
