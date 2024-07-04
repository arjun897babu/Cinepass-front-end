export interface AuthFields{
  name:string,
  password:string
}

export interface SignUpFields extends AuthFields{
  name:string,
  mobile_number:number
};

