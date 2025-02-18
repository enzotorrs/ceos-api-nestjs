import { Module } from '@nestjs/common';
import { AssetController } from './asset.controller';
import { AssetService } from './asset.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Asset } from './asset.model';
import { UploadModule } from 'src/upload/upload.module';

@Module({
  controllers: [AssetController],
  providers: [AssetService],
  imports: [SequelizeModule.forFeature([Asset]), UploadModule],
  exports: [AssetService],
})
export class AssetModule {}
