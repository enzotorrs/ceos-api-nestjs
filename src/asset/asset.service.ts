import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Asset } from './asset.model';
import { InjectModel } from '@nestjs/sequelize';
import {
  AssetQuery,
  AssetQueryResponse,
  CreateAssetDTO,
  UpdateAssetDTO,
} from './asset.dtos';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AssetService {
  constructor(
    @InjectModel(Asset)
    private assetRepository: typeof Asset,
  ) {}

  async create(asset: CreateAssetDTO): Promise<Asset> {
    const parentAsset = asset.parentAssetId
      ? await this.getByIdOr404(asset.parentAssetId)
      : undefined;
    await this.isValidAssetOr400(asset, parentAsset);
    return this.assetRepository.create({ ...asset, uploadId: uuidv4() });
  }

  async update(assetId: number, asset: UpdateAssetDTO) {
    const assetInDb = await this.getByIdOr404(assetId);
    const parentAsset = asset.parentAssetId
      ? await this.getByIdOr404(asset.parentAssetId)
      : undefined;
    assetInDb.set(asset);
    await this.isValidAssetOr400(assetInDb, parentAsset);
    await assetInDb.save();
    return assetInDb.reload({
      include: ['parentAsset', 'childAssets'],
    });
  }

  async getAll(query: AssetQuery): Promise<AssetQueryResponse> {
    const { limit, offset } = this.getLimitAndOffset(
      query.page,
      query.pageSize,
    );
    const { count, rows } = await this.assetRepository.findAndCountAll({
      limit,
      offset,
      include: ['parentAsset', 'childAssets'],
    });
    return {
      totalItems: count,
      totalPages: Math.ceil(count/limit),
      page: query.page,
      pageSize: query.pageSize,
      assets: rows,
    };
  }

  private getLimitAndOffset(page: number, size: number) {
    const limit = size ? size : 5;
    const offset = page > 0 ? (page - 1) * limit : 0;

    return { limit, offset };
  }
  async getByUploadId(uploadId: string) {
    return this.assetRepository.findOne({
      where: { uploadId, filename: null },
    });
  }

  async delete(id: number) {
    const asset = await this.getByIdOr404(id);
    return asset.destroy();
  }

  async getByIdOr404(id: number) {
    const asset = await this.assetRepository.findByPk(id);
    if (!asset) {
      throw new NotFoundException('asset not found');
    }
    return asset;
  }

  private async isValidAssetOr400(
    asset: CreateAssetDTO | Asset,
    parentAsset?: Asset,
  ) {
    if (parentAsset && !parentAsset.folder) {
      throw new BadRequestException('parent asset is not a folder');
    }
    if (asset instanceof Asset) {
      if (asset.id === parentAsset?.id) {
        throw new BadRequestException(
          'asset id cannot be equal to parentAssetId',
        );
      }
    }
  }
}
