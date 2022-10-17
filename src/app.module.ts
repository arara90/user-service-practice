import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProviderExamplesModule } from './provider-examples/provider-examples.module';
import { ProviderExamplesEnhancementEModule } from './provider-examples-enhancement/provider-examples-enhancement.module';
import { ScopeExampleController } from './scope-example/scope-example.controller';
import { ScopeExampleService } from './scope-example/scope-example.service';
import { CoreModule } from './core/core.module';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from "@nestjs/config";
import emailConfig from "./config/emailConfig";
import { validationSchema } from "./config/validationSchema";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: process.env.NODE_ENV === 'production'
        ? '.production.env'
        : (process.env.NODE_ENV === 'stage') ? '.stage.env' : '.development.env'
    }),
    ConfigModule.forRoot({
      envFilePath: [`${__dirname}/config/env/.${process.env.NODE_ENV}.env`],
      load: [emailConfig],
      isGlobal: true, // 전역모듈로 동작하여 어느 모듈에서나 사용가능.
      validationSchema,
    }),
    TypeOrmModule.forRoot(),
    ProviderExamplesModule,
    ProviderExamplesEnhancementEModule,
    CoreModule,
    UsersModule,
  ],
  controllers: [AppController, ScopeExampleController],
  providers: [AppService, ScopeExampleService, ConfigService],
})
export class AppModule {}
