

import { ApiProperty } from '@nestjs/swagger';

export class UpdateProductWarehouseDto {
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
  images?: Array<{ key: string; value: string }>;
}

/* export interface UpdateProductWarehouseDto {
  name: Array<{ key: string; value: string }>;
  organizationId: string;
  brand_name: string;
  description: Array<{ key: string; value: string }>;
  unit: string;
  tags: string[];
  price: number;
} */