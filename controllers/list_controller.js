const {User , Board , List , Card} = require("../model");
const {ErrorHandler} = require("../middlewares/errorHandling");
const {idSchema,name_id_Schema} = require("../utils/joi_validations");

const addList = async (req, res, next) => {
    try {
        const input = await name_id_Schema.validateAsync(req.body);
        const boardId = req.body.boardId
        const board = await Board.findOne({ _id: boardId, userId: req.user })
        if (!board){
            return next(new ErrorHandler(400, 'Board not found!'));
        }
        
        const list = new List(req.body)
        const respData = await list.save()
        res.status(201).json({
            success : true,
            data : {respData}
        })
        
    } catch (error) {
        next(error)
    }
}


const getListById =  async (req, res, next) => {
    try {
        const input = await idSchema.validateAsync(req.params);
        const _id = req.params.id;
        const list = await List.findById(_id).populate("boardId" , "name , _id")
        if (!list){
            return next(new ErrorHandler(400, 'List not found!'));
        }
        res.status(201).json({
            success : true,
            data : {list}
        })
    } catch (error) {
        next(error)
    }
}


const getCardsOfList = async (req, res, next) => {
    try {
        const input = await idSchema.validateAsync(req.params);
        const _id = req.params.id;
        const lists = await List.findById(_id)
        if (!lists){
            return next(new ErrorHandler(400, 'List not found!'));
        }
        const cards = await Card.find({ listID: _id }).populate("listId" , "_id , name")
        if (!cards){
            return next(new ErrorHandler(400, 'Card not found!'));
        }
        res.status(201).json({
            success : true,
            data : {cards}
        })
    } catch (error) {
        next(error)
    }
}


const deleteList =  async (req, res, next) => {
    try {
        const input = await idSchema.validateAsync(req.params);
        const _id = req.params.id
        const list = await List.findByIdAndDelete(_id)
        if (!list){
            return next(new ErrorHandler(400, 'List not found!'));
        }
        const cards = await Card.find({ listid: _id })
        cards.forEach(async (card) => (
            await Card.deleteOne({ _id: card._id })))
        res.status(201).json({
            success : true,
            message : "List deleted successfully"
        })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    addList,
    getListById,
    getCardsOfList,
    deleteList
}