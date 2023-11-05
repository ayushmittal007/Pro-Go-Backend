const {User , Board , List , Card} = require("../model");

const getAll = async (req, res, next) => {
    try {
        const boardsList = await Board.find({ userId: req.user }).populate("userId","_id username email")
        res.json(boardsList)
    } catch (error) {
        next(error)
    }
}


const addBoard =  async (req, res, next) => {
    try {
        const board = new Board(req.body)
        const respData = await board.save()
        res.status(200).json(respData)
    } catch (error) {
        next(error)
    }
}


const getBoardById =  async (req, res, next) => {
    const _id = req.params.id
    try {
        const board = await Board.findOne({ _id, userId: req.user }).populate("userId","_id username email")
        if (!board){
            return res.status(404).json({ error: 'Board not found!' })
        }
        res.status(200).json(board)
    } catch (error) {
        next(error)
    }
}


const getLists =  async (req, res, next) => {
    const _id = req.params.id
    try {
        const board = await Board.findOne({ _id, userId: req.user })
        if (!board){
            return res.status(404).json({ error: 'Board not found!' })
        }
        const lists = await List.find({ boardId: _id }).populate("boardId"," _id  name")
        res.json(lists)
    } catch (error) {
        next(error)
    }
}


const getCards =  async (req, res, next) => {
    const _id = req.params.id
    try {
        const board = await Board.findOne({ _id, userId: req.user })
        if (!board){
            return res.status(404).json({ error: 'Board not found!' })
        }
        const cards = await Card.find({ boardId: _id }).populate("boardId"," _id  name").populate("listId"," _id  name")
        res.json(cards)
    } catch (error) {
        next(error)
    }
} 


const deleteBoard = async (req, res, next) => {
    const _id = req.params.id
    try {
        const board = await Board.findOneAndDelete({ _id, userId: req.user })
        if (!board)
            return res.status(404).json({ error: 'Board not found!' })
        
        const lists = await List.find({ boardId: _id })
        lists.forEach(async (list) => {
            const cards = await Card.find({ listid: list._id })
            cards.forEach(async (card) => (
                await Card.deleteOne({ _id: card._id })))
            await List.deleteOne({ _id: list._id })
        })
        res.json(board)
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