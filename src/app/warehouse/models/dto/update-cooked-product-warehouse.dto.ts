import { ApiProperty } from '@nestjs/swagger';
import { Ingredient } from '../ingredient';

export class UpdateCookedProductWarehouseDto {
  @ApiProperty()
  name: Array<{ key: string; value: string }>;

  @ApiProperty()
  organizationId: string;

  @ApiProperty()
  brand_name: string;

  @ApiProperty()
  description: Array<{ key: string; value: string }>;

  @ApiProperty()
  unit: string;

  @ApiProperty()
  tags: string[];

  @ApiProperty()
  price: number;

  @ApiProperty()
  ingredients: Ingredient[];
}

/* 
import { IIngredient } from "../ingredient.interface";

export interface UpdateCookedProductWarehouseDto {
  name: Array<{ key: string; value: string }>;
  organizationId: string;
  brand_name: string;
  description: Array<{ key: string; value: string }>;
  unit: string;
  tags: string[];
  price: number;
  ingredients: IIngredient[];
} */