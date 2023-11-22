const { User, Board, List, Card } = require("../model");
const { ErrorHandler } = require("../middlewares/errorHandling");
const { idSchema, name_id_Schema } = require("../utils/joi_validations");

const addList = async (req, res, next) => {
  try {
    const input = await name_id_Schema.validateAsync(req.body);
    const boardId = req.body.boardId;
    const board = await Board.findById(boardId).populate(
      "userId",
      "_id username email usersWorkSpcaeMember"
    );
    if (!board) {
      return next(new ErrorHandler(400, "Board not found!"));
    }
    if (
      !board.members.includes(req.user.email) &&
      req.user._id.toString() !== board.userId._id.toString() &&
      !board.userId.usersWorkSpcaeMember.includes(req.user.email)
    ) {
      return next(new ErrorHandler(400, "You can not add list !"));
    }

    const listName = req.body.name;
    const exist = await List.findOne({ name: listName, boardId: boardId });
    if (exist) {
      return next(new ErrorHandler(400, "List with this name already exists!"));
    }

    const list = new List({
      name: req.body.name,
      boardId: boardId,
      userId: req.user._id,
      color: req.body.color,
    });
    const respData = await list.save();
    res.status(201).json({
      success: true,
      data: { respData },
    });
  } catch (error) {
    next(error);
  }
};

const getListById = async (req, res, next) => {
  try {
    const input = await idSchema.validateAsync(req.params);
    const _id = req.params.id;
    if (!list) {
        return next(new ErrorHandler(400, "List not found!"));
    }
    const list = await List.findById(_id);
    const board = await Board.findById(list.boardId).populate(
      "userId",
      "_id username email usersWorkSpcaeMember"
    );
    if (!board) {
      return next(new ErrorHandler(400, "Board not found!"));
    }
    if (
      !board.members.includes(req.user.email) &&
      req.user._id.toString() !== board.userId._id.toString() &&
      !board.userId.usersWorkSpcaeMember.includes(req.user.email)
    ) {
      return next(new ErrorHandler(400, "You can not get this list!"));
    }
    res.status(201).json({
      success: true,
      data: { list },
    });
  } catch (error) {
    next(error);
  }
};

const getCardsOfList = async (req, res, next) => {
  try {
    const input = await idSchema.validateAsync(req.params);
    const _id = req.params.id;
    const lists = await List.findById(_id);
    if (!lists) {
      return next(new ErrorHandler(400, "List not found!"));
    }

    const cards = await Card.find({ listId : _id })
    console.log(cards)
    if (!cards) {
      return next(new ErrorHandler(400, "Card not found!"));
    }

    const boardId = lists.boardId;
    const board = await Board.findById(boardId).populate(
      "userId",
      "_id username email usersWorkSpcaeMember"
    );
    if (!board) {
      return next(new ErrorHandler(400, "Board not found!"));
    }
    if (
      !board.members.includes(req.user.email) &&
      req.user._id.toString() !== board.userId._id.toString() &&
      !board.userId.usersWorkSpcaeMember.includes(req.user.email)
    ) {
      return next(
        new ErrorHandler(
          400,
          "You are not allowed to access cards of this card!"
        )
      );
    }

    res.status(201).json({
      success: true,
      data: { cards },
    });
  } catch (error) {
    next(error);
  }
};

const updateList = async (req, res, next) => {
  try {
    const _id = req.params.id;
    const list = await List.findById(_id);
    if (!list) {
      return next(new ErrorHandler(400, "List not found!"));
    }
    const board = await Board.findById(list.boardId).populate(
      "userId",
      "_id username email usersWorkSpcaeMember"
    );
    if (!board) {
      return next(new ErrorHandler(400, "Board not found!"));
    }
    if (
      !board.members.includes(req.user.email) &&
      req.user._id.toString() !== board.userId._id.toString() &&
      !board.userId.usersWorkSpcaeMember.includes(req.user.email)
    ) {
      return next(new ErrorHandler(400, "You can not update this list!"));
    }
    const respData = await List.findByIdAndUpdate(_id, req.body, { new: true });
    res.status(201).json({
      status: true,
      message: "List Updated Successfully",
      data: { respData },
    });
  } catch (error) {
    next(error);
  }
};

const deleteList = async (req, res, next) => {
  try {
    const input = await idSchema.validateAsync(req.params);
    const _id = req.params.id;
    const list = await List.findById(_id);
    if (!list) {
      return next(new ErrorHandler(400, "List not found!"));
    }
    const listId = await List.findById(_id);
    const board = await Board.findById(listId.boardId).populate(
      "userId",
      "_id username email usersWorkSpcaeMember"
    );
    if (!board) {
      return next(new ErrorHandler(400, "Board not found!"));
    }
    if (
      !board.members.includes(req.user.email) &&
      req.user._id.toString() !== board.userId._id.toString() &&
      !board.userId.usersWorkSpcaeMember.includes(req.user.email)
    ) {
      return next(new ErrorHandler(400, "You can not delete this list!"));
    }
    const cards = await Card.find({ listId: _id });
    cards.forEach(async (card) => await Card.deleteOne({ _id: card._id }));
    await List.findByIdAndDelete(_id);
    res.status(201).json({
      success: true,
      message: "List and all the Cards inside it deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addList,
  getListById,
  getCardsOfList,
  updateList,
  deleteList,
};
