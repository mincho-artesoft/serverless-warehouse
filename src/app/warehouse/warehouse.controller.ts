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
  Req,
} from '@nestjs/common';
import { WarehouseService } from './warehouse.service';
import { CreateOrganizationProductWarehouseDto } from './models/dto/create-organization-product-warehouse.dto';
import { TokenVerification } from '@nx-serverless/auth';
import { CreateGlobalProductWarehouseDto } from './models/dto/create-global-product-warehouse.dto';
import { ICurrentProduct } from './models/current-product.interfate';
import { UpdateProductWarehouseDto } from './models/dto/update-product-warehouse.dto';
import { UpdateCookedProductWarehouseDto } from './models/dto/update-cooked-product-warehouse.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiProperty,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentProduct } from './models/current-product';
import { SnsService } from '@nx-serverless/aws';

class UpdateQuantitiesDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  value: number;

  @ApiProperty()
  date: Date;
}

 class UpdateQuantityDto {
  @ApiProperty()
  quantity: number;

  @ApiProperty()
  currentProducts: CurrentProduct[];
}

@ApiTags('Warehouse - warehouse')
@ApiBearerAuth()
@Controller('warehouse')
export class WarehouseController {
  constructor(private readonly warehouseService: WarehouseService,
    private readonly snsService: SnsService) {}

  @ApiOperation({
    summary: 'Create a new warehouse Global Product',
    description: 'Creates a new warehouse with provided data.',
  })
  @ApiBody({ type: CreateGlobalProductWarehouseDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Warehouse created successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  //ще е само за админ
  @Post()
  @UseGuards(TokenVerification)
  async create(@Body() createWarehouseDto: CreateGlobalProductWarehouseDto) {
    const result = await this.warehouseService.create(createWarehouseDto);
    switch (result.message) {
      case 'Warehouse add failed.':
      case 'Invalid fields entered.':
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
  @ApiOperation({
    summary: 'Create a new organization product warehouse',
    description: 'Creates a new organization product warehouse.',
  })
  @ApiBody({ type: CreateOrganizationProductWarehouseDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Organization product warehouse created successfully',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Warehouse already exists',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Organization or ingredient not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data or global products cannot be added',
  })
  @Post('createOrganizationProduct')
  @UseGuards(TokenVerification)
  async createOrganizationProduct(
    @Request() request,
    @Body() createWarehouseDto: CreateOrganizationProductWarehouseDto
  ) {
    const result = await this.warehouseService.createOgranizationProduct(
      createWarehouseDto,
      request
    );
    switch (result.message) {
      case 'Successful add warehouse.':
        return { result, status: HttpStatus.CREATED };
      case 'Warehouse exists.':
        throw new HttpException(result, HttpStatus.CONFLICT);
      case 'Organirazion not found.':
      case 'Ingredient not found.':
        throw new HttpException(result, HttpStatus.NOT_FOUND);
      case 'Warehouse add failed.':
      case 'Invalid fields entered.':
      case 'Global products cannot be added using this method.':
        throw new HttpException(result, HttpStatus.BAD_REQUEST);
      default:
        throw new HttpException(
          { message: 'Internal server error' },
          HttpStatus.INTERNAL_SERVER_ERROR
        );
    }
  }

  @ApiOperation({
    summary: 'Automatically create a new warehouse based on an ID',
    description:
      'Automatically creates a new warehouse based on the provided ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID used for automatic warehouse creation',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Warehouse created successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Warehouse creation failed or invalid input data',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Warehouse already exists',
  })
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

  @ApiOperation({
    summary: 'Retrieve all warehouses',
    description: 'Retrieves a list of all warehouses.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of warehouses retrieved successfully',
  })
  @Get()
  @UseGuards(TokenVerification)
  findAll() {
    return this.warehouseService.findAll();
  }

  @ApiOperation({
    summary: 'Retrieve all organization products for a specific ID',
    description:
      'Retrieves a list of all organization products for the provided ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID used to retrieve organization products',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of organization products retrieved successfully',
  })
  @Get('find-all-organization-products/:id')
  @UseGuards(TokenVerification)
  findAllOrganizationProducts(@Param('id') id: string) {
    return this.warehouseService.findAllOrganizationProducts(id);
  }

  @ApiOperation({
    summary: 'Retrieve all organization cooked products for a specific ID',
    description:
      'Retrieves a list of all organization cooked products for the provided ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID used to retrieve organization cooked products',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of organization cooked products retrieved successfully',
  })
  @Get('find-all-organization-cooked-products/:id')
  @UseGuards(TokenVerification)
  findAllOrganizationCookedProducts(@Param('id') id: string) {
    return this.warehouseService.findAllOrganizationCookedProducts(id);
  }

  @ApiOperation({
    summary: 'Retrieve all global products',
    description: 'Retrieves a list of all global products.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of global products retrieved successfully',
  })
  @Get('find-all-global-products')
  @UseGuards(TokenVerification)
  findAllGlobalProducts() {
    return this.warehouseService.findAllOrganizationProducts('global');
  }

  @ApiOperation({
    summary: 'Retrieve remaining global products for a specific ID',
    description:
      'Retrieves the remaining quantity of global products for the provided ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID used to retrieve remaining global products',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Remaining global products retrieved successfully',
  })
  @Get('find-remaining-global/:id')
  @UseGuards(TokenVerification)
  findRemainingGlobal(@Param('id') id: string) {
    return this.warehouseService.findRemainingGlobal(id);
  }

  @ApiOperation({
    summary: 'Retrieve a warehouse by ID',
    description: 'Retrieves a warehouse by the provided ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID used to retrieve the warehouse',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Warehouse retrieved successfully',
  })
  @Get(':id')
  @UseGuards(TokenVerification)
  findOne(@Param('id') id: string) {
    return this.warehouseService.findOne(id);
  }

  @ApiOperation({
    summary: 'Change quantities of a warehouse item',
    description: 'Updates the quantities of a warehouse item.',
  })
  @ApiBody({
    type: UpdateQuantitiesDto,
    description: 'Update quantities information',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Quantities updated successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Warehouse not found',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data or quantity issues',
  })
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

      case 'Internal server error.':
        throw new HttpException(result, HttpStatus.INTERNAL_SERVER_ERROR);
      case 'Warehouse update failed.':
      case 'Invalid or null quantity.':
      case 'Invalid or null quantity or or expiry date.':
      case 'You cannot add cooked food with this function.':
      case 'Not enough quantity.':
      case 'You cant change global products.':
        throw new HttpException(result, HttpStatus.BAD_REQUEST);
      default:
        throw new HttpException(
          { message: 'Internal server error' },
          HttpStatus.INTERNAL_SERVER_ERROR
        );
    }
  }

  @ApiOperation({
    summary: 'Cook products in the warehouse',
    description:
      'Cook products in the warehouse with the provided ID and value.',
  })
  @ApiBody({ type: UpdateQuantitiesDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Warehouse updated successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Warehouse not found',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data or cooking issues',
  })
  @Put('cook')
  @UseGuards(TokenVerification)
  async cook(
    @Body() { id, value, date }: { id: string; value: number; date?: Date }
  ) {
    const result = await this.warehouseService.cook(id, value, date);
    switch (result.message) {
      case 'Warehouse updated.':
        return { result, status: HttpStatus.OK };
      case 'Warehouse not found.':
        throw new HttpException(result, HttpStatus.NOT_FOUND);
      case 'Internal server error.':
        throw new HttpException(result, HttpStatus.INTERNAL_SERVER_ERROR);
      case 'Warehouse update failed.':
      case 'Invalid or null quantity.':
      case 'Invalid or null quantity or or expiry date.':
      case 'Only the products that have composition can be added with this function.':
      case 'No sufficient quantity of the ingredients.':
      case 'Not enough quantity.':
        throw new HttpException(result, HttpStatus.BAD_REQUEST);
      default:
        throw new HttpException(
          { message: 'Internal server error' },
          HttpStatus.INTERNAL_SERVER_ERROR
        );
    }
  }

  @ApiOperation({
    summary: 'Update quantity of a warehouse item',
    description:
      'Updates the quantity of a warehouse item for the provided ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID used to update the warehouse item quantity',
  })
  @ApiBody({
    type: UpdateQuantityDto,
    description: 'Update quantity information',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Warehouse quantity updated successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Warehouse not found',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data or update issues',
  })
  @Put('updateQuantity/:id')
  @UseGuards(TokenVerification)
  async updateQuantity(
    @Param('id') id: string,
    @Body()
    {
      quantity,
      currentProducts,
    }: { quantity: number; currentProducts: ICurrentProduct[] }
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
      case 'Internal server error.':
        throw new HttpException(result, HttpStatus.INTERNAL_SERVER_ERROR);
      case 'Warehouse update failed.':
      case 'You cant change global products.':
      case 'Incorrect data.':
      case 'Invalid or null quantity or or expiry date.':
        throw new HttpException(result, HttpStatus.BAD_REQUEST);
      default:
        throw new HttpException(
          { message: 'Internal server error' },
          HttpStatus.INTERNAL_SERVER_ERROR
        );
    }
  }

  @ApiOperation({
    summary: 'Update a warehouse product',
    description: 'Update a warehouse product with the provided ID and data.',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID used to update the warehouse product',
  })
  @ApiBody({
    type: UpdateProductWarehouseDto,
    description: 'Updated product data',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Warehouse product updated successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Warehouse not found',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data or update issues',
  })
  @Put('update-product/:id')
  @UseGuards(TokenVerification)
  async updateProduct(
    @Request() request,
    @Param('id') id: string,
    @Body() createWarehouseDto: UpdateProductWarehouseDto
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
      case 'Internal server error.':
        throw new HttpException(result, HttpStatus.INTERNAL_SERVER_ERROR);
      case 'Warehouse update failed.':
      case 'You cant change global products.':
        throw new HttpException(result, HttpStatus.BAD_REQUEST);
      default:
        throw new HttpException(result, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiOperation({
    summary: 'Update a cooked warehouse product',
    description:
      'Update a cooked warehouse product with the provided ID and data.',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID used to update the cooked warehouse product',
  })
  @ApiBody({
    type: UpdateCookedProductWarehouseDto,
    description: 'Updated cooked product data',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Cooked warehouse product updated successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Product or warehouse not found',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data or update issues',
  })
  @Put('update-cooked-product/:id')
  @UseGuards(TokenVerification)
  async updateCookedProduct(
    @Request() request,
    @Param('id') id: string,
    @Body() createWarehouseDto: UpdateCookedProductWarehouseDto
  ) {
    const result = await this.warehouseService.updateCookedProduct(
      id,
      createWarehouseDto,
      request
    );
    switch (result.message) {
      case 'Warehouse updated.':
        return { result, status: HttpStatus.OK };
      case 'Ingredient not found.':
      case 'Warehouse not found.':
        throw new HttpException(result, HttpStatus.NOT_FOUND);
      case 'Internal server error.':
        throw new HttpException(result, HttpStatus.INTERNAL_SERVER_ERROR);
      case 'Warehouse update failed.':
      case 'You cant change global products.':
        throw new HttpException(result, HttpStatus.BAD_REQUEST);
      default:
        throw new HttpException(result, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @ApiOperation({
    summary: 'Delete a warehouse product',
    description: 'Delete a warehouse product with the provided ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID used to delete the warehouse product',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Warehouse product deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Warehouse not found',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
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
  }

  @Post('add-image-sns')
  async handleSnsNotification(@Body() body: any) {  
    if (typeof body == 'string') {
      const notificationObj = JSON.parse(body);
     // console.log(typeof notificationObj.Message)    
      console.log('Received SNS Notification:', notificationObj);
      if (notificationObj.TopicArn && notificationObj.Token) {
        await this.snsService.confirmSubscription(
          notificationObj.TopicArn,
          notificationObj.Token
        );
      }else{
        const message =  JSON.parse(notificationObj.Message);
        if (
          message.id &&
          message.image &&
          message.type == 'warehouse'
        ) {
          await this.warehouseService.addImage(
            message.id,
            message.image
          );
        }
      }
    }
  }
}


