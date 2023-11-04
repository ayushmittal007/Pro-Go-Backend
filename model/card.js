const Mongoose = require('mongoose')

const cardSchema = new Mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    boardId: {
        type:  Mongoose.Schema.Types.ObjectId,
        ref: 'board',
        required: true
    },
    listId: {
        type:  Mongoose.Schema.Types.ObjectId,
        ref: 'list',
        required: true
    },
    order: {
        type: String,
        required: true
    }
},
{
    timestamps: true
})

const Card = new  Mongoose.model('card', cardSchema); 
module.exports = Card;