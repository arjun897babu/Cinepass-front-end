import React from "react";




export function AccordionAllOpen() {


  return (
    <>

      <div className="collapse bg-white collapse-arrow w-full ">
        <input type="radio" name="my-accordion-2" defaultChecked  />
        <div className="collapse-title text-md rounded font-medium">Language</div>
        <div className="collapse-content">
          <p>hello</p>
        </div>
      </div>
      <div className="collapse collapse-arrow w-full bg-white">
        <input type="radio" name="my-accordion-2" />
        <div className="collapse-title text-md rounded font-medium">Format</div>
        <div className="collapse-content">
          <p>hello</p>
        </div>
      </div>
      <div className="collapse  collapse-arrow w-full bg-white">
        <input type="radio" name="my-accordion-2" />
        <div className="collapse-title text-md rounded font-medium">Genre</div>
        <div className="collapse-content">
          <p>hello</p>
        </div>
      </div>
    </>
  );
}

