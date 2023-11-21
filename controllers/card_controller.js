const {User , Board , List , Card} = require("../model");
const {ErrorHandler} = require("../middlewares/errorHandling");
const {idSchema } = require("../utils/joi_validations");
const moment = require('moment');

const addCard = async (req, res, next) => {
    try {
        const boardId = req.body.boardId
        const board = await Board.findOne({ _id: boardId, userId: req.user._id })
        if (!board){
            return next(new ErrorHandler(400, 'Board not found!'));
        }
        if((board.members.includes(req.user._id))  || req.user._id === board.userId){
            return next(new ErrorHandler(400, "You are not the member of this board!"));
        }
        const listId = req.body.listId
        const list = await List.findOne({ _id: listId, boardId: boardId })
        if (!list){
            return next(new ErrorHandler(400, 'List not found!'));
        }
        const cardName = req.body.name;
        const existing = Card.findOne({ name: cardName, listId: listId , boardId : boardId });
        if(existing){
            return next(new ErrorHandler(400, 'Card with this name already exists!'));
        }
        
        const card = new Card({
            name : req.body.name,
            boardId : boardId,
            listId : listId,
            userId : req.user._id,
            daysAlloted : req.body.daysAlloted,
        })
        const respData = await card.save()
        res.status(201).json({
            status : true,
            message : "Card Added Successfully",
            data : {respData}
        })
    } catch (error) {
        next(error)
    }
}

const getCardById =  async (req, res, next) => {
    try {
        const input = await idSchema.validateAsync(req.params);
        const _id = req.params.id
        const cards = await Card.findById(_id).populate("boardId", "_id name").populate("listId", "_id name")
        if (!cards){
            return next(new ErrorHandler(400, 'Card not found!'));
        }
        if(req.user._id.toString() != cards.userId.toString()){
            return next(new ErrorHandler(400, 'You are not allowed to access this card!'));
        }
        res.status(201).json({
            status : true,
            data : {cards}
        })
    } catch (error) {
        next(error)
    }
}

const updateCard =  async (req, res, next) => {
    try{
        const input = await idSchema.validateAsync(req.params);
        const _id = req.params.id
        const card = await Card.findById(_id)
        if (!card){
            return next(new ErrorHandler(400, 'Card not found!'));
        }
        if(req.user._id.toString() != card.userId.toString()){
            return next(new ErrorHandler(400, 'You are not allowed to update this card!'));
        }
        const respData = await Card.findByIdAndUpdate(_id, req.body, {new : true})
        res.status(201).json({
            status : true,
            message : "Card Updated Successfully",
            data : {respData}
        })        
    }catch(err){
        next(err)
    }
}

const addDataToCard = async (req, res, next) => {
    try{
        const dataToAdd = req.body.data;
        const _id = req.params.id;
        const card = await Card.findById(_id)
        if (!card){
            return next(new ErrorHandler(400, 'Card not found!'));
        }
        if(req.user._id.toString() != card.userId.toString()){
            return next(new ErrorHandler(400, 'You are not allowed to add to this card!'));
        }
        card.data.push(dataToAdd)
        const respData = await card.save()
        res.status(201).json({
            status : true,
            message : "Data Added Successfully",
            data : {respData}
        })
    }catch(err){
        next(err)
    }
}

const deleteCard =  async (req, res, next) => {
    try {
        const input = await idSchema.validateAsync(req.params);
        const _id = req.params.id
        const card = await Card.findByIdAndDelete(_id)
        if (!card){
            return next(new ErrorHandler(400, 'Card not found!'));
        }
        if(req.user._id.toString() != card.userId.toString()){
            return next(new ErrorHandler(400, 'You are not allowed to delete this card!'));
        }
        res.status(201).json({
            status : true,
            message : "Card Deleted Successfully"
        })
    } catch (error) {
        next(error)
    }
}

const checkDueDate = async (req, res, next) => {
    try{
        const input = await idSchema.validateAsync(req.params);
        const _id = req.params.id;
        const cards = await Card.findById(_id).populate("boardId", "_id name").populate("listId", "_id name")
        if (!cards){
            return next(new ErrorHandler(400, 'Card not found!'));
        }

        const createdAtStr = cards.createdAt;
        const createdDate = moment(createdAtStr);

        const timeAllottedDays = cards.daysAlloted;
        const currentTime = moment.utc();
        const timeDifference = currentTime.diff(createdDate, 'days');

        if (timeDifference >= timeAllottedDays) {
            res.status(201).json({
                status : true,
                message : "Time has elapsed"
            })
        } else {
            res.status(201).json({
                status : true,
                message : "Time is still left"
            })
        }
    }
    catch(error){
        next(error)
    }
}

module.exports = {
    getCardById,
    addCard,
    deleteCard,
    updateCard,
    addDataToCard,
    checkDueDate,
}