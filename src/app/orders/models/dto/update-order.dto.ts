
import {ApiPropertyOptional } from '@nestjs/swagger';
import OrderStatus from '../order-status.enum';
import PaymentStatus from '../peyment-status.enum';
import PaymentMethod from '../peyment-methods.enum';
import { Product } from '../product';

export class UpdateOrderDto {
  @ApiPropertyOptional()
  products?: Product[];

  @ApiPropertyOptional()
  status?: OrderStatus;

  @ApiPropertyOptional()
  paymentStatus?: PaymentStatus;

  @ApiPropertyOptional()
  peymentMethod?: PaymentMethod;
}
/* import { IProduct } from '../product.interface';
import OrderStatus from '../order-status.enum';
import PaymentStatus from '../peyment-status.enum';
import PaymentMethod from '../peyment-methods.enum';
export interface UpdateOrderDto {
  products?: IProduct[];
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  peymentMethod?: PaymentMethod; 
} */