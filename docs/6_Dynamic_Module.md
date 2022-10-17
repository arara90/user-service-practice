# 동적 모듈 (Dynamic Module)

동적 모듈은 **모듈이 생성될 때 동적으로 변수들이 정해진다**.
즉, **호스트 모듈**(프로바이더나 컨트롤러와 같은 컴포넌트를 제공하는 모듈)을 가져다 쓰는 **소비모듈에서 
호스트모듈을 생성할 때 동적으로 값을 설정하는 방식**입니다.

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
