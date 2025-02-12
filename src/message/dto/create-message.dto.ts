import { ApiProperty } from '@nestjs/swagger';

export class CreateMessageDto {
  @ApiProperty()
  public chatId: string;

  @ApiProperty()
  public content: string;
}
