import { Module, forwardRef } from '@nestjs/common';
import { WarehouseService } from './warehouse.service';
import { WarehouseController } from './warehouse.controller';
import { AuthModule, AuthOrganizationModule, Organization } from '@nx-serverless/auth';
import { TransactionsModule } from '../transactions/transactions.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Warehouse } from './entities/warehouse.entity';

@Module({
  imports: [
     AuthModule,forwardRef(() => AuthOrganizationModule) ,
    TypeOrmModule.forFeature([Warehouse,Organization]),
    TransactionsModule,
  ],
  controllers: [WarehouseController],
  providers: [WarehouseService],
  exports: [WarehouseService],
})
export class WarehouseModule {}
