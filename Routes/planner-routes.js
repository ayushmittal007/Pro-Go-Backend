const express = require("express");
const plannerRouter = express.Router();
const { plannerController } = require("../controllers")
const auth = require("../middlewares/auth")

plannerRouter.get("/:date" , auth , plannerController.getPlannerByDate);
plannerRouter.post("/add" , auth , plannerController.createPlanner);
plannerRouter.patch("/:id/update" , auth , plannerController.updatePlannerById);
plannerRouter.delete("/:id/delete" , auth , plannerController.deletePlannerById);

module.exports = plannerRouter;