
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateGlobalProductWarehouseDto {
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
}

/* export interface CreateGlobalProductWarehouseDto {
  name: Array<{ key: string; value: string }>;
  brand_name: string;
  description: Array<{ key: string; value: string }>;
  organizationId: string;
  unit: string;
  tags?: string[];
  price: number;
} */