import { Module } from '@nestjs/common';
import { AssetModule } from './asset/asset.module';
import { DatabaseModule } from './database/database.module';
import { CoreModule } from './core/core.module';

@Module({
  imports: [DatabaseModule, AssetModule, CoreModule],
})
export class AppModule {}
