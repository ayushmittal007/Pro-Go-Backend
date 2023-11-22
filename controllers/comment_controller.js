const {User , Board , List , Card, Comment} = require("../model");
const {ErrorHandler} = require("../middlewares/errorHandling");

const addCommentToACard = async (req, res, next) => {  
    try{
        const userId = req.user._id;
        const cardId = req.body.cardId;
        const comment = req.body.text;
        const card = await Card.findById(cardId);
        if (!card){
            return next(new ErrorHandler(400, 'Card not found!'));
        }
        const newComment = new Comment({
            text : comment,
            userId,
            cardId
        });
        await newComment.save();
        res.status(201).json({status : true, message : "Comment added successfully" , data : newComment});
    } catch(error){
        next(error)
    }
}

const getAllComments = async (req, res, next) => {
    try{
        const cardId = req.params.id;
        const card = await Card.findById(cardId);
        if (!card){
            return next(new ErrorHandler(400, 'Card not found!'));
        }
        const comments = await Comment.find({cardId});
        res.status(200).json({status : true, message : "Comments fetched successfully", comments});
    }catch(error){
        next(error)
    }  
}

const updateComment = async (req, res, next) => {
    try{
        const commentId = req.params.id;
        const comment = await Comment.findById(commentId);
        if(!comment){
            return next(new ErrorHandler(400, 'Comment not found!'));
        }
        if(req.user._id.toString() != comment.userId.toString()){
            return next(new ErrorHandler(400, 'You are not allowed to update this comment!'));
        }
        const newComment = req.body.text;
        comment.text = newComment;
        await comment.save();
        res.status(200).json({status : true, message : "Comment updated successfully" , data : comment});
    }catch(error){
        next(error)
    }
}

const deleteComment = async (req, res, next) => {
    try{
        const commentId = req.params.id;
        const comment = await Comment.findById(commentId);
        if(!comment){
            return next(new ErrorHandler(400, 'Comment not found!'));
        }
        if(req.user._id.toString() != comment.userId.toString()){
            return next(new ErrorHandler(400, 'You are not allowed to delete this comment!'));
        }
        await Comment.findByIdAndDelete(commentId);
        res.status(200).json({status : true, message : "Comment deleted successfully"});
    }catch(error){
        next(error)
    }
}

module.exports = {
    addCommentToACard,
    getAllComments,
    updateComment,
    deleteComment
}