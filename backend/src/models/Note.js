import mongoose, { mongo } from "mongoose";

const notesSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    title:{
        type:String,
        required:true
    },
    content:{
        type:String,
        required:true,
    }
},{
    timestamps:true
})

export default mongoose.model('Notes',notesSchema)