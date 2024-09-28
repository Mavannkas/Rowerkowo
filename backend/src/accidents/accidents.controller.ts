import { Controller, Get, Query } from '@nestjs/common';
import { AccidentsNearToRoadDto } from './dto/AccidentsNearToRoad.dto';
import { AccidentsService } from './accidents.service';

@Controller('accidents')
export class AccidentsController {
  constructor(private readonly co2Service: AccidentsService) {}

  @Get()
  getAccidentsNearToRoad(@Query() query: AccidentsNearToRoadDto) {
    return this.co2Service.getAccidentsNearRoad(query);
  }
}
