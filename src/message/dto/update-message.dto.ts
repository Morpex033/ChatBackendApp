import { ApiProperty } from '@nestjs/swagger';

export class UpdateMessageDto {
  @ApiProperty()
  public senderId: string;

  @ApiProperty()
  public content: string;
}
