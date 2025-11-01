import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
      description: 'Conteúdo do comentário.',
      example: 'Existe um problema nessa tarefa',
      maxLength: 255,
    })
  content!: string;
}
