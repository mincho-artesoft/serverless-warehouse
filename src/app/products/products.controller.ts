import { Controller, Get, Post, Param, UseGuards} from '@nestjs/common';
import { ProductsService } from './products.service';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TokenVerification } from '@nx-serverless/auth';


@ApiTags('Warehouse - Products')
@ApiBearerAuth()
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @ApiOperation({
    summary: 'Reload products',
    description: 'Reloads product data.',
  })
  @Post()
  @UseGuards(TokenVerification)
  create() {
    return this.productsService.reloadProducts();
  }

  @ApiOperation({
    summary: 'Get all products',
    description: 'Retrieves a list of all products.',
  })
  @ApiResponse({ status: 200, description: 'List of products retrieved successfully' })
  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @ApiOperation({
    summary: 'Get product by ID',
    description: 'Retrieves product details based on the provided ID.',
  })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @ApiResponse({ status: 200, description: 'Product found' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @ApiOperation({
    summary: 'Get product by custom ID',
    description: 'Retrieves product details based on the provided custom ID.',
  })
  @ApiParam({ name: 'id', description: 'Product custom ID' })
  @ApiResponse({ status: 200, description: 'Product found' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @Get('find-by-id/:id')
  findOneById(@Param('id') id: string) {
    return this.productsService.findOneById(+id);
  }
  
  @ApiOperation({
    summary: 'Get product by Bulgarian name',
    description: 'Retrieves product details based on the provided Bulgarian name.',
  })
  @ApiParam({ name: 'name', description: 'Product Bulgarian name' })
  @ApiResponse({ status: 200, description: 'Product found' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @Get('find-by-name-bg/:name')
  findByNameBg(@Param('name') name: string) {
    return this.productsService.findByNameBg(name);
  }

  @ApiOperation({
    summary: 'Get product by English name',
    description: 'Retrieves product details based on the provided English name.',
  })
  @ApiParam({ name: 'name', description: 'Product English name' })
  @ApiResponse({ status: 200, description: 'Product found' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @Get('find-by-name-en/:name')
  findByNameEn(@Param('name') name: string) {
    return this.productsService.findByNameEn(name);
  }
}
