const Mongoose = require('mongoose')

const plannerSchema = new Mongoose.Schema({
    date : {
        type : String
    },
    taskList : {
        type : Array,
        default : []
    },
    goals : {
        type : String,
    },
    note : {
        type : String,
    },
},
{
    timestamps: true
})

const Planner = new Mongoose.model("planner", plannerSchema);
module.exports = Planner