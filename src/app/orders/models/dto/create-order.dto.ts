import { ApiProperty } from '@nestjs/swagger';
import { Address} from '@nx-serverless/auth';
import { Product } from '../product';

export class CreateOrderDto {
  @ApiProperty()
  userId: string;

  @ApiProperty()
  organizationId: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  products: Product[];

  @ApiProperty()
  deliveryDate: Date;

  @ApiProperty()
  address: Address;
}

/* import { IOrganizationAddress } from '@nx-serverless/auth';
import { IProduct } from '../product.interface';
export interface CreateOrderDto {
  userId: string;
  organizationId: string;
  price: number;
  products: IProduct[];
  deliveryDate: Date;
  address: IOrganizationAddress;
} */
