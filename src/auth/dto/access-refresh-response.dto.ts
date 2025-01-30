import { ApiProperty } from '@nestjs/swagger';

export class AccessRefreshResponseDto {
  @ApiProperty()
  public accessToken: string;

  @ApiProperty()
  public refreshToken: string;
}
