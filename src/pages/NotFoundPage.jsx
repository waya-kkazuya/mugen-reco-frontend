import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900">404</h1>
        <p className="text-xl text-gray-600 mt-4">投稿が見つかりませんでした</p>
        <p className="text-gray-500 mt-2">
          この投稿は削除されたか、URLが間違っている可能性があります。
        </p>

        <div className="mt-6 space-x-4">
          <button
            onClick={() => navigate('/home')}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            投稿一覧に戻る
          </button>
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-200 text-gray-700 px-6 py-2 rounded hover:bg-gray-300"
          >
            前のページに戻る
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
