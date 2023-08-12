import { IOrganizationAddress } from '@nx-serverless/auth';
import { IProduct } from '../product.interface';
export interface CreateOrderDto {
  userId: string;
  organizationId: string;
  price: number;
  products: IProduct[];
  deliveryDate: Date;
  address: IOrganizationAddress;
}

/*   status: string;
  peymentStatis: string;
  peymentMethod: string; */
