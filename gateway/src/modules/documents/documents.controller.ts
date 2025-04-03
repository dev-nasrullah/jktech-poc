import {
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UploadedFile,
  UseGuards,
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
import { CaslGuard } from '@/common/guards/casl.guard';
import { ACCESS_TYPE } from '@/common/enum/access-type.enum';
import { Permissions } from '@/common/decorators/permissions.decorator';
import { PERMISSION } from '@/common/enum/permission.enum';

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
  @UseGuards(CaslGuard)
  @Permissions([ACCESS_TYPE.WRITE, PERMISSION.Document])
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
  @UseGuards(CaslGuard)
  @Permissions([ACCESS_TYPE.READ, PERMISSION.Document])
  getAllDocument() {
    return this.documentsService.getAllDocument();
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Get document by id',
  })
  @UseGuards(CaslGuard)
  @Permissions([ACCESS_TYPE.READ, PERMISSION.Document])
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
  @UseGuards(CaslGuard)
  @Permissions([ACCESS_TYPE.UPDATE, PERMISSION.Document])
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
  @UseGuards(CaslGuard)
  @Permissions([ACCESS_TYPE.DELETE, PERMISSION.Document])
  removeDocument(@Param('id', ParseUUIDPipe) id: string) {
    return this.documentsService.removeDocument(id);
  }
}
