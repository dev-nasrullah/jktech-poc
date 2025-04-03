import {
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { DocumentsService } from './documents.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiResponse,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentValidationPipe } from '@/common/pipe/document-validation.pipe';

@Controller('documents')
@ApiBearerAuth()
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Upload new document',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'file',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  createDocument(
    @UploadedFile(DocumentValidationPipe) file: Express.Multer.File,
  ) {
    return this.documentsService.createDocument(file);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Get all documents',
  })
  getAllDocument() {
    return this.documentsService.getAllDocument();
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Get document by id',
  })
  getDocumentById(@Param('id', ParseUUIDPipe) id: string) {
    return this.documentsService.getDocumentById(id);
  }

  @Put(':id')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Document update',
    required: true,
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully update document',
  })
  @UseInterceptors(FileInterceptor('file'))
  updateDocument(
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFile(DocumentValidationPipe) file: Express.Multer.File,
  ) {
    return this.documentsService.updateDocument(id, file);
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'Successfully delete document',
  })
  removeDocument(@Param('id', ParseUUIDPipe) id: string) {
    return this.documentsService.removeDocument(id);
  }
}
