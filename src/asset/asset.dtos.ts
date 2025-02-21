import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';
import { Asset } from './asset.model';
import { Transform } from 'class-transformer';

export class CreateAssetDTO {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  folder?: boolean = false;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  parentAssetId?: number;
}

export class UpdateAssetDTO {
  @ApiProperty()
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  parentAssetId?: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  filename?: string;
}

export class AssetQuery {
  @ApiProperty({ required: false })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  page?: number = 1;

  @ApiProperty({ required: false })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  pageSize?: number = 10;
}

export class AssetQueryResponse {
  @ApiProperty()
  totalItems: number;

  @ApiProperty()
  totalPages: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  pageSize: number;

  @ApiProperty()
  assets: Asset[];
}
