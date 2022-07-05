import { Controller, Get } from "@nestjs/common";
import { ServiceB } from "./provider-examples.service";

@Controller('provider-examples')
export class ProviderExamplesController {
  constructor(
    private readonly serviceB: ServiceB,
  ) { }

  @Get('/service-b')
  getHelloC(): string {
    console.log('/service-b')
    return this.serviceB.getHello();
  }

}
