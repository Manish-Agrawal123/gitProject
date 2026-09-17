const mongoose = require("mongoose");

const {Schema} = mongoose;

const cotrShema = new Schema({
    user:{
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    contribution:[{
        date:{
            type:String,
            default: () => new Date().toISOString().split("T")[0],
        },
        count:{
            type:Number,
            default:0,
        }
    }],
    startDate:{
        type:String,
        default: new Date().toISOString().split("T")[0],
    }
});

const Cotr = mongoose.model("Cotr",cotrShema);

module.exports = Cotr;