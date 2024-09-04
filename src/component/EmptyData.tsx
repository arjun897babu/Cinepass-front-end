import emptyData_img_path from '/49e58d5922019b8ec4642a2e2b9291c2.png';

 const EmptyData: React.FC = (): JSX.Element => {
  return (

    <div className=' border-4 border-white' >   
      <img
        src={emptyData_img_path}
        alt="No data Found"
        className=" object-cover h-96"
      />
    </div>

  );
};
export default EmptyData