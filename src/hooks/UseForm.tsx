import { theaterClearError } from '../redux/reducers/theatersReducer'
import { userClearError } from '../redux/reducers/userReducer'
import { adminClearError } from '../redux/reducers/adminReducer'
import { ChangeEvent, useState } from "react";
import {
  validateEmail,
  validateMobileNumber,
  validatePassword,
  validateConfirmPassword,
  validateName,
  validateAdhaar,
  validateTheaterName,
  validateAddress,
  validateCity,
  validateTheaterLicense,
  validateScreenName,
  validateRow,
  validateCol,
  validateEnumValue,
  validateMovieName
} from '../utils/validator';
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../redux/store";
import { useLoggedOwner } from "./useLoggedUser";
import { Role } from "../interface/Interface";


type FormData = {
  [key: string]: string
}


export const useForm = <T extends FormData>(initialValue: T, owner: Role) => {
  const [formData, setFormData] = useState<T>(initialValue);
  const [inputError, setInputError] = useState<Record<string, string>>({});
  const { error } = useLoggedOwner(owner);

  const dispatch = useDispatch<AppDispatch>();
  let clearErrorAction

  if (Role.admin === owner) {
    clearErrorAction = adminClearError
  } else if (Role.theaters === owner) {
    clearErrorAction = theaterClearError
  } else {
    clearErrorAction = userClearError
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    event.stopPropagation();

    const { name, value } = event.target;

    // Update form data
    setFormData((prevFormData) => {
      const newFormData = { ...prevFormData, [name]: value };

      if (name === "rows" || name === "column") {
        const rows = parseInt(newFormData["rows"], 10) || 1;
        const columns = parseInt(newFormData["column"], 10) || 1;

        const total = calculateSeatingCapacity(rows, columns);
        (newFormData as Record<string, string>)["seating_capacity"] = total;
      }

      return newFormData;
    });

    // Validate the input value
    let validationResponse = checkInputValue(name, value, formData.password);

    if (!validationResponse.isValid) {
      setInputError((prevErrors) => ({
        ...prevErrors,
        [name]: validationResponse.message,
      }));
    } else {
      setInputError((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors[name];
        return newErrors;
      });
    }

    if (error?.error === name) {
      dispatch(clearErrorAction())
    }
  };

  return {
    formData,
    handleChange,
    inputError,
    setInputError,
    setFormData
  };
};

interface ReturnObject {
  message: string;
  isValid: boolean
}

export function checkInputValue(name: string, value: string, value2?: string): ReturnObject {
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
      break;
    case "adhaar_number":
      validationResponse = validateAdhaar(value);
      break;
    case "theater_name":
      validationResponse = validateTheaterName(value);
      break;
    case "address":
      validationResponse = validateAddress(value);
      break;
    case "city":
      validationResponse = validateCity(value);
      break;
    case "theater_license":
      validationResponse = validateTheaterLicense(value);
      break;
    case 'screen_name':
      validationResponse = validateScreenName(value);
      break
    case 'rows':
      validationResponse = validateRow(value);
      break
    case 'column':
      validationResponse = validateCol(value);
      break
    case 'aminety' || 'language':
      validationResponse = validateEnumValue(name, value);
      break
    case 'movie_name':
      validationResponse = validateMovieName(value);
      break

    default:
      validationResponse = { message: "", isValid: true };
      break;
  }
  return validationResponse;
}

function calculateSeatingCapacity(rows: number, column: number): string {
  return `${rows * column}`;
}
