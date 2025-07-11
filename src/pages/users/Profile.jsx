import React, { useState, useEffect } from 'react';
import { User, Heart, FileText, ThumbsUp, Loader2 } from 'lucide-react';
import Card from '../../components/common/Card';
import { useAppSelector } from '../../app/hooks';
import { currentUser } from '../../slices/appSlice';
import { useQueryUserPosts } from '../../hooks/user/useQueryUserPosts';
import { useQueryUserLikedPosts } from '../../hooks/user/useQueryUserLikedPosts';
import { useInView } from 'react-intersection-observer';
import Masonry from 'react-masonry-css';

const EmptyState = ({ icon: Icon, message }) => (
  <div className="text-center py-8 sm:py-12">
    <Icon className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-4" />
    <p className="text-gray-500">{message}</p>
  </div>
);

const Profile = () => {
  const [activeTab, setActiveTab] = useState('my-posts');
  const username = useAppSelector(currentUser);

  const {
    data: userPostsData,
    isLoading: isLoadingUserPosts,
    fetchNextPage: fetchNextUserPosts,
    hasNextPage: hasNextUserPage,
    isFetching: isFetchingUserPosts,
  } = useQueryUserPosts(username);

  const {
    data: likedPostsData,
    isLoading: isLoadingLikedPosts,
    fetchNextPage: fetchNextLikedPosts,
    hasNextPage: hasNextLikedPage,
    isFetching: isFetchingLikedPosts,
  } = useQueryUserLikedPosts(username);

  // データの平坦化（無限スクロール対応）
  const userPosts = userPostsData?.pages?.flatMap((page) => page.posts) || [];
  const likedPosts = likedPostsData?.pages?.flatMap((page) => page.posts) || [];

  // 現在のタブに応じた投稿とローディング状態を決定
  const getCurrentTabData = () => {
    switch (activeTab) {
      case 'my-posts':
        return {
          posts: userPosts,
          isLoading: isLoadingUserPosts,
          fetchNextPage: fetchNextUserPosts,
          hasNextPage: hasNextUserPage,
          isFetching: isFetchingUserPosts,
        };
      case 'liked-posts':
        return {
          posts: likedPosts,
          isLoading: isLoadingLikedPosts,
          fetchNextPage: fetchNextLikedPosts,
          hasNextPage: hasNextLikedPage,
          isFetching: isFetchingLikedPosts,
        };
      default:
        return {
          posts: [],
          isLoading: false,
          fetchNextPage: () => {},
          hasNextPage: false,
          isFetching: false,
        };
    }
  };

  const currentTabData = getCurrentTabData();

  const tabs = [
    {
      id: 'my-posts',
      label: '自分の投稿',
      icon: FileText,
      count: userPosts.length,
      hasData: userPosts.length > 0,
    },
    {
      id: 'liked-posts',
      label: 'いいねした投稿',
      icon: ThumbsUp,
      count: likedPosts.length,
      hasData: likedPosts.length > 0,
    },
  ];

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  // Intersection Observer を使用した無限スクロール
  const { ref: inViewRef, inView } = useInView({
    threshold: 0,
    rootMargin: '1000px', // 1000px 手前で発火
  });

  // 画面に入ったら次のページを取得
  useEffect(() => {
    if (inView && currentTabData.hasNextPage && !currentTabData.isFetching) {
      currentTabData.fetchNextPage();
    }
  }, [inView, currentTabData.hasNextPage, currentTabData.isFetching, currentTabData.fetchNextPage]);

  const breakpointColumnsObj = {
    default: 3, // デフォルト3列（PC）
    1024: 3, // 1024px以上で3列（PC）
    768: 2, // 768px以上で2列（タブレット）
    640: 1, // 640px以上で1列（スマホ）
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4">
        {/* ユーザー情報ヘッダー + タブナビゲーション（同じグループ） */}
        <div className="bg-white rounded-lg shadow-md mb-8">
          {/* ユーザー情報ヘッダー */}
          <div className="p-8 border-b border-gray-200">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{username}</h1>
                <div className="flex items-center mt-2 space-x-4 text-sm text-gray-500">
                  <span>投稿数: {userPosts.length}</span>
                  <span>いいね数: {likedPosts.length}</span>
                  <span>参加日: 2024年1月</span>
                </div>
              </div>
            </div>
          </div>

          {/* タブナビゲーション */}
          <div className="border-b border-gray-200">
            <nav className="flex justify-center">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`group relative flex items-center space-x-2 py-4 px-4 border-b-2 font-medium text-sm transition-all duration-200 ${
                      isActive
                        ? 'border-blue-500 text-blue-600 bg-blue-50/50'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 transition-colors ${
                        isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'
                      }`}
                    />

                    <span className="font-medium">{tab.label}</span>

                    {/* カウントバッジ */}
                    <span
                      className={`px-2 py-1 text-xs rounded-full font-medium transition-colors ${
                        isActive
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
                      }`}
                    >
                      {tab.count}
                    </span>

                    {/* アクティブインジケーター */}
                    {isActive && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-full" />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* 投稿表示エリア（Home画面と全く同じスタイル） */}
        <div className="max-w-6xl mx-auto px-2 sm:px-4">
          {currentTabData.isLoading ? (
            <div className="text-center py-8 sm:py-12">
              <p className="text-gray-500">Loading...</p>
            </div>
          ) : currentTabData.posts.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              {activeTab === 'my-posts' ? (
                <EmptyState icon={FileText} message="まだ投稿がありません" />
              ) : (
                <EmptyState icon={Heart} message="いいねした投稿がありません" />
              )}
            </div>
          ) : (
            <Masonry
              breakpointCols={breakpointColumnsObj}
              className="flex -ml-3 sm:-ml-6 w-auto"
              columnClassName="pl-3 sm:pl-6 bg-clip-padding"
            >
              {currentTabData.posts.map((post) => (
                <div key={post.post_id} className="mb-4 sm:mb-7">
                  <Card post={post} selectedCategory={undefined} />
                </div>
              ))}

              {/* ローディングインジケーター */}
              {currentTabData.isFetching && !currentTabData.isLoading && (
                <div className="col-span-full text-center py-4">
                  <Loader2 className="w-5 h-5 text-gray-400 animate-spin mx-auto" />
                </div>
              )}

              {/* 無限スクロール用のトリガー要素 */}
              <div ref={inViewRef} className="h-10 col-span-full" />
            </Masonry>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
