import { Controller, Get } from '@nestjs/common';
import { SeeService } from './see.service';
@Controller('see')
export class SeeController {
  constructor(private readonly seeService: SeeService) {}

  @Get()
  executeSeed() {
    return this.seeService.executeSeed3();
  }
}
