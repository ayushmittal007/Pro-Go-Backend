const { User, Board, List, Card } = require("../model");
const { ErrorHandler } = require("../middlewares/errorHandling");
const { idSchema , cardSchema , updateCardSchema} = require("../utils/joi_validations");
const moment = require("moment");

const addCard = async (req, res, next) => {
  try {
    const input = await cardSchema.validateAsync(req.body);
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
      return next(new ErrorHandler(400, "You can not add card!"));
    }
    const listId = req.body.listId;
    const list = await List.findOne({ _id: listId, boardId: boardId });
    if (!list) {
      return next(new ErrorHandler(400, "List not found!"));
    }
    const cardName = req.body.name;
    const existing = await Card.findOne({
      name: cardName,
      listId: listId,
      boardId: boardId,
    });
    // console.log(existing)
    if (existing) {
      return next(new ErrorHandler(400, "Card with this name already exists!"));
    }

    const card = new Card({
      name: req.body.name,
      boardId: boardId,
      listId: listId,
      userId: req.user._id,
      daysAlloted: req.body.daysAlloted,
      description: req.body.description,
      color: req.body.color,
    });
    const respData = await card.save();
    res.status(201).json({
      status: true,
      message: "Card Added Successfully",
      data: { respData },
    });
  } catch (error) {
    next(error);
  }
};

const getCardById = async (req, res, next) => {
  try {
    const input = await idSchema.validateAsync(req.params);
    const _id = req.params.id;
    const cards = await Card.findById(_id);
    // console.log(cards)
    if (!cards) {
      return next(new ErrorHandler(400, "Card not found!"));
    }
    const board = await Board.findById(cards.boardId).populate(
      "userId",
      "_id username email usersWorkSpcaeMember"
    );
    if(!board){
      return next(new ErrorHandler(400, "Board not found!"));
    }
    
    if (
      req.user._id.toString() != board.userId._id.toString() &&
      !board.members.includes(req.user.email) &&
      !board.userId.usersWorkSpcaeMember.includes(req.user.email)
    ) {
      return next(
        new ErrorHandler(400, "You are not allowed to access this card!")
      );
    }

    res.status(201).json({
      status: true,
      data: { cards },
    });
  } catch (error) {
    next(error);
  }
};

const updateCard = async (req, res, next) => {
  try {
    const input = await idSchema.validateAsync(req.params);
    const cardInput = await updateCardSchema.validateAsync(req.body);
    const _id = req.params.id;
    const cards = await Card.findById(_id);
    // console.log(cards)
    if (!cards) {
      return next(new ErrorHandler(400, "Card not found!"));
    }

    const board = await Board.findById(cards.boardId).populate(
      "userId",
      "_id username email usersWorkSpcaeMember"
    );
    if(!board){
      return next(new ErrorHandler(400, "Board not found!"));
    }
   
    if (
      req.user._id.toString() != board.userId._id.toString() &&
      !board.members.includes(req.user.email) &&
      !board.userId.usersWorkSpcaeMember.includes(req.user.email)
    ) {
      return next(
        new ErrorHandler(400, "You are not allowed to update this card!")
      );
    }
    const respData = await Card.findByIdAndUpdate(_id, req.body, { new: true });
    res.status(201).json({
      status: true,
      message: "Card Updated Successfully",
      data: { respData },
    });
  } catch (err) {
    next(err);
  }
};

const addDataToCard = async (req, res, next) => {
  try {
    const dataToAdd = req.body.data;
    const _id = req.params.id;
    const cards = await Card.findById(_id);
    // console.log(cards)
    if (!cards) {
      return next(new ErrorHandler(400, "Card not found!"));
    }
    const board = await Board.findById(cards.boardId).populate(
      "userId",
      "_id username email usersWorkSpcaeMember"
    );
    if(!board){
      return next(new ErrorHandler(400, "Board not found!"));
    }

    if (
      req.user._id.toString() != board.userId._id.toString() &&
      !board.members.includes(req.user.email) &&
      !board.userId.usersWorkSpcaeMember.includes(req.user.email)
    ) {
      return next(
        new ErrorHandler(400, "You are not allowed to add to this card!")
      );
    }

    cards.data.push(dataToAdd);
    const respData = await cards.save();
    res.status(201).json({
      status: true,
      message: "Data Added Successfully",
      data: { respData },
    });
  } catch (err) {
    next(err);
  }
};

const deleteCard = async (req, res, next) => {
  try {
    const input = await idSchema.validateAsync(req.params);
    const _id = req.params.id;
    const cards = await Card.findById(_id);
    // console.log(cards)
    if (!cards) {
      return next(new ErrorHandler(400, "Card not found!"));
    }

    const board = await Board.findById(cards.boardId).populate(
      "userId",
      "_id username email usersWorkSpcaeMember"
    );
    if(!board){
      return next(new ErrorHandler(400, "Board not found!"));
    }
    if (
      req.user._id.toString() != board.userId._id.toString() &&
      !board.members.includes(req.user.email) &&
      !board.userId.usersWorkSpcaeMember.includes(req.user.email)
    ) {
      return next(
        new ErrorHandler(400, "You are not allowed to delete this card!")
      );
    }

    const card = await Card.findByIdAndDelete(_id);
    res.status(201).json({
      status: true,
      message: "Card Deleted Successfully",
    });
  } catch (error) {
    next(error);
  }
};

const addColorToCard = async (req, res, next) => {
  try{
    const input = await idSchema.validateAsync(req.params);
    const _id = req.params.id;
    const card = await Card.findById(_id);
    if(!card){
      return next(new ErrorHandler(400, "Card not found!"));
    }
    const board = await Board.findById(card.boardId).populate(
      "userId",
      "_id username email usersWorkSpcaeMember"
    );
    if(!board){
      return next(new ErrorHandler(400, "Board not found!"));
    }

    if (
      req.user._id.toString() != board.userId._id.toString() &&
      !board.members.includes(req.user.email) &&
      !board.userId.usersWorkSpcaeMember.includes(req.user.email)
    ) {
      return next(
        new ErrorHandler(400, "You are not allowed to change this card!")
      );
    }
    const color = req.body.color;
    card.color = color;
    const respData = await card.save();
    res.status(201).json({
      status: true,
      message: "Color Added Successfully",
      data: { respData },
    });
  }catch(err){
    next(err)
  }
}

const changeCurrentStatusOfCard = async (req, res, next) => {
  try{
    const input = await idSchema.validateAsync(req.params);
    const _id = req.params.id;
    const card = await Card.findById(_id);
    if(!card){
      return next(new ErrorHandler(400, "Card not found!"));
    }
    const board = await Board.findById(card.boardId).populate(
      "userId",
      "_id username email usersWorkSpcaeMember"
    );
    if(!board){
      return next(new ErrorHandler(400, "Board not found!"));
    }

    if (
      req.user._id.toString() != board.userId._id.toString() &&
      !board.members.includes(req.user.email) &&
      !board.userId.usersWorkSpcaeMember.includes(req.user.email)
    ) {
      return next(
        new ErrorHandler(400, "You are not allowed to change this card!")
      );
    }
    const cuurStatus = card.done;
    card.done = !cuurStatus;
    const respData = await card.save();
    res.status(201).json({
      status: true,
      message: "Card status changed successfully",
      data: { respData },
    });
  }catch(err){
    next(err)
  }
}

const checkDueDate = async (req, res, next) => {
  try {
    const input = await idSchema.validateAsync(req.params);
    const _id = req.params.id;
    const cards = await Card.findById(_id);
    // console.log(cards)
    if (!cards) {
      return next(new ErrorHandler(400, "Card not found!"));
    }
    const board = await Board.findById(cards.boardId).populate(
      "userId",
      "_id username email usersWorkSpcaeMember"
    );
    if(!board){
      return next(new ErrorHandler(400, "Board not found!"));
    }

    if (
      req.user._id.toString() != board.userId._id.toString() &&
      !board.members.includes(req.user.email) &&
      !board.userId.usersWorkSpcaeMember.includes(req.user.email)
    ) {
      return next(
        new ErrorHandler(
          400,
          "You are not allowed to access due date of this card!"
        )
      );
    }

    const createdAtStr = cards.createdAt;
    const createdDate = moment(createdAtStr);

    const timeAllottedDays = cards.daysAlloted;
    const currentTime = moment.utc();
    const timeDifference = currentTime.diff(createdDate, "days");

    if (timeDifference >= timeAllottedDays) {
      res.status(201).json({
        status: true,
        message: "Time has elapsed",
      });
    } else {
      res.status(201).json({
        status: true,
        message: "Time is still left",
      });
    }
  } catch (error) {
    next(error);
  }
};


const addFile = async (req, res, next) => {
  try {
    const existing = await User.findOne({email : req.user.email});
    if(existing == null){
      return next (new ErrorHandler(400 , "No user found"));
    }
    const existingCard = await Card.findById(req.params.id);
    if(existingCard == null){
      return next (new ErrorHandler(400 , "No card found"));
    }
    existingCard.file.push("public/files" + "/" + req.file.filename);
    await existingCard.save();
    res.json({
      success: true,
      message : "File added successfully"
    });
  } catch (e) {
    next(e);
  }
}

const getFiles = async (req , res , next) => {
  try{
    const existing = await User.findOne({email : req.user.email});
    if(existing == null){
      return next (new ErrorHandler(400 , "No user found"));
    }
    const existingCard = await Card.findById(req.params.id);
    if(existingCard == null){
      return next (new ErrorHandler(400 , "No card found"));
    }
    const file = existingCard.file;
    res.json({
      success: true,
      file : file
    });
  }catch(e){
    next(e);
  }
}

module.exports = {
  getCardById,
  addCard,
  updateCard,
  deleteCard,
  addDataToCard,
  addColorToCard,
  changeCurrentStatusOfCard,
  checkDueDate,
  addFile,
  getFiles,
};
