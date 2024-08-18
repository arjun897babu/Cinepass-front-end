import axios from "axios";
const {

  VITE_API_URL,
  VITE_API_URL_USERS,
  VITE_API_URL_ADMIN,
  VITE_API_URL_THEATERS

} = import.meta.env

const API_URL = VITE_API_URL || 'http://localhost:8080'
const API_URL_USERS = VITE_API_URL_USERS || 'http://localhost:8080/users'
const API_URL_ADMIN = VITE_API_URL_ADMIN || 'http://localhost:8080/admin'
const API_URL_THEATERS = VITE_API_URL_THEATERS || 'http://localhost:8080/theaters'

export const serverInstance = axios.create({
  withCredentials: true,
  baseURL: API_URL
})

export const serverUser = axios.create({
  withCredentials: true,
  baseURL: API_URL_USERS
})
export const serverAdmin = axios.create({
  withCredentials: true,
  baseURL: API_URL_ADMIN
})
export const serverTheater = axios.create({
  withCredentials: true,
  baseURL: API_URL_THEATERS
})