import { ChangeEvent, useState } from "react";
import {
  validateEmail,
  validateMobileNumber,
  validatePassword,
  validateConfirmPassword,
  validateName
} from '../utils/validator';

type FormData<T> = {
  [key in keyof T]: T[key];
};

type ValidateError<T> = {
  [key in keyof T]?: string;
};

export const useForm = <T extends Record<string, any>>(initialValue: T) => {
  const [formData, setFormData] = useState<FormData<T>>(initialValue);
  const [inputError, setInputError] = useState<ValidateError<T>>({});

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
     
    event.stopPropagation()
    const { name, value } = event.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));

    let validationResponse = checkInputValue(name, value, formData.password);
     
    if (!validationResponse.isValid) {

      setInputError((prevErrors) => ({
        ...prevErrors,
        [name]: validationResponse.message,
      }));

    } else {

      setInputError((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors[name as keyof T];
        return newErrors;
      });

    }
  };

  return {
    formData,
    handleChange,
    inputError,
    setInputError
  };
};

function checkInputValue(name: string, value: string, value2?: string) {

  let validationResponse;
  switch (name) {
    case "name":
      validationResponse = validateName(value);
      break;
    case "email":
      validationResponse = validateEmail(value);
      break;
    case "mobile_number":
      validationResponse = validateMobileNumber(value);
      break;
    case "password":
      validationResponse = validatePassword(value);
      break;
    case "confirm_password":
      validationResponse = validateConfirmPassword(value, value2 || '');
      console.log('confirmvalidation', validationResponse)
      break;
    default:
      validationResponse = { message: "", isValid: true };
      break;
  }
  return validationResponse;
}
