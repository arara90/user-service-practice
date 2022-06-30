import { Controller, Get } from "@nestjs/common";
import { ServiceB } from "../../dist/provider-examples/provider-examples.service";

@Controller('provider-examples')
export class ProviderExamplesController {
  constructor(
    private readonly serviceB: ServiceB,
  ) { }

  @Get('/serviceB')
  getHelloC(): string {
    return this.serviceB.getHello();
  }

}
