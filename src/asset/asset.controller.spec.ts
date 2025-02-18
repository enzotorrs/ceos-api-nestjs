import {
  INestApplication,
  NotFoundException,
  ValidationPipe,
} from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AssetService } from './asset.service';
import { SequelizeValidationFilter } from 'src/core/filters/validation.filter';
import { AssetModule } from './asset.module';

describe('Asset', () => {
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
    app.useGlobalFilters(new SequelizeValidationFilter());
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );
    await app.init();
  });

  it('GET /asset/:id', async () => {
    await request(app.getHttpServer()).get('/asset/1').expect(404);
    const asset = await assetService.create({
      name: 'test',
    });
    await request(app.getHttpServer()).get(`/asset/${asset.id}`).expect(200);
  });

  it('POST /asset', async () => {
    const res = await request(app.getHttpServer())
      .post('/asset')
      .send({ name: 'teste' })
      .expect(201);
    const check = await assetService.getByIdOr404(res.body.id);
    expect(check.id).toBeTruthy();
  });

  it('PATCH /asset/:id', async () => {
    await request(app.getHttpServer()).patch('/asset/1').expect(404);
    const asset = await assetService.create({
      name: 'test',
    });
    const res = await request(app.getHttpServer())
      .patch(`/asset/${asset.id}`)
      .send({ name: 'test updated' })
      .expect(200);
    const check = await assetService.getByIdOr404(res.body.id);
    expect(check.name).toBe('test updated');
  });

  it('DELETE /asset/:id', async () => {
    const asset = await assetService.create({
      name: 'test',
    });
    await request(app.getHttpServer()).delete(`/asset/${asset.id}`).expect(204);
    expect(
      async () => await assetService.getByIdOr404(asset.id),
    ).rejects.toThrow(NotFoundException);
  });
});
