interface ITheaterOwnerForTheater{
  _id: string;
  name: string;
  email: string;
  mobile_number: number;
}

export interface ITheaterDetailResponse{
  _id: string;
  theater_Name: string;
  theater_license: string;
  address: string;
  images: string[];
  city: string;
  owner: ITheaterOwnerForTheater;
}