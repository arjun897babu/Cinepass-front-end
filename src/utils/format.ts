import { number } from "zod";
import { UploadError } from "./customError";

export function formatTime(time: number): string {
  const min = Math.floor(time / 60);
  const sec = Math.round(time % 60);
  const formattedSec = sec < 10 ? `0${sec}` : sec;

  return `${min}:${formattedSec}`;
}

export function getIST(time: string): string {

  return new Date(time)
    .toLocaleDateString(
      'en-IN',
      {

        day: "2-digit",
        month: "2-digit",
        year: "2-digit"
      }
    )
}

export function formatRunTime(time: string): string {
  const minutes = parseInt(time, 10);
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  return `${hours}${remainingMinutes > 0 ? `h ${remainingMinutes}min` : 'h'}`;

}

export function convertTo12HourFormat(time: string) {

  const [hour, minute] = time.split(':').map(Number);


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


export function setDefaultDate(date: Date, days: number): string {

  const newDate = new Date(date);

  newDate.setDate(newDate.getDate() + days);

  return newDate.toISOString().split('T')[0];
}