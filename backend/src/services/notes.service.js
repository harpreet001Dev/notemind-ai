import ApiError from "../utils/ApiError.js";
import Notes from '../models/Note.js';
import ragService from "./rag.service.js";

const getNotes = async (userId, params) => {
    const { page, limit } = params;

    const pageNum = Math.max(parseInt(page), 1);
    const limitNum = Math.max(parseInt(limit), 5);
    const skip = (pageNum - 1) * limitNum;

    const [notes, totalNotes]=await Promise.all([
        Notes
        .find({ userId }).
        skip(skip).limit(limitNum)
        .sort({ createdAt: -1 }),
        
        Notes.countDocuments({userId})
    ]);
    const totalPages=Math.ceil(totalNotes / limitNum);

    return {
        notes,
        pagination:{
            currentPage:pageNum,
            limit:limitNum,
            totalNotes,
            totalPages,
            hasNextPage:pageNum<totalPages,
            hasPreviousPage:pageNum>1

        }
    }
};

const addNote = async (userId, request) => {
    const { title, content } = request;
    if (!title || !content) {
        throw new ApiError(400, 'Title or content is misisng!')
    }
    const note = await Notes.create({
        userId,
        title,
        content
    });
    await ragService.addNoteToEmbedding(note);
    return note;

}

const updateNote = async (userId, request) => {
    const { noteId, title, content } = request;
    if (!title || !content || !noteId) {
        throw new ApiError(400, 'Title or content or noteId is misisng!')
    }
    const note = await Notes.findOneAndUpdate(
        {
            _id: noteId,
            userId,
        }, {
        title,
        content
    }, {
        new: true,
        runValidators: true
    }
    )
    if (!note) {
        throw new ApiError(404, "Note not found!")
    }
    await ragService.updateNoteEmbedding(note);
    return note;

}

const deleteNote = async (userId, noteId) => {
    const note = await Notes.findOneAndDelete({ _id: noteId, userId });
    if (!note) {
        throw new ApiError(404, "Note not found!");
    }
    await ragService.deleteNoteEmbedding(note);
    return note;
}

export default { getNotes, addNote, updateNote, deleteNote }