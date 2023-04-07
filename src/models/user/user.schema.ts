import { Schema } from 'mongoose';

export interface IUser {
    name: string;
    api_key: string;
}

export const userSchema = new Schema<IUser>({
    name: { type: String, required: true },
    api_key: { type: String, unique: true },
});
