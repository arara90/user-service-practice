import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ProviderExamplesModule } from "./provider-examples/provider-examples.module";
import { ProviderExamplesEnhancementEModule } from "./provider-examples-enhancement/provider-examples-enhancement.module";

@Module({
  imports: [ProviderExamplesModule, ProviderExamplesEnhancementEModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
