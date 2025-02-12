import { ApiProperty } from '@nestjs/swagger';
import { AccountRole } from '../../user/enum/account-role.enum';
import { IsDate, IsEnum, IsString } from 'class-validator';

export class CreateAccountDto {
  @ApiProperty()
  @IsString()
  public nickname: string;

  @ApiProperty()
  @IsString()
  public description: string;

  @ApiProperty()
  @IsString()
  public username: string;

  @ApiProperty()
  @IsDate()
  public dateOfBirth: Date;

  @ApiProperty({ enum: AccountRole })
  @IsEnum(AccountRole, { message: 'Role must be either User or Admin' })
  public role: AccountRole;
}
