import { Dispatch, FormEvent, SetStateAction } from "react";

interface Data {
  [key: string]: string;
}

export const useFormSubmit = (
  formData: Data,
  setInputError: Dispatch<SetStateAction<Data>>
) => {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const errors: Data = {};
    let isValid = true;

    // Validate each field in formData
    for (const field in formData) {
      if (!formData[field]) {
        errors[field] = `This field is required`;
        isValid = false;
      }
    }

    // Update inputError state with validation errors
    setInputError(errors);

    // Return validation result (isValid) if needed
    return isValid;
  };

  return {
    handleSubmit,
  };
};
