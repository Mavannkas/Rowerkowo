import { Module } from '@nestjs/common';
import { RouteSharingController } from './route-sharing.controller';
import { RouteSharingService } from './route-sharing.service';
import { MongooseModule } from '@nestjs/mongoose';
import { RouteEntity, RouteSchema } from './entities/routeEntity';

@Module({
  imports: [MongooseModule.forFeature([{ name: RouteEntity.name, schema: RouteSchema }]),],
  controllers: [RouteSharingController],
  providers: [RouteSharingService]
})
export class RouteSharingModule {}
