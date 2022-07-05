# Provder
제공하고자하는 핵심 기능, 즉 비즈니스 로직을 수행하는 역할
 
## Provider의 형태
- 서비스
- 레포지토리
- 팩토리
- 헬퍼

## Nest Provider
### 핵심은 의존성 주입
![img.png](https://wikidocs.net/images/page/158499/%E1%84%80%E1%85%B3%E1%84%85%E1%85%B5%E1%86%B74.1.png)

```ts
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
```

UsersService는 UsersController의 생성자에서 주입받아, usersService라는 객체 멤버 변수에 할당되어 사용
즉, **작업의 위임**이 일어났다.

```ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
   // ...

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
```

### @Injectable()
이 데코레이터를 선언하여 어떤 Nest 컴포넌트에서도 주입할 수 있는 프로바이더가 된다.
별도의 스코프를 지정해 주지 않으면 일반적으로 싱글톤 인스턴스가 생성된다.

## 프로바이더의 등록과 사용
### 등록
프로바이더 인스턴스를 사용할 수 있도록 모듈에서 등록해주어야 한다.
```ts
@Module({
   // ...
  providers: [UsersService]
})
export class UsersModule {}
```

### 생성자를 통한 프로바이더 주입
```ts
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
```
### 속성(property) 기반 주입
프로바이더를 직접 주입받아 사용하지 않고,
상속관계에 있는 **자식 클래스를 주입받아 사용하고 싶은 경우**

```ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class ServiceA {
  getHello(): string {
    return 'Hello World A!';
  }
}

// @Injectable() 이 선언되어 있지 않습니다. BaseService 클래스를 직접 참조하지 않기 때문입니다.
export class BaseService {
  constructor(private readonly serviceA: ServiceA) {}

  getHello(): string {
    return 'Hello World BASE!';
  }

  doSomeFuncFromA(): string {
    return this.serviceA.getHello();
  }
}
```
```ts
@Injectable()
export class ServiceB extends BaseService {
  getHello(): string {
    return this.doSomeFuncFromA();
  }
}
```

```ts
@Controller()
export class AppController {
  constructor(
    private readonly serviceB: ServiceB,
  ) { }

  @Get('/serviceB')
  getHelloC(): string {
    return this.serviceB.getHello(); // BaseService.doSomeFuncFromA -> serviceA.getHello()?
  }
}
```

에러가 발생한다.
BaseService는 주입을 받을 수 있는 클래스로 선언되어 있지 않기 때문에 
**Nest의 IoC 컨테이너**는 생성자에 선언된 ServiceA를 주입하지 않습니다. 

-- --
provider-examples module 참고
