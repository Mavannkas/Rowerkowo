import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<UserEntity>;

export interface User {
  _id: string;
  username: string;
  password: string;
  role: UserRole;
  routeHistory?: UserRoute[]
}

export interface UserRoute {
  timeStamp: string;
  directions: any;
}

export enum UserRole {
  Admin = 'admin',
  User = 'user',
}

export type UserWithoutPassword = Omit<User, 'password'>;

export const userToUserWithoutPassword = (user: User): UserWithoutPassword => ({
  _id: user._id,
  username: user.username,
  role: user.role,
  routeHistory: user.routeHistory
});

@Schema()
export class UserEntity implements User {
  _id: string;

  @Prop({
    required: true,
    unique: true,
  })
  username: string;

  @Prop({
    required: true,
  })
  password: string;

  @Prop({
    required: true,
    enum: Object.values(UserRole),
    default: 'user',
  })
  role: UserRole;

  @Prop({
    required: false,
    default: []
  })
  routeHistory: UserRoute[]
}

export const UserSchema = SchemaFactory.createForClass(UserEntity);
