import { ApiProperty } from '@nestjs/swagger';

export class CreateMessageDto {
  @ApiProperty()
  public senderId: string;

  @ApiProperty()
  public chatId: string;

  @ApiProperty()
  public content: string;
}
