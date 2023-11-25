const express = require("express");
const plannerRouter = express.Router();
const { plannerController } = require("../controllers")
const auth = require("../middlewares/auth")

plannerRouter.get("/:date" , auth , plannerController.getPlannerByDate);
plannerRouter.post("/add" , auth , plannerController.createPlanner);
plannerRouter.patch("/:date/update" , auth , plannerController.updatePlannerByDate);
plannerRouter.delete("/:date/delete" , auth , plannerController.deletePlannerByDate);

module.exports = plannerRouter;