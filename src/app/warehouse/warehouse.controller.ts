import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  UseGuards,
  Put,
  Request,
} from '@nestjs/common';
import { WarehouseService } from './warehouse.service';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { TokenVerification } from '@nx-serverless/auth';
import { Warehouse } from './entities/warehouse.entity';

@Controller('warehouse')
export class WarehouseController {
  constructor(private readonly warehouseService: WarehouseService) {}

  //ще е само за админ
  @Post()
  //@UseGuards(TokenVerification)
  async create(@Body() createWarehouseDto: Warehouse) {
    const result = await this.warehouseService.create(createWarehouseDto);
    switch (result.message) {
      case 'Warehouse add failed.':
        throw new HttpException(result, HttpStatus.BAD_REQUEST);
      case 'Successful add warehouse.':
        return { result, status: HttpStatus.CREATED };
      case 'Warehouse exists.':
        throw new HttpException(result, HttpStatus.CONFLICT);
      case 'Invalid fields entered.':
        throw new HttpException(result, HttpStatus.BAD_REQUEST);
      default:
        throw new HttpException(
          { message: 'Internal server error' },
          HttpStatus.INTERNAL_SERVER_ERROR
        );
    }
  }
  @Post('createOrganizationProduct')
  //@UseGuards(TokenVerification)
  async createOrganizationProduct(
    @Request() request,
    @Body() createWarehouseDto: Warehouse
  ) {
    const result = await this.warehouseService.createOgranizationProduct(
      createWarehouseDto,
      request
    );
    switch (result.message) {
      case 'Warehouse add failed.':
        throw new HttpException(result, HttpStatus.BAD_REQUEST);
      case 'Successful add warehouse.':
        return { result, status: HttpStatus.CREATED };
      case 'Warehouse exists.':
        throw new HttpException(result, HttpStatus.CONFLICT);
      case 'Organirazion not found.':
        throw new HttpException(result, HttpStatus.NOT_FOUND);
      case 'Ingredient not found.':
        throw new HttpException(result, HttpStatus.NOT_FOUND);
        case 'Invalid fields entered.':
          throw new HttpException(result, HttpStatus.BAD_REQUEST);
      default:
        throw new HttpException(
          { message: 'Internal server error' },
          HttpStatus.INTERNAL_SERVER_ERROR
        );
    }
  }
  @Post('auto/:id')
  //@UseGuards(TokenVerification)
  async autoCreate(@Param('id') id: string) {
    const result = await this.warehouseService.autoCreate(id);
    switch (result.message) {
      case 'Warehouse add failed.':
        throw new HttpException(result, HttpStatus.BAD_REQUEST);
      case 'Successful add warehouse.':
        return { result, status: HttpStatus.CREATED };
      case 'Have already been added.':
        throw new HttpException(result, HttpStatus.CONFLICT);
      default:
        throw new HttpException(
          { message: 'Internal server error' },
          HttpStatus.INTERNAL_SERVER_ERROR
        );
    }
  }
  @Get()
  //@UseGuards(TokenVerification)
  findAll() {
    return this.warehouseService.findAll();
  }
   @Get('find-all-organization-products/:id')
  // @UseGuards(TokenVerification)
  findAllOrganizationProducts(@Param('id') id: string) {
    return this.warehouseService.findAllOrganizationProducts(id);
  }
 
  @Get('find-all-organization-cooked-products/:id')
  // @UseGuards(TokenVerification)
  findAllOrganizationCookedProducts(@Param('id') id: string) {
    return this.warehouseService.findAllOrganizationCookedProducts(id);
  }

  @Get('find-all-global-products')
  //@UseGuards(TokenVerification)
  findAllGlobalProducts() {
    return this.warehouseService.findAllOrganizationProducts('global');
  }

  @Get('find-remaining-global/:id')
  // @UseGuards(TokenVerification)
  findRemainingGlobal(@Param('id') id: string) {
    return this.warehouseService.findRemainingGlobal(id);
  }
  
  @Get(':id')
  //@UseGuards(TokenVerification)
  findOne(@Param('id') id: string) {
    return this.warehouseService.findOne(id);
  }
  //ще е само за админ
  /*  @Post()
  @UseGuards(TokenVerification)
  async create(@Body() createWarehouseDto: CreateWarehouseDto) {
    const result = await this.warehouseService.create(createWarehouseDto);
    switch (result.message) {
      case 'Warehouse add failed.':
        throw new HttpException(result, HttpStatus.BAD_REQUEST);
      case 'Successful add warehouse.':
        return { result, status: HttpStatus.CREATED };
      case 'Warehouse exists.':
        throw new HttpException(result, HttpStatus.CONFLICT);
      default:
        throw new HttpException(
          { message: 'Internal server error' },
          HttpStatus.INTERNAL_SERVER_ERROR
        );
    }
  }
  @Post('createOrganizationProduct')
  @UseGuards(TokenVerification)
  async createOrganizationProduct(
    @Request() request,
    @Body() createWarehouseDto: CreateWarehouseDto
  ) {
    const result = await this.warehouseService.createOgranizationProduct(
      createWarehouseDto,
      request
    );
    switch (result.message) {
      case 'Warehouse add failed.':
        throw new HttpException(result, HttpStatus.BAD_REQUEST);
      case 'Successful add warehouse.':
        return { result, status: HttpStatus.CREATED };
      case 'Warehouse exists.':
        throw new HttpException(result, HttpStatus.CONFLICT);
      case 'Organirazion not found.':
        throw new HttpException(result, HttpStatus.NOT_FOUND);
      case 'Ingredient not found.':
        throw new HttpException(result, HttpStatus.NOT_FOUND);
      default:
        throw new HttpException(
          { message: 'Internal server error' },
          HttpStatus.INTERNAL_SERVER_ERROR
        );
    }
  }
  @Post('auto/:id')
  @UseGuards(TokenVerification)
  async autoCreate(@Param('id') id: string) {
    const result = await this.warehouseService.autoCreate(id);
    switch (result.message) {
      case 'Warehouse add failed.':
        throw new HttpException(result, HttpStatus.BAD_REQUEST);
      case 'Successful add warehouse.':
        return { result, status: HttpStatus.CREATED };
      case 'Have already been added.':
        throw new HttpException(result, HttpStatus.CONFLICT);
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
    return this.warehouseService.findAll();
  }
  @Get('find-all-organization-products/:id')
  @UseGuards(TokenVerification)
  findAllOrganizationProducts(@Param('id') id: string) {
    return this.warehouseService.findAllOrganizationProducts(id);
  }
  @Get('find-all-organization-cooked-products/:id')
  @UseGuards(TokenVerification)
  findAllOrganizationCookedProducts(@Param('id') id: string) {
    return this.warehouseService.findAllOrganizationCookedProducts(id);
  }
  @Get('find-all-global-products')
  @UseGuards(TokenVerification)
  findAllGlobalProducts() {
    return this.warehouseService.findAllGlobalProducts();
  }
  @Get('find-remaining-global/:id')
  @UseGuards(TokenVerification)
  findRemainingGlobal(@Param('id') id: string) {
    return this.warehouseService.findRemainingGlobal(id);
  }
  @Get(':id')
  @UseGuards(TokenVerification)
  findOne(@Param('id') id: string) {
    return this.warehouseService.findOne(id);
  }

  @Put('changeQuantities')
  @UseGuards(TokenVerification)
  async changeQuantities(
    @Body() { id, value, date }: { id: string; value: number; date: Date }
  ) {
    const result = await this.warehouseService.changeQuantities(
      id,
      value,
      date
    );
    switch (result.message) {
      case 'Warehouse updated.':
        return { result, status: HttpStatus.OK };
      case 'Warehouse not found.':
        throw new HttpException(result, HttpStatus.NOT_FOUND);
      case 'Warehouse update failed.':
        throw new HttpException(result, HttpStatus.BAD_REQUEST);
      case 'Internal server error.':
        throw new HttpException(result, HttpStatus.INTERNAL_SERVER_ERROR);
      case 'Invalid or null quantity.':
        throw new HttpException(result, HttpStatus.BAD_REQUEST);
      case 'Invalid or null quantity or or expiry date.':
        throw new HttpException(result, HttpStatus.BAD_REQUEST);
      case 'You cannot add cooked food with this function.':
        throw new HttpException(result, HttpStatus.BAD_REQUEST);
      case 'Not enough quantity.':
        throw new HttpException(result, HttpStatus.BAD_REQUEST);
      default:
        throw new HttpException(
          { message: 'Internal server error' },
          HttpStatus.INTERNAL_SERVER_ERROR
        );
    }
  }
  @Put('cook')
  @UseGuards(TokenVerification)
  async cook(
    @Body() { id, value, date }: { id: string; value: number; date: Date }
  ) {
    const result = await this.warehouseService.cook(id, value, date);
    switch (result.message) {
      case 'Warehouse updated.':
        return { result, status: HttpStatus.OK };
      case 'Warehouse not found.':
        throw new HttpException(result, HttpStatus.NOT_FOUND);
      case 'Warehouse update failed.':
        throw new HttpException(result, HttpStatus.BAD_REQUEST);
      case 'Internal server error.':
        throw new HttpException(result, HttpStatus.INTERNAL_SERVER_ERROR);
      case 'Invalid or null quantity.':
        throw new HttpException(result, HttpStatus.BAD_REQUEST);
      case 'Invalid or null quantity or or expiry date.':
        throw new HttpException(result, HttpStatus.BAD_REQUEST);
      case 'You cannot add cooked food with this function.':
        throw new HttpException(result, HttpStatus.BAD_REQUEST);
      case 'No sufficient quantity of the ingredients.':
        throw new HttpException(result, HttpStatus.BAD_REQUEST);
      case 'Not enough quantity.':
        throw new HttpException(result, HttpStatus.BAD_REQUEST);
      default:
        throw new HttpException(
          { message: 'Internal server error' },
          HttpStatus.INTERNAL_SERVER_ERROR
        );
    }
  }
  @Put('updateQuantity/:id')
  //@UseGuards(TokenVerification)
  async updateQuantity(
    @Param('id') id: string,
    @Body()
    { quantity, currentProducts }: { quantity: number; currentProducts: any }
  ) {
    const result = await this.warehouseService.updateQuantity(
      id,
      quantity,
      currentProducts
    );
    switch (result.message) {
      case 'Warehouse updated.':
        return { result, status: HttpStatus.OK };
      case 'Warehouse not found.':
        throw new HttpException(result, HttpStatus.NOT_FOUND);
      case 'Warehouse update failed.':
        throw new HttpException(result, HttpStatus.BAD_REQUEST);
      case 'Internal server error.':
        throw new HttpException(result, HttpStatus.INTERNAL_SERVER_ERROR);
        case 'Incorrect data.':
          throw new HttpException(result, HttpStatus.BAD_REQUEST);
      default:
        throw new HttpException(
          { message: 'Internal server error' },
          HttpStatus.INTERNAL_SERVER_ERROR
        );
    }
  }
  @Put('update-product/:id')
  @UseGuards(TokenVerification)
  async updateProduct(
    @Request() request,
    @Param('id') id: string,
    @Body() createWarehouseDto: CreateWarehouseDto
  ) {
    const result = await this.warehouseService.updateProduct(
      id,
      createWarehouseDto,
      request
    );
    switch (result.message) {
      case 'Warehouse updated.':
        return { result, status: HttpStatus.OK };
      case 'Warehouse not found.':
        throw new HttpException(result, HttpStatus.NOT_FOUND);
      case 'Warehouse update failed.':
        throw new HttpException(result, HttpStatus.BAD_REQUEST);
      case 'Internal server error.':
        throw new HttpException(result, HttpStatus.INTERNAL_SERVER_ERROR);
      default:
        throw new HttpException(result, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  @Put('update-cooked-product/:id')
  @UseGuards(TokenVerification)
  async updateCookedProduct(
    @Request() request,
    @Param('id') id: string,
    @Body() createWarehouseDto: CreateWarehouseDto
  ) {
    const result = await this.warehouseService.updateCookedProduct(
      id,
      createWarehouseDto,
      request
    );
    switch (result.message) {
      case 'Warehouse updated.':
        return { result, status: HttpStatus.OK };
      case 'Warehouse not found.':
        throw new HttpException(result, HttpStatus.NOT_FOUND);
      case 'Warehouse update failed.':
        throw new HttpException(result, HttpStatus.BAD_REQUEST);
      case 'Internal server error.':
        throw new HttpException(result, HttpStatus.INTERNAL_SERVER_ERROR);
      default:
        throw new HttpException(result, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  @UseGuards(TokenVerification)
  async remove(@Param('id') id: string) {
    const result = await this.warehouseService.remove(id);
    switch (result.message) {
      case 'Warehouse deleted.':
        return { result, status: HttpStatus.OK };
      case 'Warehouse not found.':
        throw new HttpException(result, HttpStatus.NOT_FOUND);
      case 'Internal server error.':
        throw new HttpException(result, HttpStatus.INTERNAL_SERVER_ERROR);
      default:
        throw new HttpException(
          { message: 'Internal server error' },
          HttpStatus.INTERNAL_SERVER_ERROR
        );
    }
  } */
}
