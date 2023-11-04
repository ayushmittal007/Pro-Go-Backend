const {User , Board , List , Card} = require("../model");

const addList = async (req, res, next) => {
    try {
        const boardId = req.body.boardId
        const board = await Board.findOne({ _id: boardId, userId: req.user })
        if (!board)
            return res.status(404).send()
        const list = new List(req.body)
        const respData = await list.save()
        res.json(respData);
    } catch (error) {
        if (error.name === 'ValidationError')
            res.status(422)
        next(error)
    }
}


const getListById =  async (req, res, next) => {
    const _id = req.params.id;
    try {
        const list = await List.findById(_id)
        if (!list){
            return res.status(404).json({message : "No lists found"});
        }
        res.json(list)
    } catch (error) {
        next(error)
    }
}


const getCardsOfList = async (req, res, next) => {
    const _id = req.params.id
    try {
        const lists = await List.findById(_id)
        if (!lists)
        return res.status(404).json({"message" : "No list found"})
        const cards = await Card.find({ listID: _id })
        res.json(cards)
    } catch (error) {
        next(error)
    }
}


const deleteList =  async (req, res, next) => {
    const _id = req.params.id
    try {
        const list = await List.findByIdAndDelete(_id)
        if (!list){
            return res.status(404).json({"message" : "No list found"})
        }
        const cards = await Card.find({ listid: _id })
        cards.forEach(async (card) => (
            await Card.deleteOne({ _id: card._id })))
        res.json(list)
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