import { Request } from 'express';
import { UserModel } from '../models/user/user.model.js';
import { IUser } from '../models/user/user.schema.js';

export const authenticateKey = async (req: Request): Promise<IUser> => {
    const key = req.header('x-api-key');
    const user = await UserModel.findOne({ api_key: key });
    if (!user) {
        throw new Error(`Failed to authenticate key: ${key}`);
    }
    return user;
};
