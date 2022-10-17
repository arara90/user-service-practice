import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class ServiceA {
  getHello(): string {
    return "Hello World A!";
  }
}

export class BaseService {
  // @Injectable() 이 선언되어 있지 않습니다. BaseService 클래스를 직접 참조하지 않기 때문입니다.
  constructor(
    // 2. 속성기반주입 - 상속관계일때
    @Inject(ServiceA) private readonly serviceA: ServiceA) {
  }

  getHello(): string {
    return "Hello World BASE!";
  }

  doSomeFuncFromA(): string {
    return this.serviceA.getHello();
  }
}

@Injectable()
export class ServiceB extends BaseService {
  // 1. super의 사용 - 일반적 사용
  // constructor(private readonly _serviceA: ServiceA) {
  //   // super(_serviceA);
  // }
  getHello(): string {
    return this.doSomeFuncFromA();
  }
}
