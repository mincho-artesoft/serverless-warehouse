import { Injectable, Inject } from '@nestjs/common';
import { Warehouse } from './models/entities/warehouse.entity';
import { OrganizationService } from '@nx-serverless/auth';
import { TransactionsService } from '../transactions/transactions.service';
import { Repository } from 'typeorm';
import { ObjectId } from 'mongodb';
import { InjectRepository } from '@nestjs/typeorm';
import { WarehouseTransaction } from '../transactions/entities/transaction.entity';
import { ICurrentProduct } from './models/current-product.interfate';
import { UpdateCookedProductWarehouseDto } from './models/dto/update-cooked-product-warehouse.dto';
import { UpdateProductWarehouseDto } from './models/dto/update-product-warehouse.dto';

@Injectable()
export class WarehouseService {
  constructor(
    @Inject(OrganizationService)
    public organizationService: OrganizationService,
    private transactionsService: TransactionsService,
    @InjectRepository(Warehouse)
    private warehouseRepository: Repository<Warehouse>
  ) {}

  //admin
  async create(createWarehouseDto: any) {
    try {
      if (!this.isWarehouseObject(createWarehouseDto)) {
        return { message: 'Invalid fields entered.' };
      }

      const validWarehouseObject: Warehouse = {
        name: createWarehouseDto.name,
        brand_name: createWarehouseDto.brand_name,
        description: createWarehouseDto.description,
        organizationId: 'global',
        unit: createWarehouseDto.unit,
        quantity: createWarehouseDto.quantity,
        tags: createWarehouseDto.tags,
        price: 0,
        currentProducts: undefined,
        ingredients: undefined,
        images: []
      } as Warehouse;

      createWarehouseDto = validWarehouseObject;


      const isDuplicate = await this.findDublicate(createWarehouseDto);
      if (isDuplicate) {
        return { message: 'Warehouse exists.' };
      } else {
        if (!createWarehouseDto.tags) {
          createWarehouseDto.tags = [];
        }
        await this.warehouseRepository.save(createWarehouseDto);
        return { message: 'Successful add warehouse.' };
      }
    } catch (error) {
      console.log(error);
      return { message: 'Warehouse add failed.' };
    }
  }

  //ще е се извиква при създаване на организацията
  async autoCreate(id: string) {
    try {
      const myProduct = await this.findAllOrganizationProducts(id);
      const globalProducts = await this.findAllOrganizationProducts('global');
      if (
        myProduct.some(
          (obj) =>
            obj.name[0].value === globalProducts[0].name[0].value &&
            obj.name[0].key === globalProducts[0].name[0].key
        )
      ) {
        return { message: 'Have already been added.' };
      }

      globalProducts.forEach((element) => {
        const validWarehouseObject: Warehouse = {
          name: element.name,
          brand_name: element.brand_name,
          description: element.description,
          organizationId: id,
          unit: element.unit,
          quantity: element.quantity,
          tags: element.tags,
          price: element.price,
          currentProducts: [],
          ingredients: element.ingredients,
          images: []
        } as Warehouse;
        this.warehouseRepository.save(validWarehouseObject);
      });
      return { message: 'Successful add warehouse.' };
    } catch (error) {
      return { message: 'Warehouse add failed.' };
    }
  }

  //да се проверява дали потребителя има роля в дадената организация?
  async createOgranizationProduct(createWarehouseDto: any, request: any) {
    try {
      if (!createWarehouseDto.ingredients) {
        createWarehouseDto.ingredients = null;
      }
      if (!this.isWarehouseObject(createWarehouseDto)) {
        return { message: 'Invalid fields entered.' };
      }

      if (createWarehouseDto.organizationId == 'global') {
        return {
          message: 'Global products cannot be added using this method.',
        };
      }
      const validWarehouseObject: Warehouse = {
        name: createWarehouseDto.name,
        brand_name: createWarehouseDto.brand_name,
        description: createWarehouseDto.description,
        organizationId: createWarehouseDto.organizationId,
        unit: createWarehouseDto.unit,
        quantity: 0,
        tags: createWarehouseDto.tags,
        price: createWarehouseDto.price,
        currentProducts: [],
        ingredients: createWarehouseDto.ingredients,
        images: []
      } as Warehouse;

      createWarehouseDto = validWarehouseObject;

      const organirazion = await this.organizationService.findOne(
        createWarehouseDto.organizationId
      );
      if (organirazion) {
        const isDuplicate = await this.findDublicate(createWarehouseDto);
        if (isDuplicate) {
          return { message: 'Warehouse exists.' };
        } else {
          if (createWarehouseDto.ingredients) {
            for (const item of createWarehouseDto.ingredients) {
              const result = await this.findOrganizationProduct(
                item.productId,
                createWarehouseDto.organizationId
              );
              if (!result) {
                return { message: 'Ingredient not found.' };
              }
            }
          }
          await this.warehouseRepository.save(validWarehouseObject);

          return { message: 'Successful add warehouse.' };
        }
      } else {
        return { message: 'Organirazion not found.' };
      }
    } catch (error) {
      return { message: 'Warehouse add failed.' };
    }
  }

  async findOne(_id: any): Promise<Warehouse | null> {
    let warehouse = null;
    if (_id.length === 12 || _id.length === 24) {
      try {
        parseInt(_id, 16);
        _id = new ObjectId(_id);
        warehouse = await this.warehouseRepository.findOne({
          where: { _id },
        });
      } catch (error) {
        warehouse = null;
      }
    }
    return warehouse;
  }

  async findAllOrganizationProducts(
    organizationId: string
  ): Promise<Warehouse[]> {
    const ingredients = null;
    const product = await this.warehouseRepository.find({
      //@ts-ignore
      organizationId,
      ingredients,
    });
    return product || null;
  }
  async findOrganizationProduct(
    _id: any,
    organizationId: string
  ): Promise<Warehouse | null> {
    let product = null;
    const ingredients = null;
    if (_id.length === 12 || _id.length === 24) {
      try {
        parseInt(_id, 16);
        _id = new ObjectId(_id);
        product = await this.warehouseRepository.findOne({
          //@ts-ignore
          _id, 
          organizationId,
          ingredients,
        });
      } catch (error) {
        product = null;
      }
    }
    return product || null;
  }

  async findAllOrganizationCookedProducts(
    organizationId: string
  ): Promise<Warehouse[]> {
    const ingredients = null;
    const product = await this.warehouseRepository.find({
      //@ts-ignore
      organizationId,
      ingredients: { $ne: ingredients },
    });
    return product || null;
  }

  async findRemainingGlobal(id: string) {
    try {
      const organirazion = await this.organizationService.findOne(id);
      if (organirazion) {
        const organizationProducts = await this.findAllOrganizationProducts(id);
        const globalProducts = await this.findAllOrganizationProducts('global');

        const uniqueProducts = globalProducts.filter((obj1) => {
          const isDuplicate = organizationProducts.some(
            (obj2) =>
              obj2.name[0].key === obj1.name[0].key &&
              obj2.name[0].value === obj1.name[0].value
          );
          return !isDuplicate;
        });
        return uniqueProducts;
      }
      return { message: 'Organirazion not found.' };
    } catch (err) {
      return [];
    }
  }

  async findAll(): Promise<Warehouse[]> {
    return this.warehouseRepository.find();
  }

  //да се добавят права за организацията
  async updateProduct(
    id: string,
    createWarehouseDto: UpdateProductWarehouseDto,
    request: any
  ) {
    try {
      const warehouse = await this.findOne(id);
      if (warehouse) {
        if (
          createWarehouseDto.name.length > 0 &&
          createWarehouseDto.description.length > 0 &&
          createWarehouseDto.price &&
          createWarehouseDto.tags &&
          createWarehouseDto.unit &&
          createWarehouseDto.brand_name &&
          createWarehouseDto.images &&
          !warehouse.ingredients
        ) {
          if (
            (!request['user'].roles.includes('admin') &&
              createWarehouseDto.organizationId == 'global') ||
            (warehouse.organizationId == 'global' &&
              !request['user'].roles.includes('admin'))
          ) {
            return { message: 'You cant change global products.' };
          }
          warehouse.name = createWarehouseDto.name;
          warehouse.description = createWarehouseDto.description;
          warehouse.brand_name = createWarehouseDto.brand_name;
          warehouse.price = createWarehouseDto.price;
          warehouse.unit = createWarehouseDto.unit
          warehouse.tags = createWarehouseDto.tags;
          warehouse.images = createWarehouseDto.images;

          await this.warehouseRepository.save(warehouse);
          return { message: 'Warehouse updated.' };
        }
      } else {
        return { message: 'Warehouse not found.' };
      }
      return { message: 'Warehouse update failed.' };
    } catch (error) {
      return { message: 'Internal server error.' };
    }
  }

  async updateCookedProduct(
    id: string,
    createWarehouseDto: UpdateCookedProductWarehouseDto,
    request: any
  ) {
    try {
      const warehouse = await this.findOne(id);
      
      if (warehouse) {
        if (
          createWarehouseDto.name.length > 0 &&
          createWarehouseDto.description.length > 0 &&
          createWarehouseDto.price &&
          createWarehouseDto.tags &&
          createWarehouseDto.brand_name &&
          createWarehouseDto.ingredients.length > 0 &&
          createWarehouseDto.unit &&
          createWarehouseDto.images &&
          warehouse.ingredients
        ) {
          if (
            (!request['user'].roles.includes('admin') &&
              createWarehouseDto.organizationId == 'global') ||
            (warehouse.organizationId == 'global' &&
              !request['user'].roles.includes('admin'))
          ) {
            return { message: 'You cant change global products.' };
          }
          for (const item of createWarehouseDto.ingredients) {
            const result = await this.findOrganizationProduct(
              item.productId,
              createWarehouseDto.organizationId
            );
            if (!result) {
              return { message: 'Ingredient not found.' };
            }
          }
          warehouse.name = createWarehouseDto.name;
          warehouse.description = createWarehouseDto.description;
          warehouse.brand_name = createWarehouseDto.brand_name;
          warehouse.price = createWarehouseDto.price;
          warehouse.tags = createWarehouseDto.tags;
          warehouse.ingredients = createWarehouseDto.ingredients;
          warehouse.unit = createWarehouseDto.unit;
          warehouse.images = createWarehouseDto.images;
          await this.warehouseRepository.save(warehouse);
          return { message: 'Warehouse updated.' };
        }
      } else {
        return { message: 'Warehouse not found.' };
      }
      return { message: 'Warehouse update failed.' };
    } catch (error) {
      return { message: error.message };
    }
  }

  async remove(id: string) {
    try {
      const warehouse = await this.findOne(id);
      if (warehouse) {
        await this.warehouseRepository.remove(warehouse);
        return { message: 'Warehouse deleted.' };
      }
      return { message: 'Warehouse not found.' };
    } catch (error) {
      return { message: 'Internal server error.' };
    }
  }

  async updateQuantity(id: string, quantity: number, currentProducts: ICurrentProduct[]) {
    try {
      const warehouse = await this.findOne(id);
      if (warehouse) {
        if (warehouse.organizationId == 'global') {
          return { message: 'You cant change global products.' };
        }
        if (typeof quantity == 'number' && quantity >= 0 && currentProducts) {

          let sum = 0;
          const validateProducts=[];

          if(!this.isCurrentProductsValid(currentProducts)){
            return { message: 'Invalid or null quantity or or expiry date.' };
          }

          for (const element of currentProducts) {
            sum += element.quantity;
            validateProducts.push({quantity:element.quantity, expirationDate:element.expirationDate});
          }
          if (quantity != sum) {
            return { message: 'Incorrect data.' };
          }
          warehouse.quantity = quantity;
          warehouse.currentProducts = validateProducts;
          const log = await this.transactionsService.create(
            new WarehouseTransaction(id, quantity, 'revision')
          );
          console.log(log);
          if (log.message != 'Successful add WarehouseTransactio.') {
            return { message: 'Warehouse update failed.' };
          }

          await this.warehouseRepository.save(warehouse);
          return { message: 'Warehouse updated.' };
        }
      } else {
        return { message: 'Warehouse not found.' };
      }
      return { message: 'Warehouse update failed.' };
    } catch (error) {
      return { message: 'Internal server error.' };
    }
  }

  async changeQuantities(id: string, value: number, date: Date) {
    const result = { message: '', warning: '' };
    try {
      if (value && value != 0) {
        const warehouse = await this.findOne(id);
        if (warehouse) {
          if (warehouse.organizationId == 'global') {
            return { message: 'You cant change global products.' };
          }
          const expirationDate = new Date(date);
          const currentDate = new Date();
          if (
            value > 0 &&
            date &&
            currentDate < expirationDate &&
            !warehouse.ingredients
          ) {
            const calculateQuantity = warehouse.quantity + value;
            warehouse.quantity = calculateQuantity;

            const log = await this.transactionsService.create(new WarehouseTransaction(
               id,
               value
            ));
            console.log(log);
            if (log.message != 'Successful add WarehouseTransactio.') {
              result.message = 'Warehouse update failed.';
              return result;
            }
            warehouse.currentProducts.some((a) => {
              if (a.expirationDate < currentDate) {
                result.warning = 'There are unfit products in the warehouse.';
              }
            });
            warehouse.currentProducts.push({
              quantity: value,
              expirationDate: date,
            });
            await this.warehouseRepository.save(warehouse);
            result.message = 'Warehouse updated.';
            return result;
          } else if (
            value > 0 &&
            date &&
            currentDate < expirationDate &&
            warehouse.ingredients
          ) {
            result.message = 'You cannot add cooked food with this function.';
            return result;
            //  const calculateQuantity = warehouse.quantity + value;
            //   warehouse.quantity = calculateQuantity;

            //   const log = await this.transactionsService.create({
            //     warehouseId: id,
            //     quantity: value,
            //   });
            //   console.log(log);
            //   if (log.message != 'Successful add WarehouseTransactio.') {
            //     result.message = 'Warehouse update failed.';
            //     return result;
            //   }
            //   warehouse.currentProducts.some((a) => {
            //     if (a.expirationDate < currentDate) {
            //       result.warning = 'There are unfit products in the warehouse.';
            //     }
            //   });
            //   warehouse.currentProducts.push({
            //     quantity: value,
            //     expirationDate: date,
            //   });
            //   await warehouse.save();
            //   result.message = 'Warehouse updated.';
            //   return result;
          } else if (value < 0) {
            let issued: number = Math.abs(value);
            let i = 0;
            const newProduct = [];
            warehouse.currentProducts.sort((a: any, b: any) => {
              const dateA = new Date(a.expirationDate);
              const dateB = new Date(b.expirationDate);
            
              return dateA.getTime() - dateB.getTime();
            });
            while (issued > 0 && i < warehouse.currentProducts.length) {
              const current = warehouse.currentProducts[i];
              if (new Date(current.expirationDate) > currentDate) {
                if (current.quantity <= issued) {
                  issued -= current.quantity;
                } else {
                  current.quantity -= issued;
                  issued = 0;
                  newProduct.push(current);
                }
              } else {
                result.warning = 'There are unfit products in the warehouse.';
                newProduct.push(current);
              }
              i++;
            }
            newProduct.push(
              ...warehouse.currentProducts.splice(
                i,
                warehouse.currentProducts.length - 1
              )
            );
            if (issued == 0) {
              warehouse.quantity = warehouse.quantity + value;
              warehouse.currentProducts = newProduct;
              const log = await this.transactionsService.create(new WarehouseTransaction(
                id,
                value,
              ));
              console.log(log);
              if (log.message != 'Successful add WarehouseTransactio.') {
                result.message = 'Warehouse update failed.';
                return result;
              }
              await this.warehouseRepository.save(warehouse);
              result.message = 'Warehouse updated.';
              return result;
            }
            result.message = 'Not enough quantity.';
            return result;
          }
        } else {
          result.message = 'Warehouse not found.';
          return result;
        }
      }
      result.message = 'Invalid or null quantity or or expiry date.';
      return result;
    } catch (error) {
      result.message = 'Internal server error.';
      return result;
    }
  }
  async checkQuantities(id: string, value: number) {
    const result = { sufficientQuantity: false, warning: false };
    try {
      if (value && value != 0) {
        const warehouse = await this.findOne(id);
        if (warehouse) {
          const currentDate = new Date();

          let issued: number = Math.abs(value);
          let i = 0;
          warehouse.currentProducts.sort((a: any, b: any) => {
            const dateA = new Date(a.expirationDate);
            const dateB = new Date(b.expirationDate);
          
            return dateA.getTime() - dateB.getTime();
          });
          while (issued > 0 && i < warehouse.currentProducts.length) {
            const current = warehouse.currentProducts[i];
            if (new Date(current.expirationDate) > currentDate) {
              if (current.quantity <= issued) {
                issued -= current.quantity;
              } else {
                current.quantity -= issued;
                issued = 0;
              }
            } else {
              result.warning = true;
            }
            i++;
          }
          if (issued == 0) {
            result.sufficientQuantity = true;
            return result;
          }
          result.sufficientQuantity = false;
          return result;
        } else {
          result.sufficientQuantity = false;
          return result;
        }
      }
      result.sufficientQuantity = false;
      return result;
    } catch (error) {
      result.sufficientQuantity = false;
      return result;
    }
  }
  async cook(id: string, value: number, date: Date) {
    const result = { message: '', spoiledIngredients: Array };
    try {
      const warehouse = await this.findOne(id);
      const expirationDate = new Date(date);
      const currentDate = new Date();
      if (
        value &&
        warehouse &&
        value > 0 &&
        date &&
        currentDate < expirationDate 
      ) {
        if(!warehouse.ingredients){
          result.message = 'Only the products that have composition can be added with this function.';
          return result
        }
        const checkedIngredients:any = warehouse.ingredients.map((item) => ({
          ...item,
        }));
        let checked = false;
        for (let i = 0; i < warehouse.ingredients.length; i++) {
          const currentRes = await this.checkQuantities(
            warehouse.ingredients[i].productId,
            value * warehouse.ingredients[i].quantity
          );
          checkedIngredients[i].result = currentRes;
        }

        checked = !checkedIngredients.some(
          (obj) => obj.result.sufficientQuantity == false
        );

        if (checked) {
          for (const ingredient of warehouse.ingredients) {
            this.changeQuantities(
              ingredient.productId,
              -value * ingredient.quantity,
              new Date()
            );
          }

          const calculateQuantity = warehouse.quantity + value;
          warehouse.quantity = calculateQuantity;

          const log = await this.transactionsService.create(new WarehouseTransaction(
            id,
            value
          ));

          console.log(log);
          if (log.message != 'Successful add WarehouseTransactio.') {
            result.message = 'Warehouse update failed.';
            return result;
          }

          warehouse.currentProducts.push({
            quantity: value,
            expirationDate: date,
          });

          await this.warehouseRepository.save(warehouse);
          result.message = 'Warehouse updated.';
          return result;
        } else {
          const resultArray = checkedIngredients.filter(
            (obj) => obj.result.sufficientQuantity == false
          );
          result.message = 'No sufficient quantity of the ingredients.';
          result.spoiledIngredients = resultArray;
          return result;
        }
      }
      result.message = 'Invalid or null quantity or or expiry date.';
      return result;
    } catch (error) {
      result.message = 'Internal server error.';
      return result;
    }
  }
  async findDublicate(warehouse: Warehouse) {
    const name = warehouse.name;
    const organizationId = warehouse.organizationId;

    const warehouseDB = await this.warehouseRepository.findOne({
      //@ts-ignore
      name,
      organizationId,
    });

    return warehouseDB;
  }
  isWarehouseObject(obj: any): obj is Warehouse {
    return (
      (!('name' in obj) || this.isItemValid(obj.name)) &&
      (!('brand_name' in obj) || typeof obj.brand_name === 'string') &&
      (!('description' in obj) || this.isItemValid(obj.description)) &&
      (!('organizationId' in obj) || typeof obj.organizationId === 'string') &&
      (!('unit' in obj) || typeof obj.unit === 'string') &&
      (!('quantity' in obj) || typeof obj.quantity === 'number') &&
      (!('tags' in obj) || Array.isArray(obj.tags)) &&
      (!('price' in obj) || typeof obj.price === 'number') &&
      (!('currentProducts' in obj) ||
        this.isCurrentProductsValid(obj.currentProducts)) &&
      (!('ingredients' in obj) ||
        this.isIngredientsProductsValid(obj.ingredients))
    );
  }
  isCurrentProductsValid(items: any): boolean {
    let result = true;
    for (const key in items) {
      const currentDate = new Date(items[key].expirationDate);
      if (
        typeof items[key].quantity === 'number' &&
        currentDate.toString() != 'Invalid Date'
      ) {
        result = true;
      } else {
        result = false;
      }
      if (result == false) {
        return false;
      }
    }
    return result;
  }
  isIngredientsProductsValid(items: any): boolean {
    let result = true;
    for (const key in items) {
      if (
        typeof items[key].quantity === 'number' &&
        typeof items[key].productId === 'string'
      ) {
        result = true;
      } else {
        result = false;
      }
      if (result == false) {
        return false;
      }
    }
    return result;
  }
  isItemValid(items: any): boolean {
    let result = true;
    for (const item of items) {
      if (typeof item.key === 'string' && typeof item.value === 'string') {
        result = true;
      } else {
        result = false;
      }
      if (result == false) {
        return false;
      }
    }
    return result;
  }
}
