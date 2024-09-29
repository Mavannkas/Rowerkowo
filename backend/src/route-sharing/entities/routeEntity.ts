import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type RouteDocument = HydratedDocument<RouteEntity>;

export interface Route {
  route: any;
  name: string;
  tags: RouteTag[];
  createdBy: string;
  start: string;
  finish: string;
}

export enum RouteTag {
  Family = 'Rodzinna',
  Kids = 'Przyjazna dziecom',
  Challenging = 'Wymagająca',
  Scenic = 'Malownicza',
  Urban = 'Miejska',
  Rural = 'Wiejska',
  Historical = 'Historyczna',
  Sporty = 'Sportowa',
}
@Schema()
export class RouteEntity implements Route {
  @Prop({
    required: true,
  })
  route: any;

  @Prop({
    required: true,
  })
  name: string

  @Prop({
    required: true,
  })
  tags: RouteTag[];

  @Prop({
    required: true,
  })
  createdBy: string;

  @Prop({
    required: true,
  })
  start: string;

  @Prop({
    required: true,
  })
  finish: string;
}

export const RouteSchema = SchemaFactory.createForClass(AccidentEntity);