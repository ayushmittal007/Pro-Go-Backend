const Mongoose = require('mongoose')

const boardSchema = new Mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    userId: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    members : {
        type : Array,
        default : []
    },
    templateLink : {
        type : String,
        default : ""
    },
    templateName : {
        type : String,
        default : ""
    },
    color : {
        type : String,
        default : "white"
    },
},
{
    timestamps: true
})

const Board = new Mongoose.model("board", boardSchema);
module.exports = Board