import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TokenVerification } from '@nx-serverless/auth';

@ApiTags('Warehouse - transactions')
@ApiBearerAuth()
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @ApiOperation({
    summary: 'Get all transactions',
    description: 'Retrieves a list of all transactions.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of transactions retrieved successfully',
  })
  @Get()
  @UseGuards(TokenVerification)
  findAll() {
    return this.transactionsService.findAll();
  }

  @ApiOperation({
    summary: 'Get all transactions for a specific warehouse',
    description:
      'Retrieves a list of transactions for a specific warehouse based on the provided ID.',
  })
  @ApiParam({ name: 'id', description: 'Warehouse ID' })
  @ApiResponse({
    status: 200,
    description: 'List of warehouse transactions retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Warehouse not found or has no transactions',
  })
  @Get('warehouse/:id')
  @UseGuards(TokenVerification)
  findAllWarehouseTransaction(@Param('id') id: string) {
    return this.transactionsService.findAllWarehouseTransaction(id);
  }

  @ApiOperation({
    summary: 'Get transaction by ID',
    description: 'Retrieves transaction details based on the provided ID.',
  })
  @ApiParam({ name: 'id', description: 'Transaction ID' })
  @ApiResponse({ status: 200, description: 'Transaction found' })
  @ApiResponse({ status: 404, description: 'Transaction not found' })
  @Get(':id')
  @UseGuards(TokenVerification)
  findOne(@Param('id') id: string) {
    return this.transactionsService.findOne(id);
  }
}
