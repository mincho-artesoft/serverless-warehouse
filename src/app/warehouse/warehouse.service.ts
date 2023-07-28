import { Injectable, Inject } from '@nestjs/common';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { Warehouse } from './entities/warehouse.entity';
import { v4 as uuidv4 } from 'uuid';
import { OrganizationService } from '@nx-serverless/auth';
import { TransactionsService } from '../transactions/transactions.service';

@Injectable()
export class WarehouseService {
  constructor(
    @Inject(OrganizationService)
    public organizationService: OrganizationService,
    private transactionsService: TransactionsService
  ) {}

  //ще е само за админ
  async create(createWarehouseDto: CreateWarehouseDto) {
    try {
      createWarehouseDto.organizationId = 'global';
      const isDuplicate = await this.findDublicate(createWarehouseDto);
      if (isDuplicate.length > 0) {
        return { message: 'Warehouse exists.' };
      } else {
        createWarehouseDto.id = uuidv4();
        createWarehouseDto.quantity = 0;
        const newWarehouse = new Warehouse(createWarehouseDto);
        await newWarehouse.save();
        return { message: 'Successful add warehouse.' };
      }
    } catch (error) {
      return { message: 'Warehouse add failed.' };
    }
  }

  //ще е се извиква при създаване на организацията
  async autoCreate(id: string) {
    try {
      const myProduct = await this.findAllOrganizationProducts(id);
      const globalProducts = await this.findAllGlobalProducts();
      if (myProduct.some((obj) => obj.name === globalProducts[0].name)) {
        return { message: 'Have already been added.' };
      }

      globalProducts.forEach((element) => {
        const newWarehouse = new Warehouse(element);
        newWarehouse.id = uuidv4();
        newWarehouse.organizationId = id;
        newWarehouse.save();
      });
      return { message: 'Successful add warehouse.' };
    } catch (error) {
      return { message: 'Warehouse add failed.' };
    }
  }

  //да се проверява дали потребителя има роля в дадената организация?
  async createOgranizationProduct(
    createWarehouseDto: CreateWarehouseDto,
    request: any
  ) {
    try {
      const organirazion = await this.organizationService.findOne(
        createWarehouseDto.organizationId
      );
      if (organirazion) {
        const isDuplicate = await this.findDublicate(createWarehouseDto);
        if (isDuplicate.length > 0) {
          return { message: 'Warehouse exists.' };
        } else {
          if (!createWarehouseDto.ingredients) {
            createWarehouseDto.ingredients = [];
          }
          if (createWarehouseDto.ingredients.length > 0) {
            for (const item of createWarehouseDto.ingredients) {
              const result = await this.findOne(item.productId);
              if (!result) {
                return { message: 'Ingredient not found.' };
              }
            }
          }
          createWarehouseDto.id = uuidv4();
          createWarehouseDto.quantity = 0;
          const newWarehouse = new Warehouse(createWarehouseDto);

          await newWarehouse.save();
          return { message: 'Successful add warehouse.' };
        }
      } else {
        return { message: 'Organirazion not found.' };
      }
    } catch (error) {
      return { message: 'Warehouse add failed.' };
    }
  }

  async findAll() {

    const allWarehouses = await Warehouse.scan().exec();
    return allWarehouses;
  }

  async findOne(id: string) {
    try {
      const warehouse = await Warehouse.get(id);
      return warehouse;
    } catch (err) {
      return undefined;
    }
  }

  async findAllGlobalProducts() {
    try {
      const result = await Warehouse.scan().exec();
      if (result.length > 0) {
        return result.filter((row: any) => row.organizationId == 'global');
      } else {
        return [];
      }
    } catch (err) {
      return [];
    }
  }

  async findAllOrganizationProducts(id: string) {
    try {
      const result = await Warehouse.scan().exec();
      if (result.length > 0) {
        return result.filter(
          (row: any) => row.organizationId == id && row.ingredients.length == 0
        );
      } else {
        return [];
      }
    } catch (err) {
      return [];
    }
  }

  async findAllOrganizationCookedProducts(id: string) {
    try {
      const result = await Warehouse.scan().exec();
      if (result.length > 0) {
        return result.filter(
          (row: any) => row.organizationId == id && row.ingredients.length > 0
        );
      } else {
        return [];
      }
    } catch (err) {
      return [];
    }
  }

  async findRemainingGlobal(id: string) {
    try {
      const organirazion = await this.organizationService.findOne(id);
      if (organirazion) {
        const result = await Warehouse.scan().exec();
        if (result.length > 0) {
          const organizationProducts = result.filter(
            (row: any) => row.organizationId == id
          );
          const globalProducts = result.filter(
            (row: any) => row.organizationId == 'global'
          );
          const uniqueProducts = globalProducts.filter((obj1) => {
            const isDuplicate = organizationProducts.some(
              (obj2) => obj2.name_en === obj1.name_en
            );
            return !isDuplicate;
          });
          return uniqueProducts;
        } else {
          return [];
        }
      }
      return { message: 'Organirazion not found.' };
    } catch (err) {
      return [];
    }
  }

  async updateProduct(
    id: string,
    createWarehouseDto: CreateWarehouseDto,
    request: any
  ) {
    try {
      if (
        !request['user'].roles.includes('admin') &&
        createWarehouseDto.organizationId == 'global'
      ) {
        return { message: 'You cant change global products.' };
      }

      const warehouse = await this.findOne(id);
      if (warehouse) {
        if (
          createWarehouseDto.name.length > 0 &&
          createWarehouseDto.description.length > 0 &&
          createWarehouseDto.price &&
          createWarehouseDto.tags &&
          createWarehouseDto.brand_name &&
          warehouse.ingredients.length == 0
        ) {
          warehouse.name = createWarehouseDto.name;
          warehouse.description = createWarehouseDto.description;
          warehouse.brand_name = createWarehouseDto.brand_name;
          warehouse.price = createWarehouseDto.price;
          warehouse.tags = createWarehouseDto.tags;
          await warehouse.save();
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
    createWarehouseDto: CreateWarehouseDto,
    request: any
  ) {
    try {
      if (
        !request['user'].roles.includes('admin') &&
        createWarehouseDto.organizationId == 'global'
      ) {
        return { message: 'You cant change global products.' };
      }

      const warehouse = await this.findOne(id);
      if (warehouse) {
        if (
          createWarehouseDto.name.length > 0 &&
          createWarehouseDto.description.length > 0 &&
          createWarehouseDto.price &&
          createWarehouseDto.tags &&
          createWarehouseDto.brand_name &&
          createWarehouseDto.ingredients.length > 0 &&
          warehouse.ingredients.length > 0
        ) {
          warehouse.name = createWarehouseDto.name;
          warehouse.description = createWarehouseDto.description;
          warehouse.brand_name = createWarehouseDto.brand_name;
          warehouse.price = createWarehouseDto.price;
          warehouse.tags = createWarehouseDto.tags;
          warehouse.ingredients = createWarehouseDto.ingredients;
          await warehouse.save();
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

  async changeQuantities(id: string, value: number, date: Date) {
    const result = { message: '', warning: '' };
    try {
      if (value && value != 0) {
        const warehouse = await this.findOne(id);
        if (warehouse) {
          const expirationDate = new Date(date);
          const currentDate = new Date();
          if (
            value > 0 &&
            date &&
            currentDate < expirationDate &&
            warehouse.ingredients.length == 0
          ) {
            const calculateQuantity = warehouse.quantity + value;
            warehouse.quantity = calculateQuantity;

            const log = await this.transactionsService.create({
              warehouseId: id,
              quantity: value,
            });
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
            await warehouse.save();
            result.message = 'Warehouse updated.';
            return result;
          } else if (
            value > 0 &&
            date &&
            currentDate < expirationDate &&
            warehouse.ingredients.length > 0
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
            warehouse.currentProducts.sort(
              (a, b) => a.expirationDate - b.expirationDate
            );
            while (issued > 0 && i < warehouse.currentProducts.length) {
              const current = warehouse.currentProducts[i];
              if (current.expirationDate > currentDate) {
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
              const log = await this.transactionsService.create({
                warehouseId: id,
                quantity: value,
              });
              console.log(log);
              if (log.message != 'Successful add WarehouseTransactio.') {
                result.message = 'Warehouse update failed.';
                return result;
              }
              await warehouse.save();
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
          const newProduct = [];
          warehouse.currentProducts.sort(
            (a, b) => a.expirationDate - b.expirationDate
          );
          while (issued > 0 && i < warehouse.currentProducts.length) {
            const current = warehouse.currentProducts[i];
            if (current.expirationDate > currentDate) {
              if (current.quantity <= issued) {
                issued -= current.quantity;
              } else {
                current.quantity -= issued;
                issued = 0;
                newProduct.push(current);
              }
            } else {
              result.warning = true;
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
        currentDate < expirationDate &&
        warehouse.ingredients.length > 0
      ) {
        const checkedIngredients = warehouse.ingredients.map((item) => ({
          ...item,
        }));
        let checked = false;
        for (let i = 0; i < warehouse.ingredients.length; i++) {
          const currentRes = await this.checkQuantities(
            warehouse.ingredients[i].id,
            value * warehouse.ingredients[i].value
          );
          checkedIngredients[i].result = currentRes;
        }

        checked = !checkedIngredients.some(
          (obj) => obj.result.sufficientQuantity == false
        );

        if (checked) {
          for (const ingredient of warehouse.ingredients) {
            this.changeQuantities(
              ingredient.id,
              -value * ingredient.value,
              new Date()
            );
          }

          const calculateQuantity = warehouse.quantity + value;
          warehouse.quantity = calculateQuantity;

          const log = await this.transactionsService.create({
            warehouseId: id,
            quantity: value,
          });

          console.log(log);
          if (log.message != 'Successful add WarehouseTransactio.') {
            result.message = 'Warehouse update failed.';
            return result;
          }

          warehouse.currentProducts.push({
            quantity: value,
            expirationDate: date,
          });

          await warehouse.save();
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

  async updateQuantity(id: string, quantity: number, currentProducts: any) {
    try {
      const warehouse = await this.findOne(id);
      if (warehouse) {
        if (typeof quantity == 'number' && quantity >= 0 && currentProducts) {
          warehouse.quantity = quantity;
          warehouse.currentProducts = currentProducts;
          const log = await this.transactionsService.create({
            warehouseId: id,
            quantity: quantity,
            type: 'revision',
          });
          let sum = 0;
          currentProducts.forEach((element) => {
            sum += element.quantity;
          });
          if(quantity != sum){
            return { message: 'Incorrect data.'};
          }
          console.log(log);
          if (log.message != 'Successful add WarehouseTransactio.') {
            return { message: 'Warehouse update failed.' };
          }

          await warehouse.save();
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
  async remove(id: string) {
    try {
      const warehouse = await this.findOne(id);
      if (warehouse) {
        await warehouse.delete();
        return { message: 'Warehouse deleted.' };
      }
      return { message: 'Warehouse not found.' };
    } catch (error) {
      return { message: 'Internal server error.' };
    }
  }

  async findDublicate(warehouse: CreateWarehouseDto) {
    const result = await Warehouse.scan().exec();
    const dublicate = result.filter(
      (row: any) =>
        row.name[0].value == warehouse.name[0].value &&
        row.organizationId == warehouse.organizationId
    );

    return dublicate;
  }
  /*replaceFields(obj1: any, obj2: any) {
    for (let key in obj1) {
      if (obj2.hasOwnProperty(key)) {
        if (obj2[key].length > 0) {
          obj1[key] = obj2[key];
        }
      }
    }
  }*/
}
