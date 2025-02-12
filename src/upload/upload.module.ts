import { forwardRef, Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { AssetModule } from 'src/asset/asset.module';

@Module({
  imports: [forwardRef(() => AssetModule)],
  providers:[UploadService],
  exports: [UploadService]

})
export class UploadModule {}
