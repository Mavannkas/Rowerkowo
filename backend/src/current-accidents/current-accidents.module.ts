import { Module } from '@nestjs/common';
import { CurrentAccidentsService } from './current-accidents.service';
import { CurrentAccidentsController } from './current-accidents.controller';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';
import {
  CurrentAccidentEntity,
  CurrentAccidentSchema,
} from './entities/current-accident';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      { name: CurrentAccidentEntity.name, schema: CurrentAccidentSchema },
    ]),
  ],
  controllers: [CurrentAccidentsController],
  providers: [CurrentAccidentsService],
})
export class CurrentAccidentsModule {}
