import { Module } from '@nestjs/common';
import { DirectionsService } from './directions.service';
import { DirectionsController } from './directions.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [DirectionsController],
  providers: [DirectionsService],
})
export class DirectionsModule {}
