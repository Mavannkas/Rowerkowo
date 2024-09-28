import mongoose from 'mongoose';
import { UserRole } from 'src/users/entities/user.entity';

export interface JwtPayload {
  username: string;
  sub: mongoose.Types.ObjectId;
  role: UserRole;
}
