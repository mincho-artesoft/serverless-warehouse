import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  Put,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  //@UseGuards(TokenVerification)
  async create(@Body() createProductDto: CreateProductDto) {
    const result = await this.productService.create(createProductDto);
    switch (result.message) {
      case 'Product add failed.':
        throw new HttpException(result, HttpStatus.BAD_REQUEST);
      case 'Successful add product.':
        return { result, status: HttpStatus.CREATED };
      case 'Product exists.':
        throw new HttpException(result, HttpStatus.CONFLICT);
      default:
        throw new HttpException(
          { message: 'Product add failed.' },
          HttpStatus.BAD_REQUEST
        );
    }
  }

  @Get()
  //@UseGuards(TokenVerification)
  findAll() {
    return this.productService.findAll();
  }

  @Get(':id')
  //@UseGuards(TokenVerification)
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Get('find-all-organisation-products/:id')
  //@UseGuards(TokenVerification)
  findAllOrganisationProducts(@Param('id') id: string) {
    return this.productService.findAllOrganisationProducts(id);
  }

  @Put(':id')
  //@UseGuards(TokenVerification)
  async update(@Param('id') id: string,
    @Body() createProductDto: CreateProductDto) {
    const result = await this.productService.update(id, createProductDto);
    switch (result.message) {
      case 'Product updated.':
        return {result,status: HttpStatus.OK};
      case 'Product not found.':
        throw new HttpException(result, HttpStatus.NOT_FOUND);
      case 'Product exists.':
        throw new HttpException(result, HttpStatus.CONFLICT);
      case 'Internal server error.':
        throw new HttpException(result, HttpStatus.INTERNAL_SERVER_ERROR);
      default:
        throw new HttpException({message:'Internal server error'}, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  @Delete(':id')
  //@UseGuards(TokenVerification)
  async remove(@Param('id') id: string) {
    const result = await this.productService.remove(id);
    switch (result.message) {
      case 'Product deleted.':
        return {result,status: HttpStatus.OK};
      case 'Product not found.':
        throw new HttpException(result, HttpStatus.NOT_FOUND);
      case 'Internal server error.':
        throw new HttpException(result, HttpStatus.INTERNAL_SERVER_ERROR);
      default:
        throw new HttpException({message:'Internal server error'}, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
