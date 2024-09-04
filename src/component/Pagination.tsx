import React, { memo, useCallback, useEffect } from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <=0) return null;

  const handleClick =  (page: number) => onPageChange(page); 

  return (
    <div className="join  ">
      {Array.from({ length: totalPages }, (_, index) => (

        <button
          key={index}
          className={`join-item btn-sm ${currentPage == (index + 1) ? ' bg-cyan-400' : 'bg-cyan-200'}  hover:bg-cyan-400 `}
          onClick={() => handleClick(index + 1)}
        >
          {index + 1}
        </button>
      ))}
    </div>
  );
};

export default memo(Pagination);
