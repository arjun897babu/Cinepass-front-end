export enum MovieFormat {
  TWO_D = "2D",
  THREE_D = "3D",
  FOUR_K = "4K",
  IMAX = "IMAX"
}

export enum Language {
  English = 'english',
  Japanese = 'japanese',
  Korean = 'korean',
  Hindi = 'hindi',
  Telugu = 'telugu',
  Tamil = 'tamil',
  Kannada = 'kannada',
  Malayalam = 'malayalam',
}

export enum Genre {
  Action = 'action',
  Adventure = 'adventure',
  Comedy = 'comedy',
  Crime = 'crime',
  Drama = 'drama',
  Fantasy = 'fantasy',
  Historical = 'historical',
  Horror = 'horror',
  Musical = 'musical',
  Mystery = 'mystery',
  Romance = 'romance',
  SciFi = 'sci-fi',
  Thriller = 'thriller',
  War = 'war',
  Western = 'western',
  Animation = 'animation',
  Documentary = 'documentary',
}



interface ReturnObject {
  message: string
  isValid: boolean
}

const regex = {
  name: /^(?=.{3,20}$)[a-zA-Z]+(?: [a-zA-Z]+)*$/,
  email: /^(?=.{11,100}$)([a-zA-Z\d]+([.-_]?[a-zA-Z\d]+)*)\@([a-zA-Z]{5,9})+\.com$/,
  mobile_number: /^\d{10}$/,
  otp: /^[^\s]{6}$/,
  adhaar: /^\d{12}$/,
  theater_name: /^(?=.{3,100}$)[a-zA-Z0-9,]+(?: [a-zA-Z0-9,]+)*$/,
  address: /^(?=.{30,120}$)[a-zA-Z0-9, ]+$/,
  city: /^(?=.{3,25}$)[a-zA-Z]+(?: [a-zA-Z]+)*$/,
  theater_license: /^[a-zA-Z0-9]+$/,
  password: /^[a-zA-Z0-9]/,
  screen_name: /^[a-zA-Z]+(?: [0-9]+)*$/,
  row_col: /^\d/,
  movie_name: /^[a-zA-Z0-9]+(?: [a-zA-Z0-9]+)*[\-:(),.']{0,150}$/
}

//helper function
const errorMessage = (field: string): string => `${field} is required`
const isEmpty = (value: string): boolean => value.trim() === ''
const validMessage = (field: string): string => `${field} is valid`

//validating array of value for genre,lanague,movieformat
// const validateMultiEnumField = (
//   field: string,
//   values: string[]
// ): ReturnObject => {
//   let validationResult: ReturnObject;

//   for (const value of values) {
//     validationResult = validateEnumField(field, value);

//     if (!validationResult.isValid) {
//       return validationResult;
//     }
//   }

//   return {
//     message: validMessage(field),
//     isValid: true
//   };

// }

//validating  single enum filed value for genre,lanague,movieformat
const validateEnumField = (
  field: string,
  value: string
): ReturnObject => {
  let isValid = false;

  switch (field) {
    case 'genre':
      isValid = Object.values(Genre).includes(value as Genre);
      break;
    case 'language':
      isValid = Object.values(Language).includes(value as Language);
      break;
    case 'format' || 'aminety':
      isValid = Object.values(MovieFormat).includes(value as MovieFormat);
      break;
    default:
      return {
        message: `Invalid field: ${field}`,
        isValid: false
      };
  }

  return {
    message: isValid ? validMessage(field) : `Invalid ${field}`,
    isValid
  };
}



const validateField = (
  value: string,
  field: string,
  fieldRegex?: RegExp,
  minLength?: number,
  maxLength?: number,
  value2?: string,
): ReturnObject => {

 
  if (field !== 'confirm password' && isEmpty(value)) {

    return { message: errorMessage(field), isValid: false }
  }

  if (field !== 'confirm password' && minLength && value.length < minLength) {
    return { message: `${field} must be ${minLength}-${maxLength ?? ''} ${!maxLength ? 'digits' : 'characters'} long.`, isValid: false }
  }

  if (field !== 'confirm password' && fieldRegex && !fieldRegex.test(value)) {

    return { message: `Invalid ${field}`, isValid: false }
  }

  if (value2 && value !== value2) {
    return { message: `password mismatch`, isValid: false }
  }

  return {
    message: validMessage(field),
    isValid: true
  }


}
const validateName = (name: string): ReturnObject =>
  validateField(name, 'name', regex.name, 3, 20)

const validateMobileNumber = (number: string): ReturnObject =>
  validateField(number, 'mobile number', regex.mobile_number, 10)

const validateEmail = (email: string): ReturnObject =>
  validateField(email, 'email', regex.email)

const validateAdhaar = (adhaarNumber: string): ReturnObject =>
  validateField(adhaarNumber, 'adhaar number', regex.adhaar, 12, 12)

const validateTheaterName = (theaterName: string): ReturnObject =>
  validateField(theaterName, 'theater name', regex.theater_name, 3, 100)

const validateAddress = (address: string): ReturnObject =>
  validateField(address, 'address', regex.address, 30, 120)

const validateCity = (city: string): ReturnObject =>
  validateField(city, 'city', regex.city, 3, 25)

const validateOTP = (OTP: string): ReturnObject =>
  validateField(OTP, 'otp', regex.otp)

const validateTheaterLicense = (theaterLicense: string): ReturnObject =>
  validateField(theaterLicense, 'theater license', regex.theater_license)

const validatePassword = (password: string): ReturnObject =>
  validateField(password, 'password', regex.password, 6, 20)

const validateConfirmPassword = (confirmPassword: string, password: string): ReturnObject =>
  validateField(confirmPassword, 'confirm password', regex.password, 6, 20, password)

const validateScreenName = (screenName: string): ReturnObject =>
  validateField(screenName, 'screen name', regex.screen_name, 4, 20)

const validateRow = (row: string): ReturnObject =>
  validateField(row, 'row', regex.row_col)

const validateCol = (col: string): ReturnObject =>
  validateField(col, 'column', regex.row_col)

const validateEnumValue = (field: string, aminety: string): ReturnObject =>
  validateEnumField(aminety, field);

const validateMovieName = (movieName: string): ReturnObject =>
  validateField(movieName, 'movie Name')



export {
  validateName,
  validateMobileNumber,
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  validateOTP,
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
}


