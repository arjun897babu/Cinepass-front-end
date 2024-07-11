import { IInitialStateError } from "../../interface/Interface";

export interface IInitialState {
  
  loading: boolean;
  error: IInitialStateError | null;
  isUser:boolean
  
}
