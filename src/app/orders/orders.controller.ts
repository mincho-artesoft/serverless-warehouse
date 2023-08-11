import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpException,
  HttpStatus,
  Request,
  Put,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './models/dto/create-order.dto';
import { TokenVerification } from '@nx-serverless/auth';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

/*   @Post()
  @UseGuards(TokenVerification)
  async create(@Request() request, @Body() createWarehouseDto: CreateOrderDto) {
    const result = await this.ordersService.create(createWarehouseDto, request);
    switch (result.message) {
      case 'Order add failed.':
        throw new HttpException(result, HttpStatus.BAD_REQUEST);
      case 'Successful add order.':
        return { result, status: HttpStatus.CREATED };
      case 'You cannot add an order with someone elses id.':
        throw new HttpException(result, HttpStatus.BAD_REQUEST);
      case 'Organisation not found.':
        throw new HttpException(result, HttpStatus.BAD_REQUEST);
      case 'Products not found.':
        throw new HttpException(result, HttpStatus.BAD_REQUEST);
      case 'Invalid price.':
        throw new HttpException(result, HttpStatus.BAD_REQUEST);
      case 'Invalid delivery time.':
        throw new HttpException(result, HttpStatus.BAD_REQUEST);

      default:
        throw new HttpException(
          { message: 'Internal server error' },
          HttpStatus.INTERNAL_SERVER_ERROR
        );
    }
  }

  @Get()
  @UseGuards(TokenVerification)
  findAll() {
    return this.ordersService.findAll();
  }

  @Get('find-all-user-orders/:id')
  @UseGuards(TokenVerification)
  findAllUserOrders(@Param('id') id: string) {
    return this.ordersService.findAllUserOrders(id);
  }

  @Get('find-all-organization-orders/:id')
  @UseGuards(TokenVerification)
  findAllOrganizationOrders(@Param('id') id: string) {
    return this.ordersService.findAllOrganizationOrders(id);
  }
  @Get(':id')
  @UseGuards(TokenVerification)
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Put(':id')
  @UseGuards(TokenVerification)
  update(@Param('id') id: string, @Body() updateOrderDto: CreateOrderDto) {
    return this.ordersService.update(id, updateOrderDto);
  } */
}
