import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductModule } from './product/product.module';
import { WarehouseModule } from './warehouse/warehouse.module';
import { TransactionsModule } from './transactions/transactions.module';

@Module({
  imports: [ProductModule, WarehouseModule, TransactionsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
