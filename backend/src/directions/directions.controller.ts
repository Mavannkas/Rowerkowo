import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { DirectionsService } from './directions.service';
import { RoutingMode } from './entities/direction.entity';

@Controller('directions')
export class DirectionsController {
  constructor(private readonly directionsService: DirectionsService) {}

  @Get()
  findRoute(@Query('start') start: string, @Query('end') end: string, @Query('mode') mode?: RoutingMode) {
    return this.directionsService.findRoute(start, end, mode);
  }
}
