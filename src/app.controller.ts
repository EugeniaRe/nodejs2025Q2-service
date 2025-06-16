// import { Controller, Get } from '@nestjs/common';
// import { AppService } from './app.service';

// @Controller()
// export class AppController {
//   constructor(private readonly appService: AppService) {}

//   @Get()
//   getHello(): string {
//     return this.appService.getHello();
//   }
// }

import { Controller, Get } from '@nestjs/common';
import { DataSource } from 'typeorm';
// import { LoggingService } from './logging/logging.service';

@Controller()
export class AppController {
  constructor(
    private dataSource: DataSource,
    // private readonly LoggingService: LoggingService,
  ) {}

  @Get('/health')
  async healthCheck() {
    // this.LoggingService.info('Health check');
    const manager = this.dataSource.manager;
    const result = await manager.query('SELECT NOW()');
    return { status: 'ok', dbTime: result[0].now };
  }
}
