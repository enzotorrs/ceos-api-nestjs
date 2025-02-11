import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Asset } from './asset.model';
import { InjectModel } from '@nestjs/sequelize';
import { CreateAssetDTO, UpdateAssetDTO } from './asset.dtos';

@Injectable()
export class AssetService {
  constructor(
    @InjectModel(Asset)
    private assetRepository: typeof Asset,
  ) { }

  async create(asset: CreateAssetDTO): Promise<Asset> {
    const parentAsset = asset.parentAssetId ? await this.getByIdOr404(asset.parentAssetId) : undefined
    await this.isValidAssetOr400(asset, parentAsset)
    return this.assetRepository.create({ ...asset });
  }

  async update(assetId: number, asset: UpdateAssetDTO) {
    const assetInDb = await this.getByIdOr404(assetId);
    assetInDb.set(asset);
    return assetInDb.save();
  }

  async getAll(): Promise<Asset[]> {
    return this.assetRepository.findAll({
      include: ['parentAsset', 'childAssets'],
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

  private async isValidAssetOr400(asset: CreateAssetDTO, parentAsset?: Asset) {
    if (parentAsset && !parentAsset.folder) {
      throw new BadRequestException("parent asset is not a folder")
    }
  }
}
