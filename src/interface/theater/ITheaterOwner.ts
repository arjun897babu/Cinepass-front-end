import { ApprovalStatus } from "../Interface";

export interface ITheaterOwnerEntity {
  _id: string
  name: string;
  email: string;
  mobile_number: number;
  password: string;
  verified?: boolean;
  status?: boolean;
  adhaar_number: number;
  theater_name: string;
  theater_license: string;
  approval_status?: ApprovalStatus;
  address: string
  city: string,
  images?: string[]
}

export type TheaterOwnerProfile = Pick<ITheaterOwnerEntity, 'name' | 'email' | 'mobile_number' | 'adhaar_number'>;

export type TheaterProfile = Pick<ITheaterOwnerEntity, 'theater_name' | 'theater_license' |   'address' | 'city' | 'images'>;
