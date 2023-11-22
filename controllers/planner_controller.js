const Planner = require('../model/planner'); 
const { createPlannerSchema , updatePlannerSchema } = require('../utils/joi_validations');

const createPlanner = async (req, res, next) => {
    try {
        const input = await createPlannerSchema.validateAsync(req.body);
        const {date, taskList, goals, note } = req.body;
        const newPlanner = new Planner({date, taskList, goals, note });
        const savedPlanner = await newPlanner.save();
        res.status(201).json({ success: true,message : "Creation Successfull" , data: savedPlanner });
    } catch (error) {
        next(error);
    }
};

const getPlannerByDate = async (req, res, next) => {
    try {
        const date = req.params.date;
        console.log(date);
        const planner = await Planner.findOne({ date : date});
        console.log(planner);
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
        const input = await updatePlannerSchema.validateAsync(req.body);
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
        res.json({ success: true, message : "Updation Successfull"  , data: updatedPlanner });
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
        res.json({ success: true, message : "Deletion Successfull" });
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
