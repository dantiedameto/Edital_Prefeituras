import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { TenderCategory, TenderModality, TenderStatus } from '@prisma/client';

export class QueryTendersDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  keyword?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  state?: string;

  @ApiPropertyOptional({ enum: TenderCategory })
  @IsOptional()
  @IsEnum(TenderCategory)
  category?: TenderCategory;

  @ApiPropertyOptional({ enum: TenderModality })
  @IsOptional()
  @IsEnum(TenderModality)
  modality?: TenderModality;

  @ApiPropertyOptional({ enum: TenderStatus })
  @IsOptional()
  @IsEnum(TenderStatus)
  status?: TenderStatus;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiPropertyOptional({ default: 12 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  pageSize: number = 12;
}
