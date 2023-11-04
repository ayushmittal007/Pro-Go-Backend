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
    }
},
{
    timestamps: true
})

const List = new Mongoose.model('list', listSchema)
module.exports = List