import { Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.REQUEST })
export class ScopeExampleService {}

// custom provider
// {
//   provide: 'CACHE_MANAGER',
//   useClass: CacheManager,
//   scope: Scope.TRANSIENT,
// }
