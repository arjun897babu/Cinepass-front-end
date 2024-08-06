  import { useState } from "react";

  type MultiValueFormData = {
    [key: string]: string[];
  };

 

  export const useMultiValueForm = <T extends MultiValueFormData> (initialValue: T) => {
    const [multiValueFormData, setMultiValueFormData] = useState<T>(initialValue);
    const [inputError, setInputError] = useState<Record<string,string>>({});

    const validateNewValue = (key: string, value: string):boolean => {
      // let validationResponse;
      // switch (key) {
      //   case "screenFormats":
      //     validationResponse = validateScreenFormat(value);
      //     break;
      //   case "languages":
      //     validationResponse = validateLanguage(value);
      //     break;
      //   case "genres":
      //     validationResponse = validateGenre(value);
      //     break;
      //   default:
      //     validationResponse = { message: "", isValid: true };
      //     break;
      // }

      // if (!validationResponse.isValid) {
      //   setInputError((prevErrors) => ({
      //     ...prevErrors,
      //     [key]: [...(prevErrors[key] || []), validationResponse.message],
      //   }));
      // } else {
      //   setInputError((prevErrors) => {
      //     const newErrors = { ...prevErrors };
      //     const index = newErrors[key]?.indexOf(validationResponse.message);
      //     if (index !== undefined && index > -1) {
      //       newErrors[key]?.splice(index, 1);
      //     }
      //     return { ...newErrors };
      //   });
      // }

      // return validationResponse.isValid;
      return true;
    };

    const handleAddValue = (key: string, value: string) => {
      if (validateNewValue(key, value)) {
        setMultiValueFormData((prevData) => ({
          ...prevData,
          [key]: prevData[key]?.includes(value) 
            ? prevData[key].filter((item) => item !== value) 
            : [...prevData[key], value],
        }));
      }
    };
    

    return {
      multiValueFormData,
      handleAddValue,
      inputError,
      setInputError,
      setMultiValueFormData,
    };
  };
