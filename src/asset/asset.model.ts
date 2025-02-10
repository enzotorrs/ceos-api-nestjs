import { ApiProperty } from '@nestjs/swagger';
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
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
}
