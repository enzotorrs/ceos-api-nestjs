import { Module } from '@nestjs/common';
import { AssetController } from './asset.controller';
import { AssetService } from './asset.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Asset } from './asset.model';

@Module({
  controllers: [AssetController],
  providers: [AssetService],
  imports: [SequelizeModule.forFeature([Asset])],
})
export class AssetModule {}
