import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsDate,
  IsNotEmpty,
  MinLength,
  MaxLength,
} from 'class-validator';

export class GetUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  _id: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  @ApiProperty()
  lastName: string;

  @IsNotEmpty()
  @ApiProperty()
  @MinLength(3)
  @MaxLength(100)
  @IsString()
  email: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  password: string;

  @ApiProperty()
  @IsDate()
  createdAt: Date;

  @ApiProperty()
  @IsDate()
  updatedAt: Date;
}
