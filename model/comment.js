const Mongoose = require('mongoose')

const commentSchema = new Mongoose.Schema({
    text : {
        type: String,
        required: true
    },
    userId: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    cardId: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'card',
        required: true
    },  
    
},
{
    timestamps: true
})

const Comment = new Mongoose.model("comment", commentSchema);
module.exports = Comment