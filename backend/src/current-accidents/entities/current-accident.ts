import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CurrentAccidentDocument = HydratedDocument<CurrentAccidentEntity>;

@Schema()
export class CurrentAccidentEntity {
  _id: string;

  @Prop()
  latitude: number;
  @Prop()
  longitude: number;
  @Prop()
  value: number;
}

export const CurrentAccidentSchema = SchemaFactory.createForClass(CurrentAccidentEntity);
