import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // validation pipe
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  // swagger
  const config = new DocumentBuilder()
    .setTitle('JK Tech API')
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  // helmet
  app.use(helmet());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
