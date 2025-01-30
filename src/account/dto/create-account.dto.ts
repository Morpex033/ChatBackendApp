import { ApiProperty } from '@nestjs/swagger';
import { AccountRole } from '../../user/enum/account-role.enum';

export class CreateAccountDto {
  @ApiProperty()
  public nickname: string;

  @ApiProperty()
  public description: string;

  @ApiProperty()
  public username: string;

  @ApiProperty()
  public dateOfBirth: Date;

  @ApiProperty({ enum: AccountRole })
  public role: AccountRole;
}
