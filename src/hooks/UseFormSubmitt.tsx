import { ChangeEvent, Dispatch, FormEvent, SetStateAction } from "react";

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

    const errors: Data = {};
    let isValid = true;

   
    for (const field in formData) {
      if (!formData[field]) {
        errors[field] = `This field is required`;
        isValid = false;
      }
    }

    // inputError state with validation errors
    setInputError(errors);

   
    return isValid;
  };

  return {
    handleSubmit,
  };
};
