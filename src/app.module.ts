import { Module } from '@nestjs/common';
import { AssetModule } from './asset/asset.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [DatabaseModule, AssetModule],
})
export class AppModule {}
