import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersController } from './users/users.controller';
import { ProviderExamplesController } from './provider-examples/provider-examples.controller';
import { ProviderExamplesService } from './provider-examples/provider-examples.service';
import { ProviderExamplesModule } from './provider-examples/provider-examples.module';

@Module({
  imports: [ProviderExamplesModule],
  controllers: [AppController, UsersController, ProviderExamplesController],
  providers: [AppService, ProviderExamplesService],
})
export class AppModule {}
