import { Controller, Get, Query } from '@nestjs/common';
import { CurrentAccidentsService } from './current-accidents.service';
import { CurrentAccidentDto } from './dto/AirQualityNearToRoad.dto';

@Controller('current-accidents')
export class CurrentAccidentsController {
  constructor(private readonly currentAccidentsService: CurrentAccidentsService) {}

  @Get()
  getAll(@Query() query: CurrentAccidentDto) {
    return this.currentAccidentsService.getAll(query);
  }
}
