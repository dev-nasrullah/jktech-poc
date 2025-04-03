import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { IngestionService } from './ingestion.service';
import { ApiBearerAuth, ApiBody, ApiResponse } from '@nestjs/swagger';
import { CreateIngestionDto } from './dto/create-ingestion.dto';
import { Context } from '@/common/decorators/context.decorator';
import { LocalContext } from '@/common/@types/local-context.type';
import { CaslGuard } from '@/common/guards/casl.guard';
import { Permissions } from '@/common/decorators/permissions.decorator';
import { ACCESS_TYPE } from '@/common/enum/access-type.enum';
import { PERMISSION } from '@/common/enum/permission.enum';

@Controller('ingestion')
@ApiBearerAuth()
export class IngestionController {
  constructor(private readonly ingestionService: IngestionService) {}

  @Post()
  @ApiBody({
    description: 'create ingestion',
    schema: {
      type: 'object',
      properties: {
        documentId: {
          type: 'string',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'create ingestion',
  })
  @UseGuards(CaslGuard)
  @Permissions([ACCESS_TYPE.WRITE, PERMISSION.Ingestion])
  create(@Body() body: CreateIngestionDto, @Context() ctx: LocalContext) {
    return this.ingestionService.createIngestion(body, ctx.userId);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'get ingestion',
  })
  @UseGuards(CaslGuard)
  @Permissions([ACCESS_TYPE.READ, PERMISSION.Ingestion])
  get(@Context() ctx: LocalContext) {
    return this.ingestionService.getIngestions(ctx.id);
  }
}
