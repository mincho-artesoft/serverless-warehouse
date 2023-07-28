export interface CreateOrderDto {
    id:string;
    price:number;
    products:IProduct[];
}

interface IProduct {
    id:string
    quantity: number;
  }