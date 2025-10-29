import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenDto {
  @IsString({ message: 'O token de renovação deve ser uma string.' })
  @IsNotEmpty({ message: 'O token de renovação é obrigatório.' })
  @ApiProperty({
    description: 'O Refresh Token recebido após o login anterior.',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjM0NSIsImlhdCI6MTY3ODg4NjQwMCwiZXhwIjoxNjc5NDkxMjAwfQ.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
  })
  refreshToken!: string;
}
