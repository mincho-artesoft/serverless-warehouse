import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  UseGuards,
  Put,
} from '@nestjs/common';
import { WarehouseService } from './warehouse.service';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { TokenVerification } from '@nx-serverless/auth';

@Controller('warehouse')
export class WarehouseController {
  constructor(private readonly warehouseService: WarehouseService) {}

  //ще е само за админ
  @Post()
  //@UseGuards(TokenVerification)
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
          { message: 'Warehouse add failed.' },
          HttpStatus.BAD_REQUEST
        );
    }
  }
  @Post('new')
  //@UseGuards(TokenVerification)
  async createNew(@Body() createWarehouseDto: CreateWarehouseDto) {
    const result = await this.warehouseService.createOgranizationProduct(
      createWarehouseDto
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
      default:
        throw new HttpException(
          { message: 'Warehouse add failed.' },
          HttpStatus.BAD_REQUEST
        );
    }
  }
  @Post(':id')
  //@UseGuards(TokenVerification)
  async autoCreate(@Param('id') id: string) {
    const result = await this.warehouseService.autoCreate(id);
    switch (result.message) {
      case 'Warehouse add failed.':
        throw new HttpException(result, HttpStatus.BAD_REQUEST);
      case 'Successful add warehouse.':
        return { result, status: HttpStatus.CREATED };
      case 'Warehouse exists.':
        throw new HttpException(result, HttpStatus.CONFLICT);
      case 'Have already been added.':
        throw new HttpException(result, HttpStatus.CONFLICT);

      default:
        throw new HttpException(
          { message: 'Warehouse add failed.' },
          HttpStatus.BAD_REQUEST
        );
    }
  }

  @Get()
  //@UseGuards(TokenVerification)
  findAll() {
    return this.warehouseService.findAll();
  }

  @Get(':id')
  //@UseGuards(TokenVerification)
  findOne(@Param('id') id: string) {
    return this.warehouseService.findOne(id);
  }

  @Get('find-all-organization-records/:id')
  //@UseGuards(TokenVerification)
  findAllOrganizationRecords(@Param('id') id: string) {
    return this.warehouseService.findAllOrganizationRecords(id);
  }

  @Put('changeQuantities')
  //@UseGuards(TokenVerification)
  async changeQuantities(
    @Body() { id, value }: { id: string; value: number }
  ) {
    const result = await this.warehouseService.changeQuantities(id, value);
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
      default:
        throw new HttpException(
          { message: 'Internal server error' },
          HttpStatus.INTERNAL_SERVER_ERROR
        );
    }
  }
  @Put(':id')
  //@UseGuards(TokenVerification)
  async update(
    @Param('id') id: string,
    @Body() createWarehouseDto: CreateWarehouseDto
  ) {
    const result = await this.warehouseService.update(id, createWarehouseDto);
    switch (result.message) {
      case 'Warehouse updated.':
        return { result, status: HttpStatus.OK };
      case 'Warehouse not found.':
        throw new HttpException(result, HttpStatus.NOT_FOUND);
      case 'Warehouse exists.':
        throw new HttpException(result, HttpStatus.CONFLICT);
      case 'Warehouse update failed.':
        throw new HttpException(result, HttpStatus.BAD_REQUEST);
      case 'Internal server error.':
        throw new HttpException(result, HttpStatus.INTERNAL_SERVER_ERROR);
      default:
        throw new HttpException(
          { message: 'Internal server error' },
          HttpStatus.INTERNAL_SERVER_ERROR
        );
    }
  }
  

  /*@Delete(':id')
  //@UseGuards(TokenVerification)
  async remove(@Param('id') id: string) {
    const result = await this.warehouseService.remove(id);
    switch (result.message) {
      case 'Organization deleted.':
        return {result,status: HttpStatus.OK};
      case 'Organization not found.':
        throw new HttpException(result, HttpStatus.NOT_FOUND);
      case 'Internal server error.':
        throw new HttpException(result, HttpStatus.INTERNAL_SERVER_ERROR);
      default:
        throw new HttpException({message:'Internal server error'}, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }*/
}
