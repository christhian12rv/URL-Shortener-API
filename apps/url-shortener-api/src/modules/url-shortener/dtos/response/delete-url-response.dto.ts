import { ApiProperty } from '@nestjs/swagger';

export class DeleteUrlResponseDTO {
  @ApiProperty({
    description: 'Indicação se a Url encurtada foi deletada',
    example: true,
  })
  deleted: boolean;
}
