import { Controller, Scope } from "@nestjs/common";

@Controller({
  path: 'scope-example',
  scope: Scope.REQUEST,
})
export class ScopeExampleController {}
