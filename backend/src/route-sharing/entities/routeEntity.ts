import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

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

  @Prop({
    required: true,
    type: MongooseSchema.Types.Mixed,
  })
  route: Route;
}

export const RouteSchema = SchemaFactory.createForClass(RouteEntity);