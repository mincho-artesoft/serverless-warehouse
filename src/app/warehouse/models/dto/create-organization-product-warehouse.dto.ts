import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Ingredient } from '../ingredient';

export class CreateOrganizationProductWarehouseDto {
  @ApiProperty()
  name: Array<{ key: string; value: string }>;

  @ApiProperty()
  brand_name: string;

  @ApiProperty()
  description: Array<{ key: string; value: string }>;

  @ApiProperty()
  organizationId: string;

  @ApiProperty()
  unit: string;

  @ApiPropertyOptional()
  tags?: string[];

  @ApiProperty()
  price: number;

  @ApiPropertyOptional()
  ingredients?: Ingredient[];
}

/* import { IIngredient } from "../ingredient.interface";

export interface CreateOrganizationProductWarehouseDto {
  name: Array<{ key: string; value: string }>;
  brand_name: string;
  description: Array<{ key: string; value: string }>;
  organizationId: string;
  unit: string;
  tags?: string[];
  price: number;
  ingredients?: IIngredient[];
} */