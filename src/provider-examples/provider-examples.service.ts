import { Injectable } from '@nestjs/common';

export class BaseService {
  constructor(private readonly serviceA: ServiceA) {
  }

  getHello(): string {
    return 'Hello World BASE!';
  }

  doSomeFuncFromA(): string {
    return this.serviceA.getHello();
  }
}

@Injectable()
export class ServiceA {
  getHello(): string {
    return 'Hello World A!';
  }
}

@Injectable()
export class ServiceB extends BaseService {
  // BASEService는 주입을 받을 수 있는 클래스로 선언되어 있지 않기 때문에 nest의 IoC 컨테이너는 생성자에 선언된
  // service A를 주입하지 않는다.
  getHello(): string {
    return this.doSomeFuncFromA();
  }
}
