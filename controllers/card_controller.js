const {User , Board , List , Card} = require("../model");


const addCard = async (req, res, next) => {
    try {
        const boardId = req.body.boardId
        const board = await Board.findOne({ _id: boardId, userId: req.user })
        if (!board){
            return res.status(404).json({"message" : "No  board found"})
        }
        const listId = req.body.listId
        const list = await List.findOne({ _id: listId, boardId: boardId })
        if (!list){
            return res.status(404).json({"message" : "No  list found"})
        }
        const card = new Card(req.body)
        const respData = await card.save()
        res.json(respData)
    } catch (error) {
        next(error)
    }
}


const getCardById =  async (req, res, next) => {
    const _id = req.params.id
    try {
        const cards = await Card.findById(_id)
        if (!cards){
            return res.status(404).json({ error: 'Card not found!' })
        }
        res.json(cards)
    } catch (error) {
        next(error)
    }
}

const deleteCard =  async (req, res, next) => {
    const _id = req.params.id
    try {
        const card = await Card.findByIdAndDelete(_id)
        if (!card){
            return res.status(404).send({ error: 'Card not found!' })
        }
        res.json(card)
    } catch (error) {
        next(error)
    }
}

module.exports = {
    getCardById,
    addCard,
    deleteCard
}