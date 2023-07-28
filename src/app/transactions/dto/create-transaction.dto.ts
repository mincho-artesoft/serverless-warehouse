export interface CreateTransactionDto {
    id?: string;
    warehouseId: string;
    quantity: number;
    type?:string;
  }