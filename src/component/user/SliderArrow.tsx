import React from "react";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";

interface SliderArrowProps {
  direction: 'next' | 'prev';
  style?: React.CSSProperties;
  onClick?: () => void;
}

const SliderArrow: React.FC<SliderArrowProps> = ({ onClick, style, direction }) => {
  return (
    <div
      className={`glass rounded-full p-3 absolute z-1 top-1/2 -translate-y-1/2 cursor-pointer ${direction === 'next' ? 'right-0' : 'left-0'} `}
      style={{ ...style }}
      onClick={onClick}
    >
      {direction === 'next' ? (
        <MdChevronRight size={30} />
      ) : (
        <MdChevronLeft size={30} />
      )}
    </div>
  );
};

export { SliderArrow };
