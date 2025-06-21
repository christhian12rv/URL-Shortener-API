import { ApiProperty } from '@nestjs/swagger';

export class BaseEntity {
  @ApiProperty({
    description: 'Identificador único',
    example: '38666be4-43fb-46d0-82df-c75673c13114',
  })
  id: string;

  @ApiProperty({
    description: 'Data de criação do registro',
    example: '2025-05-30T13:16:40.734Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Data de modificação do registro',
    example: '2025-05-30T13:16:40.734Z',
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'Data de exclusão do registro',
    example: '2025-05-30T13:16:40.734Z',
  })
  deletedAt?: Date | null;
}
