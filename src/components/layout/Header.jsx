import AccountMenu from './AccountMenu';
import { useNavigate, Link } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();
  return (
    <header className="bg-yellow-400 shadow-md py-2 sm:py-3">
      <div className="max-w-6xl mx-auto px-2 sm:px-4 flex items-center justify-between">
        {/* タイトルロゴ */}
        <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
          <Link to="/home">無限レコ</Link>
        </div>

        {/* 投稿ボタン & アカウント */}
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4 relative">
          <button
            onClick={() => navigate(`/posts/new`)}
            className="bg-blue-600 text-white px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-md hover:bg-blue-700 transition text-xs sm:text-sm md:text-base font-medium whitespace-nowrap"
          >
            投稿する
          </button>

          {/* アカウントメニュー */}
          <AccountMenu />
        </div>
      </div>
    </header>
  );
}
