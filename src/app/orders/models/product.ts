import { ApiProperty } from '@nestjs/swagger';

export class Product {
  @ApiProperty()
  id: string;

  @ApiProperty()
  quantity: number;
}
