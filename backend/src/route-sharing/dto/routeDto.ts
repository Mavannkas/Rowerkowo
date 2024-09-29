import { RouteTag } from '../entities/routeEntity';

export class RouteDto {
  route: any;
  name: string;
  tags: RouteTag[];
  start: string;
  finish: string;
}