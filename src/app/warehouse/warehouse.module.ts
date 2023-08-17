import { Module, forwardRef } from '@nestjs/common';
import { WarehouseService } from './warehouse.service';
import { WarehouseController } from './warehouse.controller';
import { AuthModule, AuthOrganizationModule, Organization } from '@nx-serverless/auth';
import { TransactionsModule } from '../transactions/transactions.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Warehouse } from './models/entities/warehouse.entity';
import { AwsSnsModule } from '@nx-serverless/aws';

@Module({
  imports: [
     AuthModule,forwardRef(() => AuthOrganizationModule) ,
    TypeOrmModule.forFeature([Warehouse,Organization]),
    TransactionsModule,
    AwsSnsModule
  ],
  controllers: [WarehouseController],
  providers: [WarehouseService],
  exports: [WarehouseService],
})
export class WarehouseModule {}
