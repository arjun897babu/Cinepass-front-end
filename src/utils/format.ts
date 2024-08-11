import { string } from "zod";
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
  return `${Math.floor(parseInt(time, 10) / 60)}h ${parseInt(time, 10) % 60}min`
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
