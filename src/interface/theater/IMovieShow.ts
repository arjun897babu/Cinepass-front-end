export interface IReservedSeats {
  booking_date: Date
  reserved_seats: string[]
}

export interface IMovieShow {
  _id?: string
  movieId: string;
  language: string;
  screenId: string
  showTime: string,
  format:string,
  endTime: string,
  opening_date?: string | Date
  reserved?:IReservedSeats[]
}

