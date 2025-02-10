import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { AssetService } from './asset.service';
import { Asset } from './asset.model';
import { CreateAssetDTO } from './asset.dtos';

@Controller('asset')
export class AssetController {
  constructor(private readonly assetService: AssetService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() asset: CreateAssetDTO): Promise<Asset> {
    return this.assetService.create(asset);
  }

  @Get()
  async getAll() {
    return this.assetService.getAll();
  }
}
