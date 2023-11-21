const Mongoose = require('mongoose')

const listSchema = new Mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    boardId: {
        type:  Mongoose.Schema.Types.ObjectId,
        ref: 'board',
        required: true
    },
    userId : {
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    color : {
        type : String,
        default : "#0079bf"
    }
},
{
    timestamps: true
})

const List = new Mongoose.model('list', listSchema)
module.exports = List