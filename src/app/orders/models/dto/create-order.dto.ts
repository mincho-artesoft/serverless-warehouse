import { OrganizationAddress } from "@nx-serverless/auth";
export interface CreateOrderDto {
  id: string;
  userId: string;
  organizationId: string;
  price: number;
  status: string;
  peymentStatis: string;
  peymentMethod: string;
  products: IProduct[];
  deliveryDate:Date;
  address:OrganizationAddress;
  
}

interface IProduct {
  id: string;
  quantity: number;
}
