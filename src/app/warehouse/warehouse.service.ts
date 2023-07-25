import { Injectable } from '@nestjs/common';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { Warehouse } from './entities/warehouse.entity';
import { v4 as uuidv4 } from 'uuid';
import { OrganizationService } from '@nx-serverless/auth';
import { TransactionsService } from '../transactions/transactions.service';

@Injectable()
export class WarehouseService {
  constructor(
    private organizationService: OrganizationService,
    private transactionsService: TransactionsService
  ) {}

  //ще е само за админ
  async create(createWarehouseDto: CreateWarehouseDto) {
    try {
      createWarehouseDto.ogranizationId = 'global';
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
      const myProduct = await this.findAllOrganizationRecords(id);
      const globalProducts = await this.findAllGlobalProducts();
      if (myProduct.some((obj) => obj.name === globalProducts[0].name)) {
        return { message: 'Have already been added.' };
      }

      globalProducts.forEach((element) => {
        const newWarehouse = new Warehouse(element);
        newWarehouse.id = uuidv4();
        newWarehouse.ogranizationId = id;
        newWarehouse.save();
      });
      return { message: 'Successful add warehouse.' };
    } catch (error) {
      return { message: 'Warehouse add failed.' };
    }
  }

  async createOgranizationProduct(createWarehouseDto: CreateWarehouseDto) {
    try {
      const organirazion = await this.organizationService.findOne(
        createWarehouseDto.ogranizationId
      );
      if (organirazion) {
        const isDuplicate = await this.findDublicate(createWarehouseDto);
        if (isDuplicate.length > 0) {
          return { message: 'Warehouse exists.' };
        } else {
          createWarehouseDto.id = uuidv4();
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
    const allOrganizations = await Warehouse.scan().exec();
    return allOrganizations;
  }

  async findOne(id: string) {
    try {
      const organization = await Warehouse.get(id);
      return organization;
    } catch (err) {
      return undefined;
    }
  }
  async findAllGlobalProducts() {
    try {
      const result = await Warehouse.scan().exec();
      if (result.length > 0) {
        return result.filter((row: any) => row.ogranizationId == 'global');
      } else {
        return [];
      }
    } catch (err) {
      return [];
    }
  }
  async findAllOrganizationRecords(id: string) {
    try {
      const result = await Warehouse.scan().exec();
      if (result.length > 0) {
        return result.filter((row: any) => row.ogranizationId == id);
      } else {
        return [];
      }
    } catch (err) {
      return [];
    }
  }

  //само тестово
  async update(id: string, createWarehouseDto: CreateWarehouseDto) {
    try {
      const isDuplicate = await this.findDublicate(createWarehouseDto);
      if (isDuplicate.length > 0) {
        return { message: 'Warehouse exists.' };
      } else {
        const organization = await this.findOne(id);
        if (organization) {
          if (
            createWarehouseDto.name_en &&
            createWarehouseDto.name_bg &&
            createWarehouseDto.description_en &&
            createWarehouseDto.description_bg &&
            createWarehouseDto.price &&
            createWarehouseDto.tags &&
            createWarehouseDto.brand_name_en &&
            createWarehouseDto.brand_name_bg
          ) {
            organization.name_en = createWarehouseDto.name_en;
            organization.name_bg = createWarehouseDto.name_bg;
            organization.description_en = createWarehouseDto.description_en;
            organization.description_bg = createWarehouseDto.description_bg;
            organization.brand_name_en = createWarehouseDto.brand_name_en;
            organization.brand_name_bg = createWarehouseDto.brand_name_bg;
            organization.price = createWarehouseDto.price;
            organization.tags = createWarehouseDto.tags;
            await organization.save();
            return { message: 'Warehouse updated.' };
          }
        } else {
          return { message: 'Warehouse not found.' };
        }
        return { message: 'Warehouse update failed.' };
      }
    } catch (error) {
      return { message: 'Internal server error.' };
    }
  }
  async changeQuantities(id: string, value: number) {
    try {
      if (value && value != 0) {
        const organization = await this.findOne(id);
        if (organization) {
          const calculateQuantity = organization.quantity + value;
          if (calculateQuantity > 0) {
            organization.quantity = calculateQuantity;
            const log = await this.transactionsService.create({
              warehouseId: id,
              quantity: value,
            });
            console.log(log);
            await organization.save();
            return { message: 'Warehouse updated.' };
          }
          return { message: 'Warehouse update failed.' };
        } else {
          return { message: 'Warehouse not found.' };
        }
      }
      return { message: 'Invalid or null quantity.' };
    } catch (error) {
      return { message: 'Internal server error.' };
    }
  }

  /* async remove(id: string) {
      try {
        const organization = await this.findOne(id);
        if (organization) {
          await organization.delete();
          return { message: 'Organization deleted.' };
        }
        return { message: 'Organization not found.' };
      } catch (error) {
        return { message: 'Internal server error.' };
      }
    }*/

  async findDublicate(warehouse: CreateWarehouseDto) {
    const result = await Warehouse.scan().exec();
    const dublicate = result.filter(
      (row: any) =>
        row.name_en == warehouse.name_en &&
        row.ogranizationId == warehouse.ogranizationId
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
