import { ApiProperty } from '@nestjs/swagger';

export class UpdateMessageDto {
  @ApiProperty()
  public content: string;
}
