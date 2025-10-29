import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsString,
} from 'class-validator';

export class LoginUserDto {
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @MaxLength(255, { message: 'Email is too long' })
  @ApiProperty({
    description: 'Email do usuário.',
    example: 'joaosilva@gmail.com',
  })
  email!: string;

  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  @MaxLength(128, { message: 'Password is too long' })
  @ApiProperty({ description: 'Senha do usuário.', example: 'coxinha123' })
  password!: string;
}
