const { User, Board, List, Card } = require("../model");
const { ErrorHandler } = require("../middlewares/errorHandling");
const {
  idSchema,
  emailSchema,
  nameSchema,
} = require("../utils/joi_validations");
const { inviteMail } = require("../utils/invite_mail");

const getAll = async (req, res, next) => {
  try {
    const boardsList = await Board.find({ userId: req.user._id }).populate(
      "userId",
      "_id username email"
    );
    res.status(201).json({
      success: true,
      data: { boardsList },
    });
  } catch (error) {
    next(error);
  }
};

const addBoard = async (req, res, next) => {
  try {
    const boardName = req.body.name;
    const userId = req.user._id;
    const existing = await Board.findOne({ name: boardName, userId: userId });
    if (existing) {
      return next(
        new ErrorHandler(400, "Board with this name already exists!")
      );
    }
    const board = new Board({
      name: boardName,
      userId: userId,
      templateLink: req.body.templateLink,
      templateName: req.body.templateName,
      color: req.body.color,
    });

    const respData = await board.save();
    req.user.boardsOwned.push(board._id);
    await req.user.save();
    res.status(201).json({
      success: true,
      data: { respData },
    });
  } catch (error) {
    next(error);
  }
};

const getBoardById = async (req, res, next) => {
  try {
    const input = await idSchema.validateAsync(req.params);
    const _id = req.params.id;
    const board = await Board.findOne({ _id })
    const userId = await User.findById(board.userId.toString());
    if (!board) {
      return next(new ErrorHandler(400, "Board not found!"));
    }

    if (
      !board.members.includes(req.user._id) &&
      req.user._id.toString() !== userId._id.toString() &&
      !userId.usersWorkSpcaeMember.includes(req.user.email)
    ) {
      return next(
        new ErrorHandler(400, "You are not the member of this board!")
      );
    }

    res.status(201).json({
      success: true,
      data: { board },
    });
  } catch (error) {
    next(error);
  }
};

const updateBoardById = async (req, res, next) => {
  try {
    const _id = req.params.id;
    const board = await Board.findOne({ _id })
    const userId = await User.findById(board.userId.toString());
    if (!board) {
      return next(new ErrorHandler(400, "Board not found!"));
    }

    if (
      !board.members.includes(req.user._id) &&
      req.user._id.toString() !== userId._id.toString() &&
      !userId.usersWorkSpcaeMember.includes(req.user.email)
    ) {
      return next(
        new ErrorHandler(400, "You are not the member of this board!")
      );
    }
    const respData = await Board.findByIdAndUpdate(_id, req.body, {
      new: true,
    });
    res.status(201).json({
      status: true,
      message: "Board Updated Successfully",
      data: { respData },
    });
  } catch (error) {
    next(error);
  }
};

const getLists = async (req, res, next) => {
  try {
    const input = await idSchema.validateAsync(req.params);
    const _id = req.params.id;
    const board = await Board.findOne({ _id })
    const userId = await User.findById(board.userId.toString());
    if (!board) {
      return next(new ErrorHandler(400, "Board not found!"));
    }

    if (
      !board.members.includes(req.user._id) &&
      req.user._id.toString() !== userId._id.toString() &&
      !userId.usersWorkSpcaeMember.includes(req.user.email)
    ) {
      return next(
        new ErrorHandler(400, "You are not the member of this board!")
      );
    }
    const lists = await List.find({ boardId: _id }).populate(
      "boardId",
      " _id  name"
    );
    res.status(201).json({
      success: true,
      data: { lists },
    });
  } catch (error) {
    next(error);
  }
};

const getCards = async (req, res, next) => {
  try {
    const input = await idSchema.validateAsync(req.params);
    const _id = req.params.id;
    const board = await Board.findOne({ _id })
    const userId = await User.findById(board.userId.toString());
    if (!board) {
      return next(new ErrorHandler(400, "Board not found!"));
    }

    if (
      !board.members.includes(req.user._id) &&
      req.user._id.toString() !== userId._id.toString() &&
      !userId.usersWorkSpcaeMember.includes(req.user.email)
    ) {
      return next(
        new ErrorHandler(400, "You are not the member of this board!")
      );
    }

    const cards = await Card.find({ boardId: _id })
      .populate("boardId", " _id  name")
      .populate("listId", " _id  name");
    res.status(201).json({
      success: true,
      data: { cards },
    });
  } catch (error) {
    next(error);
  }
};

const deleteBoard = async (req, res, next) => {
  try {
    const input = await idSchema.validateAsync(req.params);
     const _id = req.params.id;
    const board = await Board.findOne({ _id })
    const userId = await User.findById(board.userId.toString());
    if (!board) {
      return next(new ErrorHandler(400, "Board not found!"));
    }

    if (
      !board.members.includes(req.user._id) &&
      req.user._id.toString() !== userId._id.toString() &&
      !userId.usersWorkSpcaeMember.includes(req.user.email)
    ) {
      return next(
        new ErrorHandler(400, "You are not the member of this board!")
      );
    }
    const lists = await List.find({ boardId: _id });
    lists.forEach(async (list) => {
      const cards = await Card.find({ listid: list._id });
      cards.forEach(async (card) => await Card.deleteOne({ _id: card._id }));
      await List.deleteOne({ _id: list._id });
    });
    res.status(201).json({
      success: true,
      message:
        "Board and all the Lists inside it and all the Cards inside the Lists Deleted Successfully",
    });
  } catch (error) {
    next(error);
  }
};

const addMember = async (req, res, next) => {
  try {
    const sender = await User.findOne({ _id: req.user._id });
    const body = await emailSchema.validateAsync(req.body);
    const to_email = body.email;
    const _id = req.params.id;
    const board = await Board.findOne({ _id })
    const userId = await User.findById(board.userId.toString());
    if (!board) {
      return next(new ErrorHandler(400, "Board not found!"));
    }

    if (
      !board.members.includes(req.user._id) &&
      req.user._id.toString() !== userId._id.toString() &&
      !userId.usersWorkSpcaeMember.includes(req.user.email)
    ) {
      return next(
        new ErrorHandler(400, "You are not the member of this board!")
      );
    }

    console.log(board.members);
    board.members.push(to_email);
    await board.save();
    inviteMail(
      to_email,
      req.user.email,
      "https://pro-go.onrender.com/api/board/" + req.params.id
    );
    res.json({
      success: true,
      message: "Invitation sent successfully",
    });
  } catch (e) {
    next(e);
  }
};

const getAllMemberInTheBoard = async (req, res, next) => {
  try {
    const _id = req.params.id;
    const board = await Board.findOne({ _id })
    const userId = await User.findById(board.userId.toString());
    if (!board) {
      return next(new ErrorHandler(400, "Board not found!"));
    }

    if (
      !board.members.includes(req.user._id) &&
      req.user._id.toString() !== userId._id.toString() &&
      !userId.usersWorkSpcaeMember.includes(req.user.email)
    ) {
      return next(
        new ErrorHandler(400, "You are not the member of this board!")
      );
    }
    const members = board.members;
    res.json({
      success: true,
      data: { members },
    });
  } catch (e) {
    next(e);
  }
};

module.exports = {
  getAll,
  addBoard,
  updateBoardById,
  getBoardById,
  getLists,
  getCards,
  deleteBoard,
  addMember,
  getAllMemberInTheBoard,
};
