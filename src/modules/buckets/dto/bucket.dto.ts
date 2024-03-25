

import { ApiProperty } from '@nestjs/swagger';

export class CreateBucketDto {
  @ApiProperty()
  name: string;

}
