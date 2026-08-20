import joi from "joi";

export const createNotesSchema= joi.object({
    title:joi.string().trim().required(),
    content:joi.string().trim().required()
})


export const getNotesSchema= joi.object({
   page:joi.number().default(1),
   limit:joi.number().default(10)
})