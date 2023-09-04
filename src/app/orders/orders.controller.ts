import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  HttpException,
  HttpStatus,
  Request,
  Put,
  Req,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './models/dto/create-order.dto';
import { TokenVerification } from '@nx-serverless/auth';
import { UpdateOrderDto } from './models/dto/update-order.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import PaymentStatus from './models/peyment-status.enum';

@ApiTags('Warehouse - Orders')
@ApiBearerAuth()
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @ApiOperation({
    summary: 'Create a new order',
    description: 'Creates a new order based on the provided data.',
  })
  @ApiBody({ type: CreateOrderDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Order created successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @Post()
  @UseGuards(TokenVerification)
  async create(@Request() request, @Body() createWarehouseDto: CreateOrderDto) {
    const result = await this.ordersService.create(createWarehouseDto, request);
    switch (result.message) {
      case 'Successful add order.':
        return { result, status: HttpStatus.CREATED };
      case 'Order add failed.':
      case 'You cannot add an order with someone elses id.':
      case 'Organisation not found.':
      case 'Products not found.':
      case 'Invalid price.':
      case 'Invalid delivery time.':
      case 'Invalid fields entered.':
        throw new HttpException(result, HttpStatus.BAD_REQUEST);

      default:
        throw new HttpException(
          { message: 'Internal server error' },
          HttpStatus.INTERNAL_SERVER_ERROR
        );
    }
  }

  @ApiOperation({
    summary: 'Get all orders',
    description: 'Retrieves a list of all orders.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of orders retrieved successfully',
  })
  @Get()
  @UseGuards(TokenVerification)
  findAll() {
    return this.ordersService.findAll();
  }

  @ApiOperation({
    summary: 'Get all orders for a specific user',
    description:
      'Retrieves a list of orders for a specific user based on the provided ID.',
  })
  @ApiParam({ name: 'id', description: 'ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of user orders retrieved successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User not found or has no orders',
  })
  @Get('find-all-user-orders/:id')
  @UseGuards(TokenVerification)
  findAllUserOrders(@Param('id') id: string) {
    return this.ordersService.findAllUserOrders(id);
  }

  @ApiOperation({
    summary: 'Get all orders for a specific organization',
    description:
      'Retrieves a list of orders for a specific organization based on the provided ID.',
  })
  @ApiParam({ name: 'id', description: 'ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of organization orders retrieved successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Organization not found or has no orders',
  })
  @Get('find-all-organization-orders/:id')
  @UseGuards(TokenVerification)
  findAllOrganizationOrders(@Param('id') id: string) {
    return this.ordersService.findAllOrganizationOrders(id);
  }

  @ApiOperation({
    summary: 'Get order details by ID',
    description: 'Retrieves order details based on the provided ID.',
  })
  @ApiParam({ name: 'id', description: 'ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Order found' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Order not found' })
  @Get(':id')
  @UseGuards(TokenVerification)
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Post('updateWebhook')
  // @UseGuards(TokenVerification)
  async updateWebhook(
    @Body() updateOrderDto: UpdateOrderDto,
    @Req() request: any
  ) {
    updateOrderDto.paymentStatus = PaymentStatus.PAID;
   // return{request}
   if(request.body.data.object.status == 'succeeded'){
    updateOrderDto.paymentStatus = PaymentStatus.PAID;
   }else{
    updateOrderDto.paymentStatus = PaymentStatus.FAILED;
   }
    const result = await this.ordersService.update(
      request.body.data.object.metadata.orderId,
      updateOrderDto
    );
    console.log(request);
    switch (result.message) {
      case 'Products not found.':
      case 'Order not found.':
        throw new HttpException(result, HttpStatus.NOT_FOUND);
      case 'Order updated.':
        return { result, status: HttpStatus.OK };
      case 'Organisation not found.':
      case 'Invalid payment starus.':
      case 'Invalid order starus.':
        throw new HttpException(result, HttpStatus.BAD_REQUEST);

      default:
        throw new HttpException(
          { message: 'Internal server error' },
          HttpStatus.INTERNAL_SERVER_ERROR
        );
    }
  }

  @ApiOperation({
    summary: 'Update order details by ID',
    description: 'Updates order details based on the provided ID and data.',
  })
  @ApiBody({ type: UpdateOrderDto })
  @ApiParam({ name: 'id', description: 'ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Order updated successfully',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Order not found' })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @Put(':id')
  @UseGuards(TokenVerification)
  async update(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto
  ) {
    const result = await this.ordersService.update(id, updateOrderDto);
    switch (result.message) {
      case 'Products not found.':
      case 'Order not found.':
        throw new HttpException(result, HttpStatus.NOT_FOUND);
      case 'Order updated.':
        return { result, status: HttpStatus.OK };
      case 'Organisation not found.':
      case 'Invalid payment starus.':
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
