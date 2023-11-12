const {User , Board , List , Card} = require("../model");
const {ErrorHandler} = require("../middlewares/errorHandling");

const addCard = async (req, res, next) => {
    try {
        const boardId = req.body.boardId
        const board = await Board.findOne({ _id: boardId, userId: req.user })
        if (!board){
            return next(new ErrorHandler(400, 'Board not found!'));
        }
        const listId = req.body.listId
        const list = await List.findOne({ _id: listId, boardId: boardId })
        if (!list){
            return next(new ErrorHandler(400, 'List not found!'));
        }
        const card = new Card(req.body)

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
    const _id = req.params.id
    try {
        const cards = await Card.findById(_id).populate("boardId", "_id name").populate("listId", "_id name")
        if (!cards){
            return next(new ErrorHandler(400, 'Card not found!'));
        }
        
        res.status(201).json({
            status : true,
            data : {cards}
        })
    } catch (error) {
        next(error)
    }
}

const deleteCard =  async (req, res, next) => {
    const _id = req.params.id
    try {
        const card = await Card.findByIdAndDelete(_id)
        if (!card){
            return next(new ErrorHandler(400, 'Card not found!'));
        }
        res.status(201).json({
            status : true,
            message : "Card Deleted Successfully"
        })
        
    } catch (error) {
        next(error)
    }
}

module.exports = {
    getCardById,
    addCard,
    deleteCard
}