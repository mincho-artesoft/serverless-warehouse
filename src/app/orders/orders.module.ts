import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { WarehouseModule } from '../warehouse/warehouse.module';
import { AuthModule } from '@nx-serverless/auth';

@Module({
  imports:[WarehouseModule,AuthModule],
  controllers: [OrdersController],
  providers: [OrdersService]
})
export class OrdersModule {}
