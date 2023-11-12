const mongoose = require('mongoose');

const { Board, List, Card } = require('../model');

const search = async (req, res,next) => {
    const query = req.query.q;
    try {
        const results1 = await Board
            .aggregate([
                {
                    $search: {
                        "index": "name",
                        "text": {
                          "path": "name",
                          "query": query,
                          "fuzzy": {}
                        }
                    }
                }
            ])
            .exec();
        const results2 = await List
            .aggregate([
                {
                    $search: {
                        "index": "name",
                        "text": {
                          "path": "name",
                          "query": query,
                          "fuzzy": {}
                        }
                    }
                },
                
            ])
            .exec();

        const results3 = await Card
            .aggregate([
                {
                    $search: {
                        "index": "name",
                        "text": {
                          "path": "name",
                          "query": query,
                          "fuzzy": {}
                        }
                    }
                },
            ])
            .exec();
        res.json({ results1, results2, results3 });
    } catch (error) {
        next(error);
    }
};

module.exports = { search };