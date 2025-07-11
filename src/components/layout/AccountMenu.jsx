import { useState } from 'react';
import { CircleUser } from 'lucide-react';
import { useSelector } from 'react-redux';
import { isAuthenticated } from '../../slices/appSlice';
import { useProcessAuth } from '../../hooks/auth/useProcessAuth';
import { useNavigate } from 'react-router-dom';

// 状態を持つ単位にコンポーネントを分割
export default function AccountMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const auth = useSelector(isAuthenticated);
  const navigate = useNavigate();
  const { logout } = useProcessAuth();
  return (
    // 778pxタブレット以上はマウスホバーを有効にする
    <div
      className="relative"
      onMouseEnter={() => window.innerWidth >= 768 && setIsMenuOpen(true)}
      onMouseLeave={() => window.innerWidth >= 768 && setIsMenuOpen(false)}
    >
      {/* スマホ・タブレット用にボタンクリック */}
      <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
        <CircleUser className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-blue-600 hover:text-blue-700 transition" />
      </button>
      {isMenuOpen && (
        <div className="absolute right-0 mt-1 sm:mt-0 bg-white border border-gray-200 rounded shadow-md w-36 sm:w-40 md:w-44 z-50 text-sm sm:text-base">
          {auth ? (
            <>
              <button
                onClick={() => navigate('/profile')}
                className="block w-full text-left px-3 sm:px-4 py-2 sm:py-2.5 hover:bg-gray-100 cursor-pointer text-sm sm:text-base transition-colors"
              >
                マイページ
              </button>
              <button
                onClick={logout}
                className="block w-full text-left px-3 sm:px-4 py-2 sm:py-2.5 hover:bg-gray-100 cursor-pointer text-sm sm:text-base transition-colors"
              >
                ログアウト
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate('/login')}
                className="block w-full text-left px-3 sm:px-4 py-2 sm:py-2.5 hover:bg-gray-100 cursor-pointer text-sm sm:text-base transition-colors"
              >
                ログイン
              </button>
              <button
                onClick={() => navigate('register')}
                className="block w-full text-left px-3 sm:px-4 py-2 sm:py-2.5 hover:bg-gray-100 cursor-pointer text-sm sm:text-base transition-colors"
              >
                新規登録
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
