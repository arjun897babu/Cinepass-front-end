import { ApprovalStatus } from "../Interface";

export interface ITheaterOwnerEntity {
  _id: string;
  name: string;
  email: string;
  mobile_number: number;
  verified: boolean;
  status: boolean;
  adhaar_number: number;
  theater_name: string;
  theater_license: string;
  approval_status: ApprovalStatus;
  address:string,
  city:string
}