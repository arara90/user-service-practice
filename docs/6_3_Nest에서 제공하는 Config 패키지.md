# 동적 모듈 (Dynamic Module)

동적 모듈은 모듈이 생성될 때 동적으로 변수들이 정해진다.
즉, **호스트 모듈**(프로바이더나 컨트롤러와 같은 컴포넌트를 제공하는 모듈)을 가져다 쓰는 소비모듈에서 
호스트모듈을 생성할 때 동적으로 값을 설정하는 방식입니다.

정적 모듈에 비해 동적 모듈을 사용하면 코드가 간결해진다.
모듈 인스턴스가 생성될 때 결정되긴 하지만, 모듈 인스턴스마다 다르게 결정되어야 하는 것들을
소비 모듈에서 지정할 수 있기 때문이다.
또한 동적모듈은 정적모듈과 함께 제공할 수 있다.

동적 모듈의 대표적인 예로는 보통 Config라고 부르는 모듈이 있다.
Config 모듈은 실행환경에 따라 서버에 설정되는 환경변수를 관리하는 모듈이다.

ConfigModule을 동적으로 생성하는 예를 보기 전에 잠시 Node.js 서버에서 일반적으로
사용하는 환경변수 관리 방법을 보자.

https://wikidocs.net/158579

###  .dotenv 라이브러리를 통해 .env로 관리
Node.js는 NODE_ENV라는 환경변수를 활용하여 서버의 환경을 구분합니다. NODE_ENV는 다음 명령어로 설정하거나 OS가 구동될 때 변수를 설정해야 합니다.

> 윈도우: set NODE_ENV=development
> 리눅스 또는 OSX: export NODE_ENV=development

매번 터미널을 새로 열때마다 NODE_ENV를 새로 설정하는 것을 귀찮은 일이니, package.json 파일을 수정하여 npm run start:dev 명령이 수행될 때 NODE_ENV가 development로 설정되도록 합시다.
 ```ts
 "scripts": {
 ...
 "start:dev": "NODE_ENV=development nest start --watch",
 ...
 }
 ```


.env 파일의 경로를 NODE_ENV의 값에 따라 다르게 지정합니다.

```ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({
  path: path.resolve(
    (process.env.NODE_ENV === 'production') ? '.production.env'
      : (process.env.NODE_ENV === 'stage') ? '.stage.env' : '.development.env'
  )
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
```

```ts
@Controller()
export class AppController {

  @Get()
  getHello(): string {
    return process.env.DATABASE_HOST;
  }
}
```

환경에 맞게 잘 읽어오는 것을 확인. package.json에서 NODE_ENV의 값을 
stage, production으로 바꾸어 가면서 출력이 변경되는지 확인해 보세요. 
NODE_ENV는 앱 구동시 설정하는 값이므로 변경 후에는 서버를 재시동해야 합니다.


위에 내용 실습하기!!


## Nest에서 제공하는 Config 패키지
Nest는 dotenv를 내부적으로 활용하는 @nestjs/config 패키지를 제공한다.
이를 이용해서 ConfigModule을 동적으로 생성하자.

npm i --save @nestjs/config

ConfigModule 이름을 가진 모듈이 패키지 안에 존재한다.
AppModule에서 **동적모듈**로 가져와보자

```ts
...
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot()],
  ...
})
export class AppModule { }
```

정적모듈과 달리 forRoot() 메소드를 호출한다.

### forRoot
DynamicModule을 리턴하는 정적 메서드이다. 동적 모듈을 작성할 때 forRoot라는 이름 대신 
어떤 다른 이름을 써도 상관없지만 관례상 forRoot나 register로 붙인다.
비동기 함수 일때는 forRootAsync, registerAsync로 한다.

```ts
static forRoot(options?: ConfigModuleOptions): DynamicModule;
```

인자로 ConfigModuleOptions를 받고 있다. 즉, ConfigModule은 소비 모듈이 원하는 옵션값을 전달하여 원하는 대로 '동적으로' ConfigModule을 생성한다. 
> Example: TypeOrmModule 
> ```ts
> export declare class TypeOrmModule {
>    static forRoot(options?: TypeOrmModuleOptions): DynamicModule;
>    static forFeature(entities?: EntityClassOrSchema[], dataSource?: DataSource | DataSourceOptions | string): DynamicModule;
>    static forRootAsync(options: TypeOrmModuleAsyncOptions): DynamicModule;
> }
> ```


### ConfigModule
```ts
export interface ConfigModuleOptions {
    cache?: boolean;
    isGlobal?: boolean;
    ignoreEnvFile?: boolean;
    ignoreEnvVars?: boolean;
    envFilePath?: string | string[];
    encoding?: string;
    validate?: (config: Record<string, any>) => Record<string, any>;
    validationSchema?: any;
    validationOptions?: Record<string, any>;
    load?: Array<ConfigFactory>;
    expandVariables?: boolean;
}
```

ConfigModule에 envFilePath옵션을 줘보자!
위에서 envdot을 이용한 것과 같은 api를 날려도 결과가 같아야한다!

Nest가 제공하는 ConfigModule은 .env 파일에서 읽어온 환경변수 값을 가져오는
프로바이더 ConfigService가 있다. 이를 원하는 컴포넌트에서 주입하여 사용하자.

```ts
...
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({
    envFilePath: (process.env.NODE_ENV === 'production') ? '.production.env'
      : (process.env.NODE_ENV === 'stage') ? '.stage.env' : '.development.env'
  })],
  controllers: [AppController],
  providers: [AppService, ConfigService],
})
export class AppModule { }
```

```ts
import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Controller()
export class AppController {
  constructor(
    private readonly configService: ConfigService,
  ) { }

  @Get('/db-host')
  getDatabaseHostFromConfigService(): string {
    return this.configService.get('DATABASE_HOST');
  }
}

```


Nest 공식문서에는 ConfigModule을 동적 모듈로 직접 작성하는 예가 있다.
@nest/config 패키지를 이용하지 않고 직접 dotenv를 사용하여
.env파일이 존재하는 folder를 동적으로 전달하도록한다.
.env파일을 별도로 관리하고 싶을 때, 또는 직접 동적 모듈을 만들어 볼 때 참고해보자.
