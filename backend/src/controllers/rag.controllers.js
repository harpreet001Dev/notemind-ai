
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import ragService from "../services/rag.service.js";


export const ask = asyncHandler(async (req, res) => {
    const userId=req.user._id;

    const {ques}=req.body;
 
    if(!userId){
        throw new ApiError(401,'User not exist!')
    }
    const data=await ragService.ask(userId,ques);
    return res.status(200).json({
        status: "success",
        data: data
    })
})

export default {ask}