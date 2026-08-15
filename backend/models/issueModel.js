const mongoose = require("mongoose");

const {Schema} = mongoose;

const IssueSchema = new Schema({
    title:{
        type:String,
        required:true,
    },
    describtion:{
        type:String,
        required:true,
    },
    status:{
        type:String,
        enum:["open","close"],
        default:"open",
    },
    reposatory:{
        type:Schema.Types.ObjectId,
        ref:"Reposatory",
        required:true,
    }
})

const Issue = mongoose.model("Issue",IssueSchema);

export default Issue;