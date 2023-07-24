import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './entities/product.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ProductService {
  async create(createProductDto: CreateProductDto) {
    try {
      const isDuplicate = await this.findDublicate(createProductDto);
      if (isDuplicate.length > 0) {
        return { message: 'Product exists.' };
      } else {
        createProductDto.id = uuidv4();
        const newProduct = new Product(createProductDto);
        await newProduct.save();
        return { message: 'Successful add product.' };
      }
    } catch (error) {
      return { message: 'Product add failed.' };
    }
  }

  async findAll() {
    const allOrganizations = await Product.scan().exec();
    return allOrganizations;
  }

  async findOne(id: string) {
    try {
      const organization = await Product.get(id);
      return organization;
    } catch (err) {
      return undefined;
    }
  }

  async findAllOrganisationProducts(organirazionId: string) {
    try {
      const result = await Product.scan().exec();
      if(result.length>0){
        return result.filter(
          (row: any) => row.type == organirazionId ||
          row.type == "global"
        );
      }else {
        return [];
      }
    } catch (err) {
      return [];
    }
  }

  //само тестово
  async update(id: string, createProductDto: CreateProductDto) {
    try {
      const isDuplicate = await this.findDublicate(createProductDto);
      if (isDuplicate.length > 0) {
        return { message: 'Product exists.' };
      } else {
        const product = await this.findOne(id);
        if (product) {
          this.replaceFields(product, createProductDto);
          await product.save();
          return { message: 'Product updated.' };
        }
        return { message: 'Product not found.' };
      }
    } catch (error) {
      return { message: 'Internal server error.' };
    }
  }

  async remove(id: string) {
    try {
      const product = await this.findOne(id);
      if (product) {
        await product.delete();
        return { message: 'Product deleted.' };
      }
      return { message: 'Product not found.' };
    } catch (error) {
      return { message: 'Internal server error.' };
    }
  }

  async findDublicate(product: CreateProductDto) {
    const result = await Product.scan().exec();
    const dublicate = result.filter(
      (row: any) => row.name_en == product.name_en
    );
    return dublicate;
  }
  replaceFields(obj1: any, obj2: any) {
    for (let key in obj1) {
      if (obj2.hasOwnProperty(key)) {
        if (obj2[key].length > 0) {
          obj1[key] = obj2[key];
        }
      }
    }
  }
}
