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

500 error 발생

### 해결
serviceB 생성자에 serviceA를 주입하자.
```ts
@Injectable()
export class ServiceB extends BaseService {
  constructor(private readonly _serviceA: ServiceA) {
    super(_serviceA);
  }
  getHello(): string {
    return this.doSomeFuncFromA();
  }
}
```

하지만 super로 필요한 프로바이더를 전달하는 것은 매우 귀찮음
이럴때 **속성기반 프로바이더!**

## 속성기반 프로바이더 @Inject()
```ts
export class BaseService {
  @Inject(ServiceA) private readonly serviceA: ServiceA;
    doSomeFuncFromA(): string {
    return this.serviceA.getHello();
  }
}
```

Inject데코레이터의 인자는 '타입(클래스 이름)', '문자열', '심볼' 이 될 수 있다.
어떤 걸 쓸지는 프로바이더가 어떻게 정의되었는지에 따라 다르다.
@Injectable()이 선언된 클래스는 **클래스 이름**을 쓰면된다.
**문자열, 심볼**은 커스텀 프로바이더의 경우 쓴다.


단,
상속관계에 있지 않는 경우는 속성기반 주입을 사용하지 않고,
생성자 기반 주입을 사용하는 것을 권장한다.
(Default는 생성자 기반 주입, Extends 시 속성기반)

## 실습
### 회원가입 이메일 발송
#### 외부 이메일 서비스를 고를 때 고려할 점
- 이메일 전송, 전송기록확인, 이메일 보안, 스팸 처리, 바운스(메일 수신서버로부터 이메일이 반송되는 것)확인의 기능을 매끄럽게 제공하는가입니다.
- 
