import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
// import * as dotenv from 'dotenv';
// import * as path from 'path';
// import { ValidationPipe } from './pipe/validation.pipe';

import { ValidationPipe } from "@nestjs/common";
import { OrmConfig } from "./config/ormConfig";
import * as fs from "fs";

// dotenv.config({
//   path: path.resolve(
//     process.env.NODE_ENV === 'production'
//       ? '.productions.env'
//       : (process.env.NODE_ENV === 'stage' ? '.stage.env' : '.development.env')
//   )
// });

async function bootstrap() {
  await makeOrmConfig();

  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  // class-transformer가 적용되기 위해 Transform 속성을 True로 주어야한다.
  await app.listen(16710);
}

async function makeOrmConfig() {
  const configService = new OrmConfig(process.env);
  const typeormConfig = configService.getTypeOrmConfig();

  if (fs.existsSync("ormconfig.json")) {
    fs.unlinkSync("ormconfig.json");
  }

  fs.writeFileSync(
    "ormconfig.json",
    JSON.stringify(typeormConfig, null, 2)
  );
}

bootstrap();
