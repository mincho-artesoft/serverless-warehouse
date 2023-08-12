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
import { Order } from './models/entities/order.entity';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UseGuards(TokenVerification)
  async create(@Request() request, @Body() createWarehouseDto: Order) {
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
        case 'Invalid fields entered.':
          throw new HttpException(result, HttpStatus.BAD_REQUEST);

      default:
        throw new HttpException(
          { message: 'Internal server error' },
          HttpStatus.INTERNAL_SERVER_ERROR
        );
    }
  }
  @Get()
 // @UseGuards(TokenVerification)
  findAll() {
    return this.ordersService.findAll();
  }

  @Get('find-all-user-orders/:id')
  //@UseGuards(TokenVerification)
  findAllUserOrders(@Param('id') id: string) {
    return this.ordersService.findAllUserOrders(id);
  }

  @Get('find-all-organization-orders/:id')
  //@UseGuards(TokenVerification)
  findAllOrganizationOrders(@Param('id') id: string) {
    return this.ordersService.findAllOrganizationOrders(id);
  }
  @Get(':id')
  //@UseGuards(TokenVerification)
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Put(':id')
  //@UseGuards(TokenVerification)
  async update(@Param('id') id: string, @Body() updateOrderDto: Partial<Order>) {
   // return this.ordersService.update(id, updateOrderDto);
    const result = await this.ordersService.update(id, updateOrderDto);
    switch (result.message) {
      case 'Order not found.':
        throw new HttpException(result, HttpStatus.NOT_FOUND);
      case 'Order updated.':
        return { result, status: HttpStatus.OK };
      case 'Organisation not found.':
        throw new HttpException(result, HttpStatus.BAD_REQUEST);
      case 'Products not found.':
        throw new HttpException(result, HttpStatus.NOT_FOUND);
      case 'Invalid payment starus.':
        throw new HttpException(result, HttpStatus.BAD_REQUEST);
        case 'Invalid order starus.':
          throw new HttpException(result, HttpStatus.BAD_REQUEST);

      default:
        throw new HttpException(
          { message: 'Internal server error' },
          HttpStatus.INTERNAL_SERVER_ERROR
        );
    }
  }
}
