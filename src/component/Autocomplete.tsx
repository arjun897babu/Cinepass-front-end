import { GeocoderAutocomplete } from "@geoapify/geocoder-autocomplete";
import React, { useRef, useState, useEffect, memo } from "react";
import "@geoapify/geocoder-autocomplete/styles/minimal.css";
import { setUserCity } from "../redux/reducers/userReducer";


interface AutocompleteProps {

  changeCity: (city: string) => void;
  value?: string,
  update?: boolean
}

 const Autocomplete: React.FC<AutocompleteProps> = ({ changeCity, value, update }) => {
                  
  const divref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (divref.current) {
  
      const autocomplete = new GeocoderAutocomplete(
        divref.current,
        '15e7d5a4da01482e9ca2fb15c627732e',
        {
          placeholder: "Enter a city",
          type: 'city',
          limit: 4,
          debounceDelay: 100,
          filter: { countrycode: ['in'] }
        }
      );  
 
      autocomplete.on('select', (location) => {
       
        const selectedCity = location.properties.county
        divref.current!.querySelector('input')!.value = selectedCity
        changeCity(selectedCity)
      });
  
    
      autocomplete.on('input', (input) => {
        console.log('input:', input);
      });
      if (divref.current && value) {
        divref.current!.querySelector('input')!.value = value;
  
      }
      return () => { 
        if (divref.current) {
          autocomplete.off('select'); 
          autocomplete.off('input'); 
          autocomplete.off('suggestions');
          
        }
      };
    }
 
  }, [  value  ]);

  return (

    <div className="relative flex w-full text-black minimal-dark.css " ref={divref} id="autocomplete-container"></div>

  );
};

export default memo(Autocomplete)