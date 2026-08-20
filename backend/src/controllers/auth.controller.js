import asyncHandler from "../utils/asyncHandler.js";
import authService from "../services/auth.service.js";
import ApiError from "../utils/ApiError.js";


export const register = asyncHandler(async (req, res) => {
    const result =await authService.register(req.body);
    const { user, accessToken, refreshToken } = result;

    res.cookie("refreshToken",refreshToken,{
        httpOnly:true,
        secure: process.env.NODE_ENV === "production",
        sameSite:"strict",
        maxAge:7*24*60*60*1000,
        // maxAge: 5 * 60 * 1000
    })

    
    res.status(201).json({
        status: "success",
        data:{
            user,
            accessToken
        }
    })
})

export const login = asyncHandler(async (req, res) => {
    
    const result=await authService.login(req.body);
    const {user,accessToken,refreshToken}=result;
    
    
    res.cookie('refreshToken',refreshToken,{
        httpOnly:true,
        secure: process.env.NODE_ENV === "production",
        sameSite:'strict',
        maxAge:7*24*60*60*1000,
        // maxAge: 5 * 60 * 1000

    })


    res.status(200).json({
        status: "success",
        data: {
            user,
            accessToken
        }
    })
})

export const refresh=asyncHandler(async(req,res)=>{

    const refreshToken=req.cookies.refreshToken;
    if(!refreshToken){
        throw new ApiError(401,"Refresh Token  Not found!")
    }
    const result=await authService.refresh(refreshToken)
    const { accessToken, newRefreshToken } = result;
     res.cookie('refreshToken',newRefreshToken,{
        httpOnly:true,
        secure: process.env.NODE_ENV === "production",
        sameSite:'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000

    })

    res.status(200).json({
        status: "success",
        data: {
            accessToken
        }
    })
})

export default { register, login };