import { ApiProperty } from "@nestjs/swagger";
export class fileDto{
@ApiProperty({
    type: 'string',
    format: 'binary',
    required: false,
  })
file: any;
}