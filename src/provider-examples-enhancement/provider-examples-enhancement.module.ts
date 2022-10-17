import { Module } from "@nestjs/common";
import { ServiceA, ServiceB } from "./provider-examples-enhancement.service";
import { ProviderExamplesEnhancementController } from "./provider-examples-enhancement.controller";

@Module({
  imports: [],
  controllers: [ProviderExamplesEnhancementController],
  providers: [ServiceB, ServiceA],
})
export class ProviderExamplesEnhancementEModule {}
