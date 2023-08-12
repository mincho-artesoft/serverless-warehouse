import { Injectable } from '@nestjs/common';
import { WarehouseTransaction } from './entities/transaction.entity';
import { Repository } from 'typeorm';
import { ObjectId } from 'mongodb';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(WarehouseTransaction)
    private warehouseRepository: Repository<WarehouseTransaction>
  ) {}
  async create(createTransactionDto: WarehouseTransaction) {
    try {
      await this.warehouseRepository.save(createTransactionDto);
      return { message: 'Successful add WarehouseTransactio.' };
    } catch (error) {
      return { message: 'WarehouseTransactio add failed.' };
    }
  }
  async findOne(_id: any): Promise<WarehouseTransaction | null> {
    let transaction = null;
    if (_id.length === 12 || _id.length === 24) {
      try {
        parseInt(_id, 16);
        _id = new ObjectId(_id);
        transaction = await this.warehouseRepository.findOne({
          //@ts-ignore
          _id,
        });
      } catch (error) {
        console.log(error);
        transaction = null;
      }
    }
    return transaction;
  }

  async findAllWarehouseTransaction(
    warehouseId: string
  ): Promise<WarehouseTransaction[]> {
    return this.warehouseRepository.find({
      //@ts-ignore
      warehouseId,
    });
  }
  async findAll(): Promise<WarehouseTransaction[]> {
    return this.warehouseRepository.find();
  }
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
