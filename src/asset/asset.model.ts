import { ApiProperty } from '@nestjs/swagger';
import { type } from 'os';
import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';

@Table({
  tableName: 'asset',
})
export class Asset extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @ApiProperty()
  @Column({
    type: DataType.STRING,
  })
  name: string;

  @Column({
    type: DataType.BOOLEAN,
  })
  folder: boolean;

  @ApiProperty()
  @ForeignKey(() => Asset)
  @Column({
    type: DataType.INTEGER,
    field: 'parent_asset_id',
  })
  parentAssetId: number;

  @ApiProperty()
  @BelongsTo(() => Asset, { as: 'parentAsset' })
  parentAsset: Asset;

  @ApiProperty()
  @HasMany(() => Asset, { as: 'childAssets' })
  childAssets: Asset[];

  @ApiProperty()
  @Column({
    type: DataType.STRING,
    field: 'upload_id'
  })
  uploadId: string

  @ApiProperty()
  @Column({
    type: DataType.STRING,
  })
  filename: string

  @ApiProperty()
  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt?: Date;

  @ApiProperty()
  @UpdatedAt
  @Column({ field: 'updated_at' })
  updatedAt?: Date;
}
