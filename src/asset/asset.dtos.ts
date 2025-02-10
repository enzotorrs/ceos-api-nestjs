import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateAssetDTO {
  @ApiProperty()
  @IsString()
  name: string
}
