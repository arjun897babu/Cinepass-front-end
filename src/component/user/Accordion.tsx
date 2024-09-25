import React, {  useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../redux/store";
import { MovieFilter, MovieFilterEnum, Role } from "../../interface/Interface";
import { getAllMovies } from "../../redux/actions/userAction";
import useErrorHandler from "../../hooks/useErrorHandler";
import { Genre, Language, MovieFormat } from "../../utils/validator";

interface AccordionProps {
  resetFilterItem: (filter: string) => void;
  filterMovie: (filter: string, value: string) => void;
  accordionData: {
    filterItem: MovieFilterEnum
    data: string[]
  },
  filterItem: Partial<MovieFilter> | null
}


const AccordionAllOpen: React.FC<AccordionProps> = ({ accordionData, filterMovie, resetFilterItem, filterItem }) => {


  return (
    <>

      <div className="collapse bg-white collapse-arrow w-full ">
        <input type="radio" name="my-accordion-2" defaultChecked />
        <div className="collapse-title text-md rounded font-medium capitalize">
          {accordionData?.filterItem}
        </div>
        <div className="collapse-content">
          <div
            onClick={() => resetFilterItem(accordionData?.filterItem)}
            className={
              `cursor-pointer badge p-3 text-xs  tracking-wide m-0.5 capitalize 
            ${filterItem && filterItem[accordionData.filterItem] === null || !filterItem ?
                'bg-sky-400'
                : 'bg-sky-200'}`
            }
          >
            all
          </div>
          {
            accordionData?.data.map((item) => (
              <div
                onClick={() => filterMovie(accordionData.filterItem, item)}
                key={item}
                className={
                  `cursor-pointer badge p-3 text-xs  tracking-wide m-0.5 capitalize 
                 ${filterItem && filterItem[accordionData.filterItem] === item ?
                    'bg-sky-400' : 'bg-sky-200'}`
                }
              >
                {item}
              </div>
            ))}
        </div>
      </div>

    </>
  );
}

const Accordion: React.FC<{ setFilter: (filterItem: Partial<MovieFilter> | null) => void }> = ({ setFilter }) => {

  const dispatch = useDispatch<AppDispatch>()
  const city = useSelector((state: RootState) => state.user.city);

  const [filterItem, setFilterItem] = useState<Partial<MovieFilter | null>>(null)

  const filterMovie = async (filter: string, value: string) => {
    setFilterItem((prevFilter) => {
      return {
        ...prevFilter,
        [filter]: value
      };
    });


  }

  const resetFilterItem = async (filter: string) => {
    setFilterItem((prevFilter) => {
      return {
        ...prevFilter,
        [filter]: null
      };
    });
  }

  const handleApiError = useErrorHandler(Role.users);

  useEffect(() => {
    setFilter(filterItem)
  }, [filterItem])

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
      <AccordionAllOpen
        accordionData={{ filterItem: MovieFilterEnum.LANGUAGE, data: Object.values(Language) }}
        filterMovie={filterMovie}
        resetFilterItem={resetFilterItem}
        filterItem={filterItem}
      />
      <AccordionAllOpen
        accordionData={{ filterItem: MovieFilterEnum.FORMAT, data: Object.values(MovieFormat) }}
        filterMovie={filterMovie}
        resetFilterItem={resetFilterItem}
        filterItem={filterItem}
      />
      <AccordionAllOpen
        accordionData={{ filterItem: MovieFilterEnum.GENRE, data: Object.values(Genre) }}
        filterMovie={filterMovie}
        resetFilterItem={resetFilterItem}
        filterItem={filterItem}
      />
    </>
  )
}

export default Accordion
