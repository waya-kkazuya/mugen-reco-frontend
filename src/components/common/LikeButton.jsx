import { Heart } from 'lucide-react';

export function LikeButton({ handleLikeToggle, isLiked, likeCount, isLoading, size = 'md' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <div className="flex items-center space-x-1">
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleLikeToggle();
        }}
        disabled={isLoading}
        className={`transition-all duration-200 hover:scale-105 ${
          isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
        }`}
      >
        <Heart
          className={`${sizeClasses[size]} transition-colors duration-200 ${
            isLiked ? 'text-pink-500 fill-current' : 'text-gray-400 hover:text-pink-400'
          }`}
        />
      </button>

      {
        <span
          className={`text-sm transition-colors duration-200 ${
            isLiked ? 'text-pink-500 font-medium' : 'text-gray-500'
          }`}
        >
          {likeCount}
        </span>
      }
    </div>
  );
}
