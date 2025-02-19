import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (req, _, next) => {
    
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
    
        if ( !token ) throw new ApiError(401, "Unauthorized");

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findById(decodedToken?._id).select("-password");
        if (!user) throw new ApiError(401, "Unauthorized user");

        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401, "Error in veryifying the token");
        
    }
});