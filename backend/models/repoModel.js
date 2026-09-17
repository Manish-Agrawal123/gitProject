const mongoose = require("mongoose");

const { Schema } = mongoose;

const RepositorySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },

    description: {
        type: String,
        required:true,
    },

    visibility: {
        type: Boolean,
    },

    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    issue: [{
        type: Schema.Types.ObjectId,
        ref: "Issue",
    }],

    stars:{
        type:Number,
        default:0,
    },

    currCommitId:{
        type:String,
        default:"",
    }
});

const Repository = mongoose.model("Repository", RepositorySchema);

module.exports = Repository;