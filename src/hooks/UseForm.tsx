import { ChangeEvent, useState } from "react";
import {
  validateEmail,
  validateMobileNumber,
  validatePassword,
  validateConfirmPassword,
  validateName
} from '../utils/validator';
import { clearUserError } from "../redux/reducers/userReducer";
import { clearTheaterError } from "../redux/reducers/theatersReducer";
import { clearAdminError } from "../redux/reducers/adminReducer";

import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store";
import { useLoggedOwner } from "./useLoggedUser";

type FormData<T> = {
  [key in keyof T]: T[key];
};

type ValidateError<T> = {
  [key in keyof T]?: string;
};

export const useForm = <T extends Record<string, any>>(initialValue: T, owner: string) => {
  const [formData, setFormData] = useState<FormData<T>>(initialValue);
  const [inputError, setInputError] = useState<ValidateError<T>>({});
  const {error} = useLoggedOwner(owner)

  const dispatch = useDispatch<AppDispatch>();
  const clearError = getClearError(owner);



  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation()


    const { name, value } = event.target;
    console.log(name, value)
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));

    let validationResponse = checkInputValue(name, value, formData.password);
    console.log(validationResponse)
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

    if (error?.error === name) {
      if (clearError) {
        dispatch(clearError());
      }
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

function getClearError(owner: string) {

  switch (owner) {
    case 'user':
      return clearUserError
    case 'theater':
      return clearTheaterError
    case 'admin':
      return clearAdminError
  }

}