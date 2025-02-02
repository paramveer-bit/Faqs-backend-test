import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import ApiError from '../helper/ApiError';
import asyncHandler from '../helper/asyncHandler';

export const verifyJwt = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const accessToken = req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");

        if (!accessToken) {
            throw new ApiError(401, "Unauthorized Access");
        }

        const decodedToken: any = jwt.verify(accessToken, process.env.JWT_SECRET as string);
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");
        if (!user) {
            throw new ApiError(401, "Login first");
        }

        req.user = user;
        next();
    } catch (error) {
        next(error);
    }
});