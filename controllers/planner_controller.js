const { ErrorHandler } = require('../middlewares/errorHandling');
const Planner = require('../model/planner'); 
const { createPlannerSchema , updatePlannerSchema } = require('../utils/joi_validations');

const createPlanner = async (req, res, next) => {
    try {
        const input = await createPlannerSchema.validateAsync(req.body);
        const {date, taskList, goals, note } = req.body;
        const existing = await Planner.findOne({ date : date});
        if(existing){
            return next(new ErrorHandler(400, "Planner already exists!"));
        }
        const newPlanner = new Planner({ 
            date, 
            taskList, 
            goals, 
            note,
            UserId : req.user._id    
        });
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
        if(req.user._id.toString() !== planner.UserId.toString()){
            return next(new ErrorHandler(400, "You are not allowed to access this planner!"));
        }
        res.json({ success: true, data: planner });
    } catch (error) {   
        next(error);
    }
};

const updatePlannerByDate = async (req, res, next) => {
    try {
        const input = await updatePlannerSchema.validateAsync(req.body);
        const { taskList, goals, note } = req.body;
        const date = req.params.date;
        const planner = await Planner.findOne({ date : date});
        if (!planner) {
            return res.status(404).json({ success: false, message: 'Planner not found' });
        }
        if(req.user._id.toString() !== planner.UserId.toString()){
            return next(new ErrorHandler(400, "You are not allowed to update this planner!"));
        }
        const updatedPlanner = await Planner.findOneAndUpdate(
            {date : date},
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

const deletePlannerByDate = async (req, res, next) => {
    try {
        const date = req.params.date;
        const planner = await Planner.findOne({ date : date});
        if (!planner) {
            return res.status(404).json({ success: false, message: 'Planner not found' });
        }
        if(req.user._id.toString() !== planner.UserId.toString()){
            return next(new ErrorHandler(400, "You are not allowed to delete this planner!"));
        }
        const deletedPlanner = await Planner.findOneAndDelete({ date : date});
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
    updatePlannerByDate,
    deletePlannerByDate,
};
