import notesService from "../services/notes.service.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

export const notes = asyncHandler(async (req, res) => {
    const userId=req.user._id;
    if(!userId){
        throw new ApiError(401,'User not exist!')
    }

    
    const data=await notesService.getNotes(userId,req.query);
    return res.status(200).json({
        status: "success",
        data: data
    })
})
export const createNote = asyncHandler(async (req, res) => {
    const userId=req.user._id;
    const result=await notesService.addNote(userId,req.body)
    return res.status(200).json({
        status: "success",
        data:result
    })
})
export const updateNote = asyncHandler(async (req, res) => {
    const userId=req.user._id;
    const result=await notesService.updateNote(userId,req.body)
    return res.status(200).json({
        status: "success",
        data:result
    })
})

export const deleteNote = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const result = await notesService.deleteNote(userId, req.params.noteId);
    return res.status(200).json({
        status: "success",
        data: result
    })
})



export default { createNote, updateNote, deleteNote }