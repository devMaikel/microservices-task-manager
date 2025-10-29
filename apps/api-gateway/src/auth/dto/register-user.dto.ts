import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsString,
} from 'class-validator';

export class RegisterUserDto {
  @IsString({ message: 'O nome deve ser uma string.' })
  @IsNotEmpty({ message: 'O nome é obrigatório.' })
  @MaxLength(100, { message: 'O nome deve ter no máximo 100 caracteres.' })
  @ApiProperty({ description: 'Nome do usuário.', example: 'João Silva' })
  name!: string;

  @IsEmail({}, { message: 'Informe um e-mail válido.' })
  @MaxLength(255, { message: 'O e-mail deve ter no máximo 255 caracteres.' })
  @ApiProperty({
    description: 'E-mail do usuário.',
    example: 'joaosilva@gmail.com',
  })
  email!: string;

  @IsString({ message: 'A senha deve ser uma string.' })
  @IsNotEmpty({ message: 'A senha é obrigatória.' })
  @MinLength(6, { message: 'A senha deve ter pelo menos 6 caracteres.' })
  @MaxLength(128, { message: 'A senha deve ter no máximo 128 caracteres.' })
  @ApiProperty({ description: 'Senha do usuário.', example: 'coxinha123' })
  password!: string;
}
