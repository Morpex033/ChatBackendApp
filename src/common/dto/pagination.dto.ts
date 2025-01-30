import { Type } from 'class-transformer';
import {
  IsIn,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  public pageNumber: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  public pageSize: number = 5;

  @IsOptional()
  @IsString()
  public sortBy: string = 'id';

  @IsOptional()
  @IsString()
  @IsIn(['ASC', 'DESC'])
  public order?: 'ASC' | 'DESC';
}
