import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RouteEntity } from './entities/routeEntity';
import { RouteDto } from './dto/routeDto';
import { JwtPayload } from '../auth/auth.types';

@Injectable()
export class RouteSharingService {
  constructor(
    @InjectModel(RouteEntity.name) private routeEntityModel: Model<RouteEntity>,
  ) {}

  async shareRoute(routeDto: RouteDto, user: JwtPayload): Promise<string> {
    const routeEntity: RouteEntity = {...routeDto, createdBy: user.username};
    const newRoute = new this.routeEntityModel(routeEntity);
    const route = await newRoute.save();
    return route.id;
  }

  async getRoutes(): Promise<RouteEntity[]> {
    return this.routeEntityModel.find().exec();
  }

}
