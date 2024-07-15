import React, { useState } from 'react';
import { BsChevronCompactLeft, BsChevronCompactRight } from 'react-icons/bs';
import { RxDotFilled } from 'react-icons/rx';

export const Carousel: React.FC = (): JSX.Element => {
  const slides = [
    'https://assetscdn1.paytm.com/images/catalog/view_item/2699999/1719408000464.jpg?format=webp&imwidth=1750',
    'https://assetscdn1.paytm.com/images/catalog/view_item/2753828/1720788936964.jpg?format=webp&imwidth=1750',
    'https://assetscdn1.paytm.com/images/catalog/view_item/2699999/1719408000464.jpg?format=webp&imwidth=1750',
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const nextSlide = () => {
    const isLastSlide = currentIndex === slides.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const goToSlide = (slideIndex: number) => {
    setCurrentIndex(slideIndex);
  };
  console.log('slider rendering')
  return (
    <div className='w-full m-auto bg-gray-100 hidden sm:block p-4 relative group'>
      <div
        className='w-full h-full  bg-center bg-cover duration-500 '
      >
        <img src={slides[currentIndex]} alt="" className='w-full rounded-lg  h-full object-cover' />
      </div>
      {/* Left Arrow */}
      <div className='hidden group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] left-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer'>
        <BsChevronCompactLeft onClick={prevSlide} size={20}  />
      </div>
      {/* Right Arrow */}
      <div className='hidden group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] right-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer'>
        <BsChevronCompactRight onClick={nextSlide} size={20} />
      </div>
      <div className='absolute bottom-[10%] left-1/2 transform -translate-x-1/2 flex space-x-2'>
        {slides.map((slide, slideIndex) => (
          <div
            key={`${slideIndex}-${Date.now()}`}
            onClick={() => goToSlide(slideIndex)}
            className='text-2xl cursor-pointer'
          >
            <RxDotFilled size={30} className={currentIndex === slideIndex ? 'text-white' : 'text-gray-700'} />
          </div>
        ))}
      </div>
    </div>
  );
}
