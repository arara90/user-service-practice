import { Controller, Get } from "@nestjs/common";
import { ServiceB } from "./provider-examples-enhancement.service";

@Controller('provider-examples-enhancement')
export class ProviderExamplesEnhancementController {
  constructor(
    private readonly serviceB: ServiceB,
  ) { }

  @Get('/service-b')
  getHelloC(): string {
    console.log('/service-b')
    return this.serviceB.getHello();
  }

}
