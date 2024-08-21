

export interface ISeat {
  name: string,
  booked: boolean,
}

export interface ITheaterScreenResponse {
  _id: string;
  theaterId: string
  screen_name: string,
  seating_capacity: number,
  rows: number,
  amenity:string,
  column: number,
  chargePerSeat: number
  layout: Array<Array<ISeat>>
  slug:string
}
export interface ITheaterScreen {
  screen_name: string,
  seating_capacity: string,
  rows: string,
  amenity:string,
  column: string,
  chargePerSeat: string
  layout: Array<Array<ISeat>>;
}

