import { date } from "zod";
import { UploadError } from "./customError";
import { TiMediaFastForward } from "react-icons/ti";
import { MovieStatus } from "../interface/Interface";

const dateTypeGuard = (date: string | Date) => typeof date === 'string' ? new Date(date) : date


export function formatTime(time: number): string {
  const min = Math.floor(time / 60);
  const sec = Math.round(time % 60);
  const formattedSec = sec < 10 ? `0${sec}` : sec;

  return `${min}:${formattedSec}`;
}
export function getIST(time: string): string {

  const date = new Date(time);

  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  const formattedDay = (day < 10 ? '0' : '') + day;
  const formattedMonth = (month < 10 ? '0' : '') + month;


  return `${formattedDay}-${formattedMonth}-${year}`;
}

export function formatRunTime(time: string): string {
  const minutes = parseInt(time, 10);
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  return `${hours}${remainingMinutes > 0 ? `h ${remainingMinutes}min` : 'h'}`;

}
export function extractHourAndMin(time: string) {
  return time.split(':').map(Number);
}
export function convertTo12HourFormat(time: string) {

  const [hour, minute] = extractHourAndMin(time);


  const period = hour >= 12 ? 'PM' : 'AM';

  const hour12 = hour % 12 || 12;

  return `${hour12}:${minute < 10 ? '0' + minute : minute} ${period}`;
}

export function getMovieTime(time: string): [number, number] {
  const movieHour = Math.floor(parseInt(time, 10) / 60)
  const movieMin = parseInt(time, 10) % 60
  return [movieHour, movieMin]
}

export function formatEndTime(hour: number, min: number): string {
  const hourStr = hour < 10 ? `0${hour}` : `${hour}`;
  const minStr = min < 10 ? `0${min}` : `${min}`;
  return `${hourStr}:${minStr}`;
}
export function calculateEndTime(hour: number, movieHour: number, min: number, movieMin: number): string {
  let endHour = hour + movieHour
  let endMin = min + movieMin + 15

  if (endMin >= 60) {
    endHour += Math.floor(endMin / 60);
    endMin %= 60;
  }

  return formatEndTime(endHour, endMin)
}

export function getMovieSrc(src: string | File) {
  return typeof src === "string" ? src as string : ''
}

export function convertFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      reader.result ?
        resolve(reader.result as string)  // represent the base64 string 
        : reject(new UploadError('uploading Failed'));
    };

    reader.onerror = (error) => {
      reject(new UploadError('uploading Failed'));
    };

    //for reading the file as data url
    reader.readAsDataURL(file);
  });
};


export function setDefaultDate(date: string, days: number): string {

  const newDate = new Date(date);

  newDate.setDate(newDate.getDate() + days);

  return newDate.toISOString().split('T')[0];
}

export function getSerialNumber<T extends number>(currentPage: T, index: T, limit: T = 3 as T): number {
  return (currentPage - 1) * limit + index + 1
}

export function getSeatName(rowIndex: number, colIndex: number): string {
  return `${String.fromCharCode(65 + rowIndex)}${colIndex + 1}`;
}

export function getDayName(date: Date | string = new Date()): string {
  date = dateTypeGuard(date)
  return date.toLocaleDateString('en-IN', { weekday: 'short' })
}
export function getMonthName(date: Date | string = new Date()): string {
  date = dateTypeGuard(date)
  return date.toLocaleDateString('en-IN', { month: 'short' })
}
export function getDate(date: Date | string) {
  date = dateTypeGuard(date)
  return date.toLocaleDateString('en-IN', { day: '2-digit' })
}

export function toValidJSDate(date: string): Date {
  const [day, month, year] = date.split('-');
  return new Date(`${year}-${month}-${day}`);
}

export function calculateTotalAmount<T extends number>(totalSeat: T, chargePerSeat: T, serviceCharge: T): number {
  return (totalSeat * chargePerSeat) + (totalSeat * serviceCharge)
}

export function getMovieTextStatus(status: MovieStatus): string {
  switch (status) {
    case MovieStatus.COMPLETED:
      return "We hope you liked it!";
    case MovieStatus.RUNNING:
      return "Enjoy the show!";
    default:
      return "Stay tuned!!!!!!"
  }
}