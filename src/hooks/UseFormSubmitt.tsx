import { Dispatch, FormEvent, SetStateAction } from "react";
import { checkInputValue } from "./UseForm";


interface Data {
  [key: string]: string;
}

export const useFormSubmit = (
  formData: Data,
  setInputError: Dispatch<SetStateAction<Data>>
) => {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    let isValid = true;


    for (const field in formData) {
      let validationResponse = checkInputValue(field, formData[field], formData.password);
      if (!validationResponse.isValid) {
        setInputError((prevErrors) => ({
          ...prevErrors,
          [field]: validationResponse.message,
        }));
        isValid = false
      } else {
        setInputError((prevErrors) => {
          const newErrors = { ...prevErrors };
          delete newErrors[field];
          return newErrors;
        });
  
      }
    }

    return isValid;
  };



  return {
    handleSubmit,

  };
};
