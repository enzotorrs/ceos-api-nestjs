import {
  INestApplication,
} from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Test, TestingModule } from '@nestjs/testing';
import { AssetService } from './asset.service';
import { AssetModule } from './asset.module';

describe('AssetService', () => {
  let app: INestApplication;
  let assetService: AssetService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AssetModule,
        SequelizeModule.forRoot({
          dialect: 'sqlite',
          storage: ':memory:',
          synchronize: true,
          autoLoadModels: true,
          logging: false,
        }),
      ],
    }).compile();

    assetService = moduleFixture.get<AssetService>(AssetService);
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('CREATE Asset not folder cannot be parent asset of another asset', async () => {
    const asset = await assetService.create({
      name: 'test',
      folder: false
    });
    expect(async () => await assetService.create({
      name: 'test',
      folder: false,
      parentAssetId: asset.id
    })).rejects.toThrow()
    const folder = await assetService.create({
      name: 'test',
      folder: true,
    })
    await assetService.create({
      name: 'test',
      folder: false,
      parentAssetId: folder.id
    })
  });
});
