import { Module,forwardRef } from '@nestjs/common';
import { WarehouseService } from './warehouse.service';
import { WarehouseController } from './warehouse.controller';
import { AuthModule, AuthOrganizationModule } from '@nx-serverless/auth';
import { TransactionsModule } from '../transactions/transactions.module';

@Module({
  imports:[AuthModule,forwardRef(() => AuthOrganizationModule),TransactionsModule],
  controllers: [WarehouseController],
  providers: [WarehouseService],
  exports: [WarehouseService]
})
export class WarehouseModule {}
