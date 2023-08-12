import { Controller, Get, Param } from '@nestjs/common';
import { TransactionsService } from './transactions.service';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

   @Get()
  findAll() {
    return this.transactionsService.findAll();
  }

  @Get('warehouse/:id')
  findAllWarehouseTransaction(@Param('id') id: string) {
    return this.transactionsService.findAllWarehouseTransaction(id);
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transactionsService.findOne(id);
  } 
}
