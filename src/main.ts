import { accessibleFieldsPlugin, accessibleRecordsPlugin } from "@casl/mongoose";
import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as mongoose from "mongoose";
import { AppModule } from "./app.module";

async function bootstrap() {
  mongoose.plugin(accessibleRecordsPlugin);
  mongoose.plugin(accessibleFieldsPlugin);

  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      // disableErrorMessages: true,
      whitelist: true,
    }),
  );

  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle("Simple Project")
    .setDescription("Simple Project API description")
    .setVersion("1.0")
    .addTag("simple-project")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);

  await app.listen(3000);
}
bootstrap();
