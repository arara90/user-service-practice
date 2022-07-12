import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ProviderExamplesModule } from "./provider-examples/provider-examples.module";
import { ProviderExamplesEnhancementEModule } from "./provider-examples-enhancement/provider-examples-enhancement.module";
import { UsersService } from './users/users.service';
import { EmailService } from './email/email.service';
import { UsersController } from "./users/users.controller";
import { ScopeExampleController } from './scope-example/scope-example.controller';
import { ScopeExampleService } from './scope-example/scope-example.service';

@Module({
  imports: [ProviderExamplesModule, ProviderExamplesEnhancementEModule],
  controllers: [AppController, UsersController, ScopeExampleController],
  providers: [AppService, UsersService, EmailService, ScopeExampleService],
})
export class AppModule {}
