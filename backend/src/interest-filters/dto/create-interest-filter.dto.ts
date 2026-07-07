import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { TenderCategory, TenderModality } from '@prisma/client';

export class CreateInterestFilterDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  state?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  keyword?: string;

  @ApiPropertyOptional({ enum: TenderCategory })
  @IsOptional()
  @IsEnum(TenderCategory)
  category?: TenderCategory;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minValue?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxValue?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  publicOrg?: string;

  @ApiPropertyOptional({ enum: TenderModality })
  @IsOptional()
  @IsEnum(TenderModality)
  modality?: TenderModality;
}
