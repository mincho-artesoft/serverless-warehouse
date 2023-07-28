export interface CreateOrderDto {
  id: string;
  userId: string;
  organizationId: string;
  price: number;
  status: string;
  peymentStatis: string;
  peymentMethod: string;
  products: IProduct[];
}

interface IProduct {
  id: string;
  quantity: number;
}
