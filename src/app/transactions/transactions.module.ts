import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WarehouseTransaction } from './entities/transaction.entity';
import { AuthModule } from '@nx-serverless/auth';

@Module({
  imports: [
    AuthModule,
   TypeOrmModule.forFeature([WarehouseTransaction])
 ],
  controllers: [TransactionsController],
  providers: [TransactionsService],
  exports: [TransactionsService]
})
export class TransactionsModule {}
