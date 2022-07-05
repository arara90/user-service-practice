import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ProviderExamplesModule } from "./provider-examples/provider-examples.module";

@Module({
  imports: [ProviderExamplesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
