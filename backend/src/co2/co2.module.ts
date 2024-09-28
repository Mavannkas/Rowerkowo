import { Module } from '@nestjs/common';
import { Co2Service } from './co2.service';
import { Co2Controller } from './co2.controller';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';
import { Co2Entity, Co2Schema } from './entities/co2.entity';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([{ name: Co2Entity.name, schema: Co2Schema }]),
  ],
  controllers: [Co2Controller],
  providers: [Co2Service],
})
export class Co2Module {}
