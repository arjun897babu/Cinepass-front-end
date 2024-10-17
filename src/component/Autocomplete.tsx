import { GeocoderAutocomplete } from "@geoapify/geocoder-autocomplete";
import React, { useRef, useEffect, memo } from "react";
import "@geoapify/geocoder-autocomplete/styles/minimal.css";
const { VITE_GEOAPIFY_API_KEY } = import.meta.env


interface AutocompleteProps {

  changeCity: (city: string) => void;
  value?: string,
  update?: boolean
}

 const Autocomplete: React.FC<AutocompleteProps> = ({ changeCity, value, update }) => {
                    console.log(update)
  const divRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (divRef.current) {
  
      const autocomplete = new GeocoderAutocomplete(
        divRef.current,
        VITE_GEOAPIFY_API_KEY,
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
        divRef.current!.querySelector('input')!.value = selectedCity
        changeCity(selectedCity)
      });
  
    
      autocomplete.on('input', (input) => {
        console.log('input:', input);
      });
      if (divRef.current && value) {
        divRef.current!.querySelector('input')!.value = value;
  
      }
      return () => { 
        if (divRef.current) {
          autocomplete.off('select'); 
          autocomplete.off('input'); 
          autocomplete.off('suggestions');
          
        }
      };
    }
 
  }, [  value  ]);

  return (

    <div className="relative flex w-full text-black minimal-dark.css " ref={divRef} id="autocomplete-container"></div>

  );
};

export default memo(Autocomplete)