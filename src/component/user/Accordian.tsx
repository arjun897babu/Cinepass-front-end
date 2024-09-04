import React from "react";

interface AccordionProps {
  languages?: string[];
  formats?: string[];
  genres?: string[];
}


export const AccordionAllOpen: React.FC<AccordionProps> = ({ formats, genres, languages }) => {

  return (
    <>

      <div className="collapse bg-white collapse-arrow w-full ">
        <input type="radio" name="my-accordion-2" defaultChecked />
        <div className="collapse-title text-md rounded font-medium">Language</div>
        <div className="collapse-content">
          {languages?.map((language)=>(
            <p key={language} >{language}</p>
          ))}
        </div> 
      </div>
      <div className="collapse collapse-arrow w-full bg-white">
        <input type="radio" name="my-accordion-2" />
        <div className="collapse-title text-md rounded font-medium">Format</div>
        <div className="collapse-content">
        {formats?.map((format)=>(
            <p key={format} >{format}</p>
          ))}
        </div>
      </div>
      <div className="collapse  collapse-arrow w-full bg-white">
        <input type="radio" name="my-accordion-2" />
        <div className="collapse-title text-md rounded font-medium">Genre</div>
        <div className="collapse-content">
        {genres?.map((genre)=>(
            <p key={genre} >{genre}</p>
          ))}
        </div>
      </div>
    </>
  );
}

