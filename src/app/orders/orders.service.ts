import { Inject, Injectable } from '@nestjs/common';
import { Order } from './models/entities/order.entity';
import OrderStatus from './models/order-status.enum';
import PaymentStatus from './models/peyment-status.enum';
import PaymentMethod from './models/peyment-methods.enum';
import { WarehouseService } from '../warehouse/warehouse.service';
import { Repository } from 'typeorm';
import { ObjectId } from 'mongodb';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateOrderDto } from './models/dto/update-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @Inject(WarehouseService)
    private warehouseService: WarehouseService,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>
  ) {}

  async create(createOrderDto: any, request: any) {
    try {
      if (!this.isOrderValid(createOrderDto)) {
        return { message: 'Invalid fields entered.' };
      }

      const validOrder: Order = {
        userId: createOrderDto.userId,
        organizationId: createOrderDto.organizationId,
        price: 0,
        status: OrderStatus.DRAFT,
        paymentMethod: PaymentMethod.DEBIT_CARD,
        paymentStatus: PaymentStatus.PAYMENT_PENDING,
        products: createOrderDto.products,
        deliveryDate: createOrderDto.deliveryDate,
        address: createOrderDto.address,
      } as Order;

      createOrderDto = validOrder;

      if (
        !request['user'].roles.includes('admin') &&
        createOrderDto.userId != request['user']._id
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

      const deliveryDate = new Date(createOrderDto.deliveryDate);
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
          const result = obj._id.toString() === product.id;
          if (result) {
            price += product.quantity * obj.price;
          }
          return result;
        });
      });

      createOrderDto.price = price;
      if (!allProductIDsExist) {
        return { message: 'Products not found.' };
      }
      /* if (price != createOrderDto.price) {
        return { message: 'Invalid price.' };
      } */

      await this.orderRepository.save(createOrderDto);
      return { message: 'Successful add order.' };
    } catch (error) {
      return { message: 'Order add failed.' };
    }
  }
  async findOne(_id: any): Promise<Order | null> {
    let warehouse = null;
    if (_id.length === 12 || _id.length === 24) {
      try {
        parseInt(_id, 16);
        _id = new ObjectId(_id);
        warehouse = await this.orderRepository.findOne({
          where: { _id },
        });
      } catch (error) {
        warehouse = null;
      }
    }
    return warehouse;
  }

  async findAllOrganizationOrders(organizationId: string): Promise<Order[]> {
    const product = await this.orderRepository.find({
      //@ts-ignore
      organizationId,
    });
    return product || null;
  }
  async findAllUserOrders(userId: string): Promise<Order[]> {
    const product = await this.orderRepository.find({
      //@ts-ignore
      userId,
    });
    return product || null;
  }

  async findAll(): Promise<Order[]> {
    return this.orderRepository.find();
  }
  async update(id: string, updateOrderDto: UpdateOrderDto) {
    try {
      const order = await this.findOne(id);

      if (order) {
        if (updateOrderDto.status) {
          if (!this.isOrderStatusValid(updateOrderDto.status)) {
            return { message: 'Invalid order starus.' };
          }
          order.status = updateOrderDto.status;
        }

        if (updateOrderDto.paymentStatus) {
          if (!this.isPaymentStatusStatusValid(updateOrderDto.paymentStatus)) {
            return { message: 'Invalid payment starus.' };
          }
          order.paymentStatus = updateOrderDto.paymentStatus;
        }

        if (updateOrderDto.products) {
          let price = 0;
          if (
            !updateOrderDto.products.every(
              (product: any) =>
                typeof product.id === 'string' &&
                typeof product.quantity === 'number'
            )
          ) {
            return { message: 'Invalid payment starus.' };
          }
          const allOrganizationsProducts =
            await this.warehouseService.findAllOrganizationCookedProducts(
              order.organizationId
            );
          const allProductIDsExist = updateOrderDto.products.every(
            (product) => {
              return allOrganizationsProducts.some((obj) => {
                const result = obj._id.toString() === product.id;
                if (result) {
                  price += product.quantity * obj.price;
                }
                return result;
              });
            }
          );

          if (!allProductIDsExist) {
            return { message: 'Products not found.' };
          }
          order.products=updateOrderDto.products;
          order.price = price;
        }

        await this.orderRepository.save(order);
        return { message: 'Order updated.' };
      }
      return { message: 'Order not found.' };
    } catch (error) {
      console.log(error);
      return { message: 'Internal server error.' };
    }
  }

  isOrderValid(obj: any): obj is Order {
    const currentDate = new Date(obj.deliveryDate);
    return (
      typeof obj.userId === 'string' &&
      typeof obj.organizationId === 'string' &&
     // typeof obj.price === 'number' &&
      Array.isArray(obj.products) &&
      obj.products.every(
        (product: any) =>
          typeof product.id === 'string' && typeof product.quantity === 'number'
      ) &&
      currentDate.toString() != 'Invalid Date' &&
      obj.address &&
      typeof obj.address.street === 'string' &&
      typeof obj.address.city === 'string' &&
      typeof obj.address.state === 'string' &&
      typeof obj.address.zipCode === 'number' &&
      typeof obj.address.country === 'string' &&
      typeof obj.address.latitude === 'number' &&
      typeof obj.address.longitude === 'number'
    );
  }

  isOrderStatusValid(role: any) {
    const validRoles = Object.values(OrderStatus);
    return validRoles.includes(role);
  }
  isPaymentMethodStatusValid(role: any) {
    const validRoles = Object.values(PaymentMethod);
    return validRoles.includes(role);
  }
  isPaymentStatusStatusValid(role: any) {
    const validRoles = Object.values(PaymentStatus);
    return validRoles.includes(role);
  }
}
