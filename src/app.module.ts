import { Module } from '@nestjs/common';
import { AssetModule } from './asset/asset.module';
import { DatabaseModule } from './database/database.module';
import { CoreModule } from './core/core.module';
import { UploadModule } from './upload/upload.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { RequestsMetricsInterceptor } from './core/routeMetrics.interceptor';

@Module({
  imports: [DatabaseModule, AssetModule, CoreModule, UploadModule],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: RequestsMetricsInterceptor
    },
  ],
})
export class AppModule { }
