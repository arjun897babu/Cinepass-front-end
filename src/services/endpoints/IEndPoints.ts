export interface IEndPoints {
  login: string;
  logout: string;
}

export interface UserEndpoint extends IEndPoints {
  signup: string;
  verifyOTP: string;
  resendOTP: string;
  forgotPassword:string;
  resetPassword:(token:string)=>string
}
export interface TheaterEndpoint extends IEndPoints {
  signup: string;
  verifyOTP: string;
  resendOTP: string;
  forgotPassword:string;

}
export interface AdminEndpoint extends IEndPoints {
  getEntityData:(role: string) => string
  updateApprovalStatus: (theaterOwnerId: string) => string
  manageEntities: (_id: string, role: string) => string

}