# Module - 응집성있는 설계
모듈? 여러 컴포넌트를 조합하여 작성한 좀 더 큰 작업을 수행하는 단위
!(module)[https://wikidocs.net/images/page/148982/01.png]

Nest app이 실행되기 위해서는 하나의 루트 모듈(AppModule)이 존재하고,  이 루트 모듈은 다른 모듈들로 구성된다.
이렇게 모듈로 쪼개는 이유는 각자 맡은 바 **책임을 나누고** **응집도를 높이기** 위함이다.

또한, MSA 관점에서 모듈이 커지면 하나의 마이크로 서비스로 분리할 수 있다.

### 모듈을 어떻게 나눌것인가?
명확한 기준은 없다. 설계를 하면서, 서비스가 커져 가면서 유사한 기능끼리 묶어야한다.
응집도를 높이는 작업을 게을리 하면 의존관계가 복잡한 코드가 된다.

## @Module
```ts
export declare function Module(metadata: ModuleMetadata): ClassDecorator;

export interface ModuleMetadata {
    imports?: Array<Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference>;
    controllers?: Type<any>[];
    providers?: Provider[];
    exports?: Array<DynamicModule | Promise<DynamicModule> | string | symbol | Provider | ForwardReference | Abstract<any> | Function>;
}
```
#### import 
모듈에서 사용하기 위한 프로바이더를 가지고 있는 다른 **모듈**
음식 배달 서비스에서 유저, 오더, 챗 모듈을 가져와서 **함께 빌드**되도록 한다.

#### controllers / providers
모듈 전반에서 컨트롤러와 프로바이더를 사용할 수 있도록 Nest가 객체를 생성하고 주입한다.

#### export
이 모듈에서 제공하는 컴포넌트를 다른 모듈에서 import해서 사용하고자한다면 export해야한다.
export로 선언했다는 것은 어디에서나 가져다 쓸 수 있으므로 public Interface 또는 API로 간주된다.

## 모듈 다시 내보내기
import한 모듈은 다시 export할 수 있다.

서비스 전반에 쓰이는 공통 기능을 모아 놓은 모듈을 CommonModule,
앱을 구동시키는 데 필요한 기능(로깅, 인터셉터 등)을 CoreModule이라고 가정하자.

AppModule은 앱을 구동시키기위해 CoreModule이 필요한데, CommonModule의 기능도 필요하다.
이경우 AppModule은 둘 다 가져오는 것이 아니라 CoreModule만 가져오고, CoreModule에서는 가져온 CommonModule을
다시 내보내면 AppMdule에서는 가져오지 않아도 된다
 
### 모듈은 프로바이더처럼 주입해서 사용할 수 없다. 모듈간 순환 종속성이 발생하기 때문이다.

## 전역 모듈
nest는 **모듈범위 내에서 프로바이더를 캡슐화**한다.
따라서 모듈에 있는 프로바이더를 사용하려면 모듈을 먼저 import해야 한다.
하지만 헬퍼와 같은 공통기능이나, DB 연결과 같은 전역적으로 쓸 수 있어야하는 프로바이더가
필요한 경우가 있다.

이런 프로바이더를 모아 **전역모듈로 제공**하자!

객체지향관점에서 모든 것을 전역으로 만드는 게 SW 구조상 좋지 않다는 것을 알고 있을 것이다.
모듈은 응집도를 높이기 위함이라 했는데 모든 것을 전역으로 만들면 기능이 어디서나 존재한가는 뜻이므로
응집도가 떨어진다.

**꼭 필요한 기능만 모아 전역 모듈로 사용하자**

