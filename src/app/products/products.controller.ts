import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create() {
    return this.productsService.reloadProducts();
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Get('find-by-id/:id')
  findOneById(@Param('id') id: string) {
    return this.productsService.findOneById(+id);
  }
  
  @Get('find-by-name-bg/:name')
  findByNameBg(@Param('name') name: string) {
    return this.productsService.findByNameBg(name);
  }
  @Get('find-by-name-en/:name')
  findByNameEn(@Param('name') name: string) {
    return this.productsService.findByNameEn(name);
  }
}
