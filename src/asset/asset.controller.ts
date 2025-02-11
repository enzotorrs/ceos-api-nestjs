import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { AssetService } from './asset.service';
import { Asset } from './asset.model';
import { CreateAssetDTO, UpdateAssetDTO } from './asset.dtos';

@Controller('asset')
export class AssetController {
  constructor(private readonly assetService: AssetService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() asset: CreateAssetDTO): Promise<Asset> {
    return this.assetService.create(asset);
  }

  @Get()
  async getAll(): Promise<Asset[]> {
    return this.assetService.getAll();
  }

  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number) {
    return this.assetService.getByIdOr404(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() asset: UpdateAssetDTO,
  ) {
    return this.assetService.update(id, asset);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.assetService.delete(id);
  }
}
