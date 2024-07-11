import axios from "axios";
const {

  VITE_API_URL

} = import.meta.env

const API_URL = VITE_API_URL || 'http://localhost:8080'

export const serverInstance = axios.create({
  withCredentials: true,
  baseURL: API_URL
})