import { ApiProperty } from '@nestjs/swagger';

export class CurrentProduct {
  @ApiProperty()
  quantity: number;

  @ApiProperty()
  expirationDate: Date;
}
