import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AccidentEntity, AccidentSchema } from './entities/accident.entity';
import { AccidentIndexerService } from './accidentIndexer.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: AccidentEntity.name, schema: AccidentSchema }]),
    HttpModule
  ],
  providers: [AccidentIndexerService],
})
export class AccidentIndexerModule {}
