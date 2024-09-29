import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { UploadModule } from './upload/upload.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { Co2Module } from './co2/co2.module';
import { DirectionsModule } from './directions/directions.module';
import { CurrentAccidentsModule } from './current-accidents/current-accidents.module';
import { AccidentsModule } from './accidents/accidents.module';
import { RouteSharingModule } from './route-sharing/route-sharing.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGOOSE_URL),
    AuthModule,
    UsersModule,
    UploadModule,
    ScheduleModule.forRoot(),
    Co2Module,
    DirectionsModule,
    CurrentAccidentsModule,
    AccidentsModule,
    RouteSharingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
