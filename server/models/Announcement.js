import mongoose from 'mongoose'

const announcementSchema = new mongoose.Schema({
    title: {
        type : String,
        required : true,
        trim : true
    },

    message : {
        type : String,
        required : true,
        trim : true
    },

    hostelBlock : {
        type : String,
        required : true,
        trim : true
    },

    createdBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'admin',
        required : true
    } 
}, {timestamps :true});

export default mongoose.model("Announcement", announcementSchema)

