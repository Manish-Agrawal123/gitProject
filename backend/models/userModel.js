const mongoose = require("mongoose");

const {Schema} = mongoose;

const UserSchema = new Schema({
    username:{
        type:String,
        required:true,
        unique:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
    },
    reposatory:[{
        default:[],
        type:Schema.Types.ObjectId,
        ref:"Reposatory",
    }],

    starRepo:[{
        default:[],
        type:Schema.Types.ObjectId,
        ref:"Reposatory",
    }],

    followedUser:[{
        default:[],
        type:Schema.Types.ObjectId,
        ref:"User",
    }],

});

const User = mongoose.model("User",UserSchema);

export default User;