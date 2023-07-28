import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WarehouseModule } from './warehouse/warehouse.module';
import { TransactionsModule } from './transactions/transactions.module';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [WarehouseModule, TransactionsModule, OrdersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
