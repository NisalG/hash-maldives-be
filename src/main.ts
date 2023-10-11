import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  /*
    With the whitelist option set to true, ValidationPipe will automatically remove all 
    non-whitelisted properties, where non-whitelisted means properties without any 
    validation decorators or not present in the DTO.
  */
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // ---swagger---
  const config = new DocumentBuilder()
    .setTitle('Hash Maldives Sample Backend')
    .setDescription('Hash Maldives Sample Backend Details')
    .setVersion('1.0')
    .addTag('hash-maldives-sample-backend-app')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  // ---swagger---end

  app.enableCors();
  await app.listen(3000);
}
bootstrap();
