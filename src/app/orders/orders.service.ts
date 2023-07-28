import { Inject, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './models/dto/create-order.dto';
import { v4 as uuidv4 } from 'uuid';
import { Order } from './models/entities/order.entity';
import OrderStatus from './models/order-status.enum';
import PaymentStatus from './models/peyment-status.enum';
import PaymentMethod from './models/peyment-methods.enum';
import { WarehouseService } from '../warehouse/warehouse.service';

@Injectable()
export class OrdersService {
  constructor(
    @Inject(WarehouseService)
    private warehouseService: WarehouseService
  ) {}

  async create(createOrderDto: CreateOrderDto, request: any) {
    try {
      if (
        !request['user'].roles.includes('admin') &&
        createOrderDto.userId != request['user'].id
      ) {
        return { message: 'You cannot add an order with someone elses id.' };
      }
      if (
        !(await this.warehouseService.organizationService.findOne(
          createOrderDto.organizationId
        ))
      ) {
        return { message: 'Organisation not found.' };
      }

      const deliveryDate = new Date(createOrderDto.deliveryDate)
      const currentDate = new Date();
      const timeDifference = deliveryDate.getTime() - currentDate.getTime();
      if (timeDifference < 3600000) {
        return { message: 'Invalid delivery time.' };
      }

      const allOrganizationsProducts =
        await this.warehouseService.findAllOrganizationCookedProducts(
          createOrderDto.organizationId
        );

      let price = 0;
      const allProductIDsExist = createOrderDto.products.every((product) => {
        return allOrganizationsProducts.some((obj) => {
          const result = obj.id === product.id;
          if (result) {
            price += product.quantity * obj.price;
          }
          return result;
        });
      });
      if (price != createOrderDto.price) {
         return { message: 'Invalid price.' };
      }
      if (!allProductIDsExist) {
        return { message: 'Products not found.' };
      }
      createOrderDto.id = uuidv4();
      createOrderDto.status = OrderStatus.DRAFT;
      createOrderDto.peymentStatis = PaymentStatus.PAYMENT_PENDING;
      createOrderDto.peymentMethod = PaymentMethod.DEBIT_CARD;
      const newWarehouse = new Order(createOrderDto);
      await newWarehouse.save();
      return { message: 'Successful add order.' };
    } catch (error) {
      return { message: 'Order add failed.' };
    }
  }

  async findAll() {
    const allOrders = await Order.scan().exec();
    return allOrders;
  }

  async findOne(id: string) {
    try {
      const order = await Order.get(id);
      return order;
    } catch (err) {
      return undefined;
    }
  }
  async findAllUserOrders(id: string) {
    try {
      const result = await Order.scan().exec();
      if (result.length > 0) {
        return result.filter((row: any) => row.userId == id);
      } else {
        return [];
      }
    } catch (err) {
      return [];
    }
  }
  async findAllOrganizationOrders(id: string) {
    try {
      const result = await Order.scan().exec();
      if (result.length > 0) {
        return result.filter((row: any) => row.organizationId == id);
      } else {
        return [];
      }
    } catch (err) {
      return [];
    }
  }

  update(id: string, createOrderDto: CreateOrderDto) {
    return `This action updates a #${id} order`;
  }
}
