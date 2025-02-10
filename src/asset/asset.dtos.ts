import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateAssetDTO {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsBoolean()
  folder: boolean;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  parentAssetId: number;
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
}
