import { model } from 'mongoose';
import { IUser, userSchema } from './user.schema.js';

export const UserModel = model<IUser>('User', userSchema);
