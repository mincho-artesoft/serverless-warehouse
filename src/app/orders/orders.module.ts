import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { WarehouseModule } from '../warehouse/warehouse.module';

@Module({
  imports:[WarehouseModule],
  controllers: [OrdersController],
  providers: [OrdersService]
})
export class OrdersModule {}
