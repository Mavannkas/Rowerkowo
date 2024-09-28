import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type Co2Document = HydratedDocument<Co2Entity>;

@Schema()
export class Co2Entity {
  _id: string;

  @Prop()
  latitude: number;
  @Prop()
  longitude: number;
  @Prop()
  value: number;
}

export const Co2Schema = SchemaFactory.createForClass(Co2Entity);
