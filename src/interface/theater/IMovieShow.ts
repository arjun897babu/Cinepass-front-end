export interface IReservedSeats {
  bookingDate: Date
  reservedSeats: string[]
}

export interface IMovieShow {
  _id?: string
  movieId: string;
  language: string;
  screenId: string
  showTime: string,
  format:string,
  endTime: string,
  openingDate: string|Date
  reserved?:IReservedSeats[]
}

