import { ChangeEvent, useState } from "react";
import {
  validateEmail,
  validateMobileNumber,
  validatePassword,
  validateConfirmPassword,
  validateName
} from '../utils/validator';
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store";
import { useLoggedOwner } from "./useLoggedUser";
import { Role } from "../interface/Interface";
import useAction from "./UseAction";


type FormData = {
  [key: string]: string
}


export const useForm = <T extends FormData>(initialValue: T, owner: Role) => {
  const [formData, setFormData] = useState<T>(initialValue);
  const [inputError, setInputError] = useState<Record<string, string>>({});
  const { error } = useLoggedOwner(owner);

  const dispatch = useDispatch<AppDispatch>();
  const { clearError } = useAction(owner);

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    event.stopPropagation();

    const { name, value } = event.target;

    // Update form data
    setFormData((prevFormData) => {
      const newFormData = { ...prevFormData, [name]: value };

      if (name === "rows" || name === "column") {
        const rows = parseInt(newFormData["rows"], 10) || 0;
        const columns = parseInt(newFormData["column"], 10) || 0;

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

    // Clear error if applicable
    if (error?.error === name) {
      if (clearError) {
        clearError();
      }
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
      console.log('confirmvalidation', validationResponse);
      break;
    default:
      validationResponse = { message: "", isValid: true };
      break;
  }
  return validationResponse;
}

function calculateSeatingCapacity(rows: number, column: number): string {
  console.log(rows * column);
  return `${rows * column}`;
}
