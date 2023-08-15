import { ApiProperty } from '@nestjs/swagger';

export class Ingredient {
  @ApiProperty()
  quantity: number;

  @ApiProperty()
  productId: string;
}
