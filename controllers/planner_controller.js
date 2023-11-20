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
        const planner = await Planner.findById(req.body.date);
        if (!planner) {
            return res.status(404).json({ success: false, message: 'Planner not found' });
        }
        res.status(200).json({ success: true, data: planner });
    } catch (error) {
        next(error);
    }
};

const updatePlannerById = async (req, res, next) => {
    try {
        const { taskList, goals, note } = req.body;
        const updatedPlanner = await Planner.findByIdAndUpdate(
            req.params.id,
            { taskList, goals, note },
            { new: true }
        );
        if (!updatedPlanner) {
            return res.status(404).json({ success: false, message: 'Planner not found' });
        }
        res.status(200).json({ success: true, data: updatedPlanner });
    } catch (error) {
        next(error);
    }
};

const deletePlannerById = async (req, res, next) => {
    try {
        const deletedPlanner = await Planner.findByIdAndDelete(req.params.id);
        if (!deletedPlanner) {
            return res.status(404).json({ success: false, message: 'Planner not found' });
        }
        res.status(200).json({ success: true, data: deletedPlanner });
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
