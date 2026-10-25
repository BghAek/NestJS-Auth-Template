import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";


export class CreateTaskDto {
  @ApiProperty({ example: 'build auth system' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({ example: 'Implement JWT with refresh tokens', required: false })
  @IsString()
  @IsOptional()
  description?: string;

}