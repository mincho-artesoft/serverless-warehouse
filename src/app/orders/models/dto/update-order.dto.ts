
import { IProduct } from '../product.interface';
import OrderStatus from '../order-status.enum';
import PaymentStatus from '../peyment-status.enum';
import PaymentMethod from '../peyment-methods.enum';
export interface UpdateOrderDto {
  products?: IProduct[];
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  peymentMethod?: PaymentMethod; 
}