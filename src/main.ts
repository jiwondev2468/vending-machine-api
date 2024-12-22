import { NestFactory } from '@nestjs/core';
import { AppModule } from './module/app.module';
import { HttpExceptionFilter } from './filter/http-exception.filter';
import { Logger, ValidationPipe } from '@nestjs/common';
import * as process from 'process';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });

  const logger = new Logger('NestApplication');

  // Swagger 설정
  const config = new DocumentBuilder()
    .setTitle('Vending Machine Management')
    .setDescription('Vending Machine Management project api docs')
    .setVersion('0.0.1')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT', in: 'header' }, 'JWT_ACCESS')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT', in: 'header' }, 'JWT_REFRESH')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  // Global 설정
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe());

  const portNumber = process.env.PORT || 30001;

  await app.listen(portNumber, () => {
    logger.verbose(`App is listening on port ${portNumber}`);
  });
}

bootstrap();
