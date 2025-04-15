import { useState } from 'react';

interface StarRatingProps {
  value: number;
  onChange: (rating: number) => void;
}

const StarRating: React.FC<StarRatingProps> = ({ value, onChange }) => {
  const handleStarClick = (index: number) => {
    onChange(index);
  };

  return (
    <div className="flex space-x-1">
      {[...Array(5)].map((_, index) => {
        const starClass = index < value ? 'text-yellow-500' : 'text-gray-300';
        return (
          <svg
            key={index}
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            className={`cursor-pointer ${starClass}`}
            onClick={() => handleStarClick(index + 1)}
          >
            <path d="M12 .587l3.668 7.429 8.232 1.143-6 5.85 1.416 8.251-7.316-3.85-7.318 3.85 1.416-8.251-6-5.85 8.232-1.143L12 .587z" />
          </svg>
        );
      })}
    </div>
  );
};

export default StarRating;
