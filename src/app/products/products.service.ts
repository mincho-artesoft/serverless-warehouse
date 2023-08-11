import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { ObjectId } from 'mongodb';
import { InjectRepository } from '@nestjs/typeorm';
import * as fs from 'fs';
import axios from 'axios';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>
  ) {}

  async reloadProducts() {
    const tableName = this.productRepository.metadata.tableName;
 //test 
    const fruitsAndVegatablesUrl =
      'https://jmjmdq9hhx-dsn.algolia.net/1/indexes/*/queries?x-algolia-agent=Algolia%20for%20JavaScript%20(4.14.3)%3B%20Browser%20(lite)%3B%20JS%20Helper%20(3.11.3)%3B%20react%20(18.2.0)%3B%20react-instantsearch%20(6.39.0)&x-algolia-api-key=42ca9458d9354298c7016ce9155d8481&x-algolia-application-id=JMJMDQ9HHX';
    const fruitsAndVegatablesBody = {
      requests: [
        {
          indexName: 'products',
          params:
            'clickAnalytics=true&facetFilters=%5B%5B%22hierarchical_categories_bg.lv1%3A%D0%9F%D0%BB%D0%BE%D0%B4%D0%BE%D0%B2%D0%B5%20%D0%B8%20%D0%B7%D0%B5%D0%BB%D0%B5%D0%BD%D1%87%D1%83%D1%86%D0%B8%22%5D%5D&facets=%5B%22brand_name_bg%22%2C%22is_bio%22%2C%22is_farm_product%22%2C%22is_promo%22%2C%22is_new%22%2C%22show_offer%22%2C%22country_of_origin_bg%22%2C%22hierarchical_categories_bg.lv1%22%2C%22hierarchical_categories_bg.lv2%22%5D&highlightPostTag=%3C%2Fais-highlight-0000000000%3E&highlightPreTag=%3Cais-highlight-0000000000%3E&maxValuesPerFacet=10&page=0&query=&tagFilters=',
          hitsPerPage: 100000,
        },
        {
          indexName: 'products',
          params:
            'analytics=false&clickAnalytics=false&facets=%5B%22hierarchical_categories_bg.lv1%22%5D&highlightPostTag=%3C%2Fais-highlight-0000000000%3E&highlightPreTag=%3Cais-highlight-0000000000%3E&hitsPerPage=100000&maxValuesPerFacet=10&page=0&query=',
        },
      ],
    };

    const frozenFoodUrl =
      'https://jmjmdq9hhx-dsn.algolia.net/1/indexes/*/queries?x-algolia-agent=Algolia%20for%20JavaScript%20(4.14.3)%3B%20Browser%20(lite)%3B%20JS%20Helper%20(3.11.3)%3B%20react%20(18.2.0)%3B%20react-instantsearch%20(6.39.0)&x-algolia-api-key=42ca9458d9354298c7016ce9155d8481&x-algolia-application-id=JMJMDQ9HHX';
    const frozenFoodBody = {
      requests: [
        {
          indexName: 'products',
          params:
            'clickAnalytics=true&facetFilters=%5B%5B%22hierarchical_categories_bg.lv1%3A%D0%97%D0%B0%D0%BC%D1%80%D0%B0%D0%B7%D0%B5%D0%BD%D0%B8%20%D1%85%D1%80%D0%B0%D0%BD%D0%B8%22%5D%5D&facets=%5B%22brand_name_bg%22%2C%22is_bio%22%2C%22is_farm_product%22%2C%22is_promo%22%2C%22is_new%22%2C%22show_offer%22%2C%22country_of_origin_bg%22%2C%22hierarchical_categories_bg.lv1%22%2C%22hierarchical_categories_bg.lv2%22%5D&highlightPostTag=%3C%2Fais-highlight-0000000000%3E&highlightPreTag=%3Cais-highlight-0000000000%3E&hitsPerPage=100000&maxValuesPerFacet=10&page=0&query=&tagFilters=',
          hitsPerPage: 100000,
        },
        {
          indexName: 'products',
          params:
            'analytics=false&clickAnalytics=false&facets=%5B%22hierarchical_categories_bg.lv1%22%5D&highlightPostTag=%3C%2Fais-highlight-0000000000%3E&highlightPreTag=%3Cais-highlight-0000000000%3E&hitsPerPage=100000&maxValuesPerFacet=10&page=0&query=',
        },
      ],
    };
    const sausagesUrl =
      'https://jmjmdq9hhx-dsn.algolia.net/1/indexes/*/queries?x-algolia-agent=Algolia%20for%20JavaScript%20(4.14.3)%3B%20Browser%20(lite)%3B%20JS%20Helper%20(3.11.3)%3B%20react%20(18.2.0)%3B%20react-instantsearch%20(6.39.0)&x-algolia-api-key=42ca9458d9354298c7016ce9155d8481&x-algolia-application-id=JMJMDQ9HHX';
    const sausagesBody = {
      requests: [
        {
          indexName: 'products',
          params:
            'clickAnalytics=true&facetFilters=%5B%5B%22hierarchical_categories_bg.lv1%3A%D0%9A%D0%BE%D0%BB%D0%B1%D0%B0%D1%81%D0%B8%20%D0%B8%20%D0%B4%D0%B5%D0%BB%D0%B8%D0%BA%D0%B0%D1%82%D0%B5%D1%81%D0%B8%22%5D%5D&facets=%5B%22brand_name_bg%22%2C%22is_bio%22%2C%22is_farm_product%22%2C%22is_promo%22%2C%22is_new%22%2C%22show_offer%22%2C%22country_of_origin_bg%22%2C%22hierarchical_categories_bg.lv1%22%2C%22hierarchical_categories_bg.lv2%22%5D&highlightPostTag=%3C%2Fais-highlight-0000000000%3E&highlightPreTag=%3Cais-highlight-0000000000%3E&hitsPerPage=100000&maxValuesPerFacet=10&page=0&query=&tagFilters=',
          hitsPerPage: 100000,
        },
        {
          indexName: 'products',
          params:
            'analytics=false&clickAnalytics=false&facets=%5B%22hierarchical_categories_bg.lv1%22%5D&highlightPostTag=%3C%2Fais-highlight-0000000000%3E&highlightPreTag=%3Cais-highlight-0000000000%3E&hitsPerPage=100000&maxValuesPerFacet=10&page=0&query=',
        },
      ],
    };
    const milkAndEggsUrl =
      'https://jmjmdq9hhx-dsn.algolia.net/1/indexes/*/queries?x-algolia-agent=Algolia%20for%20JavaScript%20(4.14.3)%3B%20Browser%20(lite)%3B%20JS%20Helper%20(3.11.3)%3B%20react%20(18.2.0)%3B%20react-instantsearch%20(6.39.0)&x-algolia-api-key=42ca9458d9354298c7016ce9155d8481&x-algolia-application-id=JMJMDQ9HHX';
    const milkAndEggsBody = {
      requests: [
        {
          indexName: 'products',
          params:
            'clickAnalytics=true&facetFilters=%5B%5B%22hierarchical_categories_bg.lv1%3A%D0%9C%D0%BB%D0%B5%D1%87%D0%BD%D0%B8%20%D0%B8%20%D1%8F%D0%B9%D1%86%D0%B0%22%5D%5D&facets=%5B%22brand_name_bg%22%2C%22is_bio%22%2C%22is_farm_product%22%2C%22is_promo%22%2C%22is_new%22%2C%22show_offer%22%2C%22country_of_origin_bg%22%2C%22hierarchical_categories_bg.lv1%22%2C%22hierarchical_categories_bg.lv2%22%5D&highlightPostTag=%3C%2Fais-highlight-0000000000%3E&highlightPreTag=%3Cais-highlight-0000000000%3E&hitsPerPage=100000&maxValuesPerFacet=10&page=0&query=&tagFilters=',
          hitsPerPage: 100000,
        },
        {
          indexName: 'products',
          params:
            'analytics=false&clickAnalytics=false&facets=%5B%22hierarchical_categories_bg.lv1%22%5D&highlightPostTag=%3C%2Fais-highlight-0000000000%3E&highlightPreTag=%3Cais-highlight-0000000000%3E&hitsPerPage=100000&maxValuesPerFacet=10&page=0&query=',
        },
      ],
    };
    const beveragesUrl =
      'https://jmjmdq9hhx-dsn.algolia.net/1/indexes/*/queries?x-algolia-agent=Algolia%20for%20JavaScript%20(4.14.3)%3B%20Browser%20(lite)%3B%20JS%20Helper%20(3.11.3)%3B%20react%20(18.2.0)%3B%20react-instantsearch%20(6.39.0)&x-algolia-api-key=42ca9458d9354298c7016ce9155d8481&x-algolia-application-id=JMJMDQ9HHX';
    const beveragesBody = {
      requests: [
        {
          indexName: 'products',
          params:
            'clickAnalytics=true&facetFilters=%5B%5B%22hierarchical_categories_bg.lv1%3A%D0%9D%D0%B0%D0%BF%D0%B8%D1%82%D0%BA%D0%B8%22%5D%5D&facets=%5B%22brand_name_bg%22%2C%22is_bio%22%2C%22is_farm_product%22%2C%22is_promo%22%2C%22is_new%22%2C%22show_offer%22%2C%22country_of_origin_bg%22%2C%22hierarchical_categories_bg.lv1%22%2C%22hierarchical_categories_bg.lv2%22%5D&highlightPostTag=%3C%2Fais-highlight-0000000000%3E&highlightPreTag=%3Cais-highlight-0000000000%3E&hitsPerPage=100000&maxValuesPerFacet=10&page=0&query=&tagFilters=',
          hitsPerPage: 100000,
        },
        {
          indexName: 'products',
          params:
            'analytics=false&clickAnalytics=false&facets=%5B%22hierarchical_categories_bg.lv1%22%5D&highlightPostTag=%3C%2Fais-highlight-0000000000%3E&highlightPreTag=%3Cais-highlight-0000000000%3E&hitsPerPage=100000&maxValuesPerFacet=10&page=0&query=',
        },
      ],
    };
    try {
      await this.productRepository.clear();

      const fruitsAndVegatablesResponse = await axios.post(
        fruitsAndVegatablesUrl,
        fruitsAndVegatablesBody
      );
      const frozenFoodResponse = await axios.post(
        frozenFoodUrl,
        frozenFoodBody
      );
      const sausagesResponse = await axios.post(sausagesUrl, sausagesBody);
      const milkAndEggsrRsponse = await axios.post(
        milkAndEggsUrl,
        milkAndEggsBody
      );
      const beveragesResponse = await axios.post(beveragesUrl, beveragesBody);

      const fruitsAndVegatablesData = fruitsAndVegatablesResponse.data;
      const frozenFoodData = frozenFoodResponse.data;
      const sausagesData = sausagesResponse.data;
      const milkAndEggsDate = milkAndEggsrRsponse.data;
      const beveragesDate = beveragesResponse.data;

      const fruitsAndVegatablesfilteredResults =
        fruitsAndVegatablesData.results[0].hits.filter(
          (item: any) =>
            item.hierarchical_categories_en?.lv1 === 'Fruits and vegetables'
        );

      for (const fruitsAndVegatable of fruitsAndVegatablesfilteredResults) {
        await this.productRepository.save(fruitsAndVegatable);
      }

      const frozenFoodfilteredResults = frozenFoodData.results[0].hits.filter(
        (item: any) =>
          item.hierarchical_categories_en?.lv1 === 'Frozen products'
      );

      for (const frozenFood of frozenFoodfilteredResults) {
        await this.productRepository.save(frozenFood);
      }

      const sausagesfilteredResults = sausagesData.results[0].hits.filter(
        (item: any) =>
          item.hierarchical_categories_en?.lv1 === 'Meats and Salami'
      );
      for (const sausage of sausagesfilteredResults) {
        await this.productRepository.save(sausage);
      }

      const milkAndEggsfilteredResults = milkAndEggsDate.results[0].hits.filter(
        (item: any) => item.hierarchical_categories_en?.lv1 === 'Dairy and eggs'
      );

      for (const milkAndEgg of milkAndEggsfilteredResults) {
        await this.productRepository.save(milkAndEgg);
      }

      const beveragesfilteredResults = beveragesDate.results[0].hits.filter(
        (item: any) => item.hierarchical_categories_en?.lv1 === 'Drinks'
      );

      for (const beverage of beveragesfilteredResults) {
        await this.productRepository.save(beverage);
      }
    } catch (error) {
      console.error('Error making request:', error);
    }

    return 'Products reload.';
  }

  async findOne(_id: any): Promise<Product | null> {
    let organization = null;
    if (_id.length === 12 || _id.length === 24) {
      try {
        parseInt(_id, 16);
        _id = new ObjectId(_id);
        organization = await this.productRepository.findOne({
          where: { _id },
        });
      } catch (error) {
        organization = null;
      }
    }
    return organization;
  }

  async findOneById(id: number): Promise<Product | null> {
    const organization = await this.productRepository.findOne({
      where: { id },
    });
    return organization || null;
  }

  async findAll(): Promise<Product[]> {
    return this.productRepository.find();
  }
}
/*     const beveragesfilePath =
      '/Users/aleksandarsvinarov/Repo/nx-serverless/apps/serverless-warehouse/src/app/products/beverages.json';
    const beveragesrawData = fs.readFileSync(beveragesfilePath, 'utf-8');
    const beverages: Product[] = JSON.parse(beveragesrawData);

    for (const beverage of beverages) {
      await this.productnRepository.save(beverage);
    }

    const frozenFoodfilePath =
      '/Users/aleksandarsvinarov/Repo/nx-serverless/apps/serverless-warehouse/src/app/products/frozenFood.json';
    const frozenFoodrawData = fs.readFileSync(frozenFoodfilePath, 'utf-8');
    const frozenFood: Product[] = JSON.parse(frozenFoodrawData);

    for (const frozenFoodItem of frozenFood) {
      await this.productnRepository.save(frozenFoodItem);
    }
    const fruitsAndVegetablesfilePath =
      '/Users/aleksandarsvinarov/Repo/nx-serverless/apps/serverless-warehouse/src/app/products/fruitsAndVegetables.json';
    const fruitsAndVegetablesrawData = fs.readFileSync(
      fruitsAndVegetablesfilePath,
      'utf-8'
    );
    const fruitsAndVegetables: Product[] = JSON.parse(
      fruitsAndVegetablesrawData
    );

    for (const fruitsAndVegetable of fruitsAndVegetables) {
      await this.productnRepository.save(fruitsAndVegetable);
    }
    const milkAndEggfilePath =
      '/Users/aleksandarsvinarov/Repo/nx-serverless/apps/serverless-warehouse/src/app/products/milkAndEgg.json';
    const milkAndEggrawData = fs.readFileSync(milkAndEggfilePath, 'utf-8');
    const milkAndEgg: Product[] = JSON.parse(milkAndEggrawData);

    for (const milkAndEggItem of milkAndEgg) {
      await this.productnRepository.save(milkAndEggItem);
    }
    const sausagesfilePath =
      '/Users/aleksandarsvinarov/Repo/nx-serverless/apps/serverless-warehouse/src/app/products/sausages.json';
    const sausagesrawData = fs.readFileSync(sausagesfilePath, 'utf-8');
    const sausages: Product[] = JSON.parse(sausagesrawData);

    for (const sausage of sausages) {
      await this.productnRepository.save(sausage);
    } */
