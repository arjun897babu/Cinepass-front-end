import React, { MouseEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../redux/store";
import { MovieFilter, MovieFilterEnum, Role } from "../../interface/Interface";
import { getAllMovies } from "../../redux/actions/userAction";
import useErrorHandler from "../../hooks/useErrorHandler";

interface AccordionProps {
  AccordionData: {
    filterItem: MovieFilterEnum
    data: string[]
  }
}





export const AccordionAllOpen: React.FC<AccordionProps> = ({ AccordionData }) => {
  const dispatch = useDispatch<AppDispatch>()
  const city = useSelector((state: RootState) => state.user.city);

  const [filterItem, setFilterItem] = useState<Partial<MovieFilter | null>>(null)

  const filterMovie = async (e: MouseEvent<HTMLDivElement>, filter: string, value: string) => {
    e.preventDefault();
    setFilterItem((prevFilter) => {
      return {
        ...prevFilter,
        [filter]: value
      };
    });
  }
  const resetFilterItem = async (e: MouseEvent<HTMLDivElement>, filter: string) => {
    e.preventDefault();

    setFilterItem((prevFilter) => {
      return {
        ...prevFilter,
        [filter]: null
      };
    });
  }

  const handleApiError = useErrorHandler(Role.users);


  useEffect(() => {
    const fetchData = async () => {
      try {
        if (filterItem && city) {
          await dispatch(getAllMovies({ city, filter: filterItem })).unwrap();

        }
      } catch (error) {
        handleApiError(error);
      }
    };

    fetchData();
  }, [filterItem])


  return (
    <>

      <div className="collapse bg-white collapse-arrow w-full ">
        <input type="radio" name="my-accordion-2" defaultChecked />
        <div className="collapse-title text-md rounded font-medium">{AccordionData?.filterItem}</div>
        <div className="collapse-content">
          <div onClick={(e) => resetFilterItem(e, AccordionData?.filterItem)} className={` cursor-pointer badge p-3 text-xs  tracking-wide m-0.5 capitalize ${filterItem && filterItem[AccordionData.filterItem] === null || !filterItem ? 'bg-sky-400' : 'bg-sky-200'}`}>all</div>
          {AccordionData?.data.map((item) => (
            <div onClick={(e) => filterMovie(e, AccordionData.filterItem, item)} key={item} className={` cursor-pointer badge p-3 text-xs  tracking-wide m-0.5 capitalize ${filterItem && filterItem[AccordionData.filterItem] === item ? 'bg-sky-400' : 'bg-sky-200'}`}>{item}</div>
          ))}
        </div>
      </div>

    </>
  );
}

