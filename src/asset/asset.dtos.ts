import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

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
}
