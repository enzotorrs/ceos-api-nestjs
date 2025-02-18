import { BadRequestException, Injectable } from '@nestjs/common';
import { join } from 'path';
import { createWriteStream } from 'fs';
import { ConfigService } from '@nestjs/config';
import { AssetService } from 'src/asset/asset.service';
import { Asset } from 'src/asset/asset.model';

@Injectable()
export class UploadService {
  constructor(
    private readonly configService: ConfigService,
    private readonly assetService: AssetService,
  ) {}
  async handleUpload(
    file: Express.Multer.File,
    uploadId: string,
  ): Promise<Asset> {
    const asset = await this.assetService.getByUploadId(uploadId);
    if (!asset) {
      throw new BadRequestException('No asset with this uploadId found');
    }
    const uploadPath = join(
      this.configService.get('UPLOAD_PATH'),
      file.originalname,
    );
    try {
      await this.saveFile(file, uploadPath);
    } catch (e) {
      console.error(e);
      throw new BadRequestException('An error occurred on file upload');
    }
    return this.assetService.update(asset.id, { filename: uploadPath });
  }

  private async saveFile(file: Express.Multer.File, uploadPath: string) {
    return new Promise((resolve, reject) => {
      const writeStream = createWriteStream(uploadPath);
      writeStream.write(file.buffer);
      writeStream.end();

      writeStream.on('finish', () => resolve(uploadPath));
      writeStream.on('error', (error) => reject(error));
    });
  }
}
