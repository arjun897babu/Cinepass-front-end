import emptyData_img_path from '/49e58d5922019b8ec4642a2e2b9291c2.png';

export const EmptyData: React.FC = (): JSX.Element => {
  return (

    <div className='lg:w-2/4  border-4 border-white' >   
      <img
        src={emptyData_img_path}
        alt="No data Found"
        className=" object-contain h-96"
      />
    </div>

  );
};
