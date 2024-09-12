import React, { MouseEvent, useState } from 'react';
import { BsChevronCompactLeft, BsChevronCompactRight } from 'react-icons/bs';


const Carousel: React.FC<{ moviePoster: string[] }> = ({ moviePoster }): JSX.Element => {

  const slides: string[] = moviePoster

  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    const newIndex = (currentIndex === 0) ? moviePoster.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const nextSlide = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    const newIndex = (currentIndex === moviePoster.length - 1) ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  return (
    <div className='w-full mb-2 hidden sm:flex sm:justify-center relative group '>
      <div
        className='w-11/12 h-[300px]  bg-center bg-cover duration-500 '
      >
        <img src={slides[currentIndex]} alt="" className='w-full rounded-lg  h-full object-fill' />
      </div>
      {/* Left Arrow */}
      {moviePoster.length > 1 &&
        <>
          <div onClick={prevSlide} className={` group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] left-2 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer`} >
            <BsChevronCompactLeft size={20} />
          </div>
          {/* Right Arrow */}
          <div onClick={nextSlide} className={`group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] right-2 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer`}>
            <BsChevronCompactRight size={20} />
          </div>
        </>
      }
    </div>

  );
}
export default Carousel