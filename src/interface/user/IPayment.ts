import { IMovie, ITheaterScreen, PaymentStatus, PurchasedItem } from "../Interface";
import { IMovieShow } from "../theater/IMovieShow";
import { ITheaterOwnerEntity } from "../theater/ITheaterOwner";
interface IRental{
  planName:string,
  validity:number,
  price:number,
  listed:boolean
}
export interface IPayment extends Document {
  movieId: string;
  showId?: string;
  userId: string;
  rentalId: string;
  screenId?: string;
  purchasedItem: PurchasedItem
  status: PaymentStatus;
  bookingDate: Date;
  seats?: string[];
  totalAmount: number;
  paymentIntentId: string;// for tracking payments in stripe
  serviceCharge?: number;
  extraCharge?: number;
  movie: Pick<IMovie, 'movie_name' | 'movie_poster'>;
  showDetail?: Pick<IMovieShow, 'format' | 'language' | 'showTime'>;
  theater?: Pick<ITheaterOwnerEntity, 'theater_name' | 'city'>;
  screen?: Pick<ITheaterScreen, 'chargePerSeat' | 'screen_name'>
  rentalPlan?: IRental
}