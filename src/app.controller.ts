import { Controller, Get } from '@nestjs/common'
import { AppService } from './app.service'
import { CommonService } from './common/common.service'
import { ConfigService } from "@nestjs/config";

@Controller()
export class AppController {
  constructor(
    private readonly commonService: CommonService,
    private readonly appService: AppService,
    private readonly configService : ConfigService
  ) {}

  // dotenv 이용
  // @Get('/db-host')
  // getDatabaseHost(): string {
  //   return process.env.DATABASE_HOST;
  // }

  @Get('/db-host')
  getDatabaseHost(): string {
    return this.configService.get('DATABASE_HOST')
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/common-hello')
  getCommonHello(): string {
    return this.commonService.hello();
  }
}
