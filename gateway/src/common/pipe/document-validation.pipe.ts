import {
  ArgumentMetadata,
  HttpStatus,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { ParseFilePipeBuilder } from '@nestjs/common';
import { UPLOAD } from '@/common/constants/upload.const';

@Injectable()
export class DocumentValidationPipe implements PipeTransform {
  private readonly parseFilePipe;

  constructor() {
    this.parseFilePipe = new ParseFilePipeBuilder()
      .addFileTypeValidator({
        fileType: UPLOAD.allowedDocuments,
      })
      .addMaxSizeValidator({
        maxSize: UPLOAD.maxSize,
      })
      .build({
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        fileIsRequired: true,
      });
  }

  transform(value: any, metadata: ArgumentMetadata) {
    return this.parseFilePipe.transform(value, metadata);
  }
}
