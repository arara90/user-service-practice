import { Injectable } from "@nestjs/common";

@Injectable()
export class ProviderExamplesService {
}

export class BaseService {
  constructor(private readonly serviceA: ServiceA) {
  }

  getHello(): string {
    return "Hello World BASE!";
  }

  doSomeFuncFromA(): string {
    return this.serviceA.getHello();
  }
}

@Injectable()
export class ServiceA {
  getHello(): string {
    return "Hello World A!";
  }
}

@Injectable()
export class ServiceB extends BaseService {
  getHello(): string {
    return this.doSomeFuncFromA();
  }
}
