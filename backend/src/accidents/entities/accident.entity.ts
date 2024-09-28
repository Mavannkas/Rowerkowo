import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<AccidentEntity>;

export interface Accident {
  severity: string;
  latitude: number;
  longitude: number;
}

@Schema()
export class AccidentEntity implements Accident {
  @Prop({
    required: true,
  })
  severity: string;

  @Prop({
    required: true,
  })
  latitude: number;

  @Prop({
    required: true,
  })
  longitude: number;
}

export const AccidentSchema = SchemaFactory.createForClass(AccidentEntity);
