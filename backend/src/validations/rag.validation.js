import joi from "joi";

export const userQuerySchema=joi.object({
    ques:joi.string().trim().required()
})