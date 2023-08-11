import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { WarehouseTransactio } from './entities/transaction.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TransactionsService {
  /* async create(createTransactionDto: CreateTransactionDto) {
    try {
      createTransactionDto.id = uuidv4();
      const newWarehouse = new WarehouseTransactio(createTransactionDto);
      await newWarehouse.save();
      return { message: 'Successful add WarehouseTransactio.' };
    } catch (error) {
      return { message: 'WarehouseTransactio add failed.' };
    }
  }

  async findAll() {
    const transactions = await WarehouseTransactio.scan().exec();
    return transactions;
  }

  async findOne(id: string) {
    try {
      const transaction = await WarehouseTransactio.get(id);
      return transaction;
    } catch (err) {
      return undefined;
    }
  } */
 /* async checkExpirationDate(id: string,currentQuantity:number) {
    try {
      const warehouseTransactios = await WarehouseTransactio.scan('warehouseId').contains(id).exec();
      const filteredWarehouseTransactios = warehouseTransactios.filter(
        (row: any) =>
          row.quantity > 0 
      );
      filteredWarehouseTransactios.sort((a, b) => b.expirationDate - a.expirationDate);
      const currentDate = new Date();
      let newExpirationDate:Date;
      for (const item of filteredWarehouseTransactios) {
        if(item.expirationDate > currentDate && currentQuantity>0){
          currentQuantity -= item.quantity
          newExpirationDate = item.expirationDate
        }
      }
      if(currentQuantity<0){
        currentQuantity = 0
      }
      return {scrapQuantity:currentQuantity, newExpirationDate:newExpirationDate};
    } catch (err) {
      return undefined;
    }
  }*/
}
