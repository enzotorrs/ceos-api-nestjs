import {
  BadRequestException,
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
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AssetService } from './asset.service';
import { Asset } from './asset.model';
import {
  AssetQuery,
  AssetQueryResponse,
  CreateAssetDTO,
  UpdateAssetDTO,
} from './asset.dtos';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from 'src/upload/upload.service';

@Controller('asset')
export class AssetController {
  constructor(
    private readonly assetService: AssetService,
    private readonly uploadService: UploadService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() asset: CreateAssetDTO): Promise<Asset> {
    return this.assetService.create(asset);
  }

  @Get()
  async getAll(@Query() query: AssetQuery): Promise<AssetQueryResponse> {
    if (query.pageSize > 500) {
      throw new BadRequestException('pageSize cannot be greater than 500');
    }
    return this.assetService.getAll(query);
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

  @Post('upload/:uploadId')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @Param('uploadId') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.uploadService.handleUpload(file, id);
  }
}
