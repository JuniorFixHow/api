const Assignment = require("../model/Assignment");
const User = require("../model/User");
const Solution = require("../model/Solution");
const createError = require("../utils/error");

const createAssignment = async(req, res, next)=>{
    const userId = req.params.userid;
    const newAssignment = new Assignment(req.body);
    try {
        const saveAssignment = await newAssignment.save();
        try {
            await User.findByIdAndUpdate(userId, {
                $push:{assignments: saveAssignment._id},
            });
        } catch (err) {
            next(err);
        }
        res.status(200).json(saveAssignment);
    } catch (err) {
        next(err);
    }
}


const updateAssignment = async(req, res, next)=>{
    try {
        const updatedAssignment = await Assignment.findByIdAndUpdate(
            req.params.id,
            {$set:req.body},
            {new:true}
        );
        res.status(200).json(updatedAssignment);
    } catch (err) {
        next(err);
    }
}

const deleteAssignment = async(req, res, next)=>{
    const userId = req.params.userid;
    try {
        await Assignment.findByIdAndDelete(req.params.id);
        try {
            await User.findByIdAndUpdate(userId, {
                $pull:{assignments:req.params.id},
            });
        } catch (err) {
            next(err);
        }
        res.status(200).json("Assignment deleted successfully");
    } catch (err) {
        next(err)
    }
}

const getAssignment = async(req, res, next)=>{
    try {
        const assignment = await Assignment.findById(req.params.id);
        res.status(200).json(assignment);
    } catch (err) {
        next(err);
    }
}

const getAllAssignments = async(req, res, next)=>{
    try {
        const assignments = await Assignment.find();
        res.status(200).json(assignments);
    } catch (err) {
        next(err);
    }
}

const getAssignmentSolutions = async (req, res, next)=>{
    try{
        const assignment = await Assignment.findById(req.params.id);
        const list = await Promise.all(
            assignment.answers.map((answer)=>{
                return Solution.findById(answer);
            })
        );
        res.status(200).json(list);
    }
    catch(err){
        next(err);
    }
}

module.exports = {createAssignment, updateAssignment, deleteAssignment, getAssignment, getAllAssignments, getAssignmentSolutions}