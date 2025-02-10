import { Injectable } from '@nestjs/common';
import { Asset } from './asset.model';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class AssetService {
  constructor(
    @InjectModel(Asset)
    private assetRepository: typeof Asset,
  ) {}

  async create(asset: any) {
    return this.assetRepository.create({ ...asset });
  }

  async getAll() {
    return this.assetRepository.findAll();
  }
}
