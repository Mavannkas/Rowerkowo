import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { UserEntity } from 'src/users/entities/user.entity';

export type FileDocument = HydratedDocument<FileEntity>;

export interface File {
  // _id: string;
  filename: string;
  path: string;
  size: number;
  mimetype: string;
  createdAt?: Date;
  owner: UserEntity;
}

@Schema()
export class FileEntity implements File {
  _id: string;

  @Prop()
  filename: string;

  @Prop()
  path: string;

  @Prop()
  size: number;

  @Prop()
  mimetype: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  owner: UserEntity;

  @Prop({
    default: Date.now,
  })
  createdAt: Date;
}

export const FileSchema = SchemaFactory.createForClass(FileEntity);
