import { useState } from 'react';
import { Ellipsis } from 'lucide-react';
import { useAppSelector } from '../../../app/hooks';
import { currentUser } from '../../../slices/appSlice';
import { useQueryComments } from '../../../hooks/comment/useQueryComments';
import { useProcessComment } from '../../../hooks/comment/useProcessComment';
import { formatToJST } from '../../../utils/dateUtils';

export default function CommentList({ postId }) {
  const [openMenuId, setOpenMenuId] = useState(null);
  const { handleCommentDeleteSubmit } = useProcessComment(postId);
  const { data: commentsData, isLoading } = useQueryComments(postId);
  const username = useAppSelector(currentUser);

  if (isLoading) return <div>Loading...</div>;
  if (!commentsData) return <div>コメントがありません</div>;
  const handleMenuToggle = (commentId) => {
    if (openMenuId === commentId) {
      // 同じメニューをクリックした場合は閉じる
      setOpenMenuId(null);
    } else {
      // 違うメニューをクリックした場合は開く
      setOpenMenuId(commentId);
    }
  };

  return (
    <div className="space-y-4">
      {commentsData?.map((comment) => {
        const isCommentOwner = username === comment.username;

        return (
          <div key={comment.comment_id} className="bg-gray-100 p-3 sm:p-4 rounded relative">
            <p className="text-xs sm:text-sm text-gray-600">@{comment.username}</p>
            <p className="text-sm sm:text-base text-gray-800 mt-1">{comment.content}</p>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              {formatToJST(comment.created_at)}
            </p>

            {/* 作成者のみ削除可能 */}
            {isCommentOwner && (
              <button
                onClick={() => handleMenuToggle(comment.comment_id)}
                className="absolute top-2 sm:top-3 right-2 sm:right-3 cursor-pointer"
              >
                <Ellipsis className="w-4 h-4 text-gray-500" />
              </button>
            )}

            {openMenuId === comment.comment_id && isCommentOwner && (
              <div className="absolute right-0 mt-2 w-28 sm:w-32 bg-white border rounded shadow z-50 text-sm">
                <button
                  onClick={() => {
                    handleCommentDeleteSubmit(comment.comment_id);
                    setOpenMenuId(null);
                  }}
                  className="block w-full px-4 py-2 text-left hover:bg-gray-100 text-red-600"
                >
                  削除する
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
