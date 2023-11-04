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
    }
},
{
    timestamps: true
})

const Board = new Mongoose.model("board", boardSchema);
module.exports = Board