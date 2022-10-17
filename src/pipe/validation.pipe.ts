import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {

    // 1. metatype이 파이프가 지원하는 타입인지 검사한다.
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    // 2. 순수 자바 스크립트 객체를 클래스 객체로 바꿔준다.
    // class-validator 유효성 검사 데코레이터는 타입이 필요하다. 네트워크 요청을 통해 들어온 데이터는 역직렬화 과정에서 본문의 객체가 아무런 타입 정보도 가지고 있지 않기 때문에
    // 타입을 지정하는 변환과정을 plainToInstance로 수행하는 것 이다.
    const object = plainToInstance(metatype, value);
    const errors = await validate(object);

    // 유효성 검사에 실패하면 400 에러, 아니면 값을 그대로 전달한다.
    if (errors.length > 0) {
      throw new BadRequestException("validation failed");
    }

    return value;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}

