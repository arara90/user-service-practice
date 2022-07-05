import { Module } from "@nestjs/common";
import { ProviderExamplesController } from "./provider-examples.controller";
import { ServiceB } from "./provider-examples.service";

@Module({
  imports: [],
  controllers: [ProviderExamplesController],
  providers: [ServiceB],
})
export class ProviderExamplesModule {}
