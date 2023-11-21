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
    userId : {
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },  
    daysAlloted : {
        type: Number,
        default: 1000000,
    },
    description : {
        type: String,
        default: "",
    },
    data : {
        type : Array,
        default : []
    }
},
{
    timestamps: true
})

const Card = new  Mongoose.model('card', cardSchema); 
module.exports = Card;