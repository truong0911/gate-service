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
      disableErrorMessages: true,
      whitelist: true,
    }),
  );

  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle(process.env.npm_package_name)
    .setVersion("0.0.1")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);

  await app.listen(3000);
}
bootstrap();
