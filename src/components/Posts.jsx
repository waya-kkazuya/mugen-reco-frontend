import Card from './Card';
import { useQueryPosts } from '../hooks/posts/useQueryPosts';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import Masonry from 'react-masonry-css';
import { FileText, Loader2 } from 'lucide-react';

export default function Posts({ selectedCategory }) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useQueryPosts(selectedCategory);

  const { ref, inView } = useInView({
    threshold: 1.0,
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const breakpointColumnsObj = {
    default: 3, // デフォルト3列（PC）
    1024: 3, // 1024px以上で3列（PC）
    768: 2, // 768px以上で2列（タブレット）
    640: 1, // 640px以上で1列（スマホ）
  };

  if (isLoading)
    return (
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center">Loading...</div>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto px-2 sm:px-4">
      {!data ? (
        <p className="text-gray-500 text-center">Loading...</p>
      ) : data.pages.flatMap((page) => page.posts).length === 0 ? (
        <div className="text-center py-8 sm:py-12">
          <FileText className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">まだ投稿がありません</p>
        </div>
      ) : (
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="flex -ml-3 sm:-ml-6 w-auto"
          columnClassName="pl-3 sm:pl-6 bg-clip-padding"
        >
          {data.pages
            .flatMap((page) => page.posts)
            .map((post) => (
              <div key={post.post_id} className="mb-4 sm:mb-7">
                <Card post={post} selectedCategory={selectedCategory} />
              </div>
            ))}

          {/* ローディングインジケータ処理 */}
          {isFetchingNextPage && (
            <div className="col-span-full text-center py-4">
              <Loader2 className="w-5 h-5 text-gray-400 animate-spin mx-auto" />
            </div>
          )}

          {/* 無限スクロール用のトリガー要素 */}
          <div ref={ref} className="h-10 col-span-full" />
        </Masonry>
      )}
    </div>
  );
}
