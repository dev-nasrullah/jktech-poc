import { IsUUID } from 'class-validator';

export class CreateIngestionDto {
  @IsUUID()
  documentId: string;
}
