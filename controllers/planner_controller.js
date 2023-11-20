const Planner = require('../model/planner'); 

const createPlanner = async (req, res, next) => {
    try {
        const {date, taskList, goals, note } = req.body;
        const newPlanner = new Planner({date, taskList, goals, note });
        const savedPlanner = await newPlanner.save();
        res.status(201).json({ success: true, data: savedPlanner });
    } catch (error) {
        next(error);
    }
};

const getPlannerByDate = async (req, res, next) => {
    try {
        const {date} = req.body;
        const planner = await Planner.findOne({date});
        if (!planner) {
            return res.status(404).json({ success: false, message: 'Planner not found' });
        }
        res.json({ success: true, data: planner });
    } catch (error) {
        next(error);
    }
};

const updatePlannerById = async (req, res, next) => {
    try {
        const { taskList, goals, note } = req.body;
        const id=req.params.id;
        const updatedPlanner = await Planner.findByIdAndUpdate(
            id,
            { taskList, goals, note },
            { new: true }
        );
        if (!updatedPlanner) {
            return res.status(404).json({ success: false, message: 'Planner not found' });
        }
        res.json({ success: true, data: updatedPlanner });
    } catch (error) {
        next(error);
    }
};

const deletePlannerById = async (req, res, next) => {
    try {
        const id=req.params.id;
        const deletedPlanner = await Planner.findByIdAndDelete(id);
        if (!deletedPlanner) {
            return res.status(404).json({ success: false, message: 'Planner not found' });
        }
        res.json({ success: true, data: deletedPlanner });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createPlanner,
    getPlannerByDate,
    updatePlannerById,
    deletePlannerById,
};
