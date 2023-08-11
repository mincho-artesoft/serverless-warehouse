import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WarehouseModule } from './warehouse/warehouse.module';
import { TransactionsModule } from './transactions/transactions.module';
import { OrdersModule } from './orders/orders.module';
import { TypeOrmModule } from '@nestjs/typeorm'
import { ProductsModule } from './products/products.module';
import { Product } from './products/entities/product.entity';
import { Warehouse } from './warehouse/entities/warehouse.entity';
import { Organization } from '@nx-serverless/auth';

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'mongodb',
    url: 'mongodb+srv://minchomilev:Samoenter123@cluster0.pfnuj.mongodb.net/',
    synchronize: true,
    useUnifiedTopology: true,
    entities: [Product,Warehouse,Organization],
  }),WarehouseModule, TransactionsModule, OrdersModule,ProductsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
