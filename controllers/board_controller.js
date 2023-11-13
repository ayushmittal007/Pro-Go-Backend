const {User , Board , List , Card} = require("../model");
const {ErrorHandler} = require("../middlewares/errorHandling");
const {idSchema , name_id_Schema} = require("../utils/joi_validations");

const getAll = async (req, res, next) => {
    try {
        const boardsList = await Board.find({ userId: req.user.id }).populate("userId" , "_id username email")
        res.status(201).json(
        {
            success : true , 
            data :  { boardsList } 
        });
    } catch (error) {
        next(error)
    }
}

const addBoard =  async (req, res, next) => {
    try {
        const input = await name_id_Schema.validateAsync(req.body);
        const board = new Board(req.body)
        const respData = await board.save()
        res.status(201).json(
        {
            success : true , 
            data :  { respData } 
        });
    } catch (error) {
        next(error)
    }
}

const getBoardById =  async (req, res, next) => {
    try {
        const input = await idSchema.validateAsync(req.params);
        const _id = req.params.id
        const board = await Board.findOne({ _id, userId: req.user.id }).populate("userId","_id username email")
        if (!board){
            return next(new ErrorHandler(400, 'Board not found!'));
        }
        res.status(201).json(
        {
            success : true , 
            data :  { board } 
        });
    } catch (error) {
        next(error)
    }
}

const getLists =  async (req, res, next) => {
    try {
        const input = await idSchema.validateAsync(req.params);
        const _id = req.params.id
        const board = await Board.findOne({ _id, userId: req.user.id })
        if (!board){
            return next(new ErrorHandler(400, 'Board not found!'));
        }
        const lists = await List.find({ boardId: _id }).populate("boardId"," _id  name")
        res.status(201).json(
        {
            success : true , 
            data :  { lists } 
        });
    } catch (error) {
        next(error)
    }
}

const getCards =  async (req, res, next) => {
    try {
        const input = await idSchema.validateAsync(req.params);
        const _id = req.params.id
        const board = await Board.findOne({ _id, userId: req.user.id })
        if (!board){
            return next(new ErrorHandler(400, 'Board not found!'));
        }
        const cards = await Card.find({ boardId: _id }).populate("boardId"," _id  name").populate("listId"," _id  name")
        res.status(201).json(
        {
            success : true , 
            data :  { cards } 
        });
    } catch (error) {
        next(error)
    }
} 

const deleteBoard = async (req, res, next) => {
    try {
        const input = await idSchema.validateAsync(req.params);
        const _id = req.params.id
        const board = await Board.findOneAndDelete({ _id, userId: req.user.id })
        if (!board){
          return next(new ErrorHandler(400, 'Board not found!'));
        }        
        const lists = await List.find({ boardId: _id })
        lists.forEach(async (list) => {
            const cards = await Card.find({ listid: list._id })
            cards.forEach(async (card) => (
                await Card.deleteOne({ _id: card._id })))
            await List.deleteOne({ _id: list._id })
        })
        res.status(201).json(
        {
            success : true , 
            message : "Board Deleted Successfully"
        });
    } catch (error) {
        next(error)
    }
}

module.exports = {
    getAll,
    addBoard,
    getBoardById,
    getLists,
    getCards,
    deleteBoard
}