import { Controller, Get, Query } from '@nestjs/common';
import { Co2Service } from './co2.service';
import { query } from 'express';
import { AirQualityNearToRoadDto } from './dto/AirQualityNearToRoad.dto';

@Controller('co2')
export class Co2Controller {
  constructor(private readonly co2Service: Co2Service) {}

  @Get()
  getAirQualityNearToRoad(@Query() query: AirQualityNearToRoadDto) {
    console.log(`co2: ${JSON.stringify(query)}`);
    return this.co2Service.getAirQualityNearRoad(query);
  }
}
