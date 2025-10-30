import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsString,
} from 'class-validator';

export class LoginUserDto {
  @IsEmail({}, { message: 'Informe um e-mail válido' })
  @MaxLength(255, { message: 'O e-mail deve ter no máximo 255 caracteres' })
  @ApiProperty({
    description: 'Email do usuário.',
    example: 'joaosilva@gmail.com',
  })
  email!: string;

  @IsString({ message: 'A senha deve ser uma string' })
  @IsNotEmpty({ message: 'A senha é obrigatória' })
  @MinLength(6, { message: 'A senha deve ter pelo menos 6 caracteres' })
  @MaxLength(128, { message: 'A senha deve ter no máximo 128 caracteres' })
  @ApiProperty({ description: 'Senha do usuário.', example: 'coxinha123' })
  password!: string;
}
