import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AccidentEntity, AccidentSchema } from './entities/accident.entity';
import { AccidentsService } from './accidents.service';
import { HttpModule } from '@nestjs/axios';
import { AccidentsController } from './accidents.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: AccidentEntity.name, schema: AccidentSchema }]),
    HttpModule
  ],
  providers: [AccidentsService],
  controllers: [AccidentsController],
})
export class AccidentsModule {}
