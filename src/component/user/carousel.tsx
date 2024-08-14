import React, { MouseEvent, useState } from 'react';
import { BsChevronCompactLeft, BsChevronCompactRight } from 'react-icons/bs';
import { RxDotFilled } from 'react-icons/rx';
import { IMovie } from '../../interface/Interface';

const Carousel: React.FC<{ movie: IMovie[] }> = ({ movie }): JSX.Element => {

  const slides: string[] = movie.map((movie) => (movie.cover_photo as string))

  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = (e:MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    const newIndex = (currentIndex === 0) ? movie.length - 1 : currentIndex - 1;
    console.log('currentIndex : ', currentIndex, 'nexindex : ', newIndex)
    setCurrentIndex(newIndex);
  };
  
  const nextSlide = (e:MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    const newIndex = (currentIndex === movie.length-1) ? 0 : currentIndex + 1;
    console.log('currentIndex : ', currentIndex, 'nexindex : ', newIndex)
    setCurrentIndex(newIndex);
  };

  return (
    <div className='w-full mb-2 hidden sm:flex sm:justify-center relative group '>
      <div
        className='w-4/5 h-[200px]  bg-center bg-cover duration-500 '
      >
        <img src={slides[currentIndex]} alt="" className='w-full rounded-lg  h-full object-fill' />
      </div>
      {/* Left Arrow */}
      <div onClick={prevSlide} className=' group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] left-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer'>
        <BsChevronCompactLeft  size={20} />
      </div>
      {/* Right Arrow */}
      <div onClick={nextSlide} className=' group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] right-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer'>
        <BsChevronCompactRight  size={20} />
      </div>
    </div>

  );
}
export default Carousel