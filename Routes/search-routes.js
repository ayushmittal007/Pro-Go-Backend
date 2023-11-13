const express = require('express');
const searchRouter = express.Router();
const { searchController } = require('../controllers');
const auth = require('../middlewares/auth');

searchRouter.get('/search', auth, searchController.search);

module.exports = searchRouter;