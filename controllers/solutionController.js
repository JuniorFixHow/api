const Solution = require("../model/Solution");
const Assignment = require("../model/Assignment");
const createError = require("../utils/error");

const createSolution = async(req, res, next)=>{
    const assignmentId = req.params.assignmentid;
    const newSolution = new Solution(req.body);
    try {
        const saveSolution = await newSolution.save();
        try {
            await Assignment.findByIdAndUpdate(assignmentId, {
                $push:{answers: saveSolution._id},
            });
        } catch (err) {
            next(err);
        }
        res.status(200).json(saveSolution);
    } catch (err) {
        next(err);
    }
}


const updateSolution = async(req, res, next)=>{
    try {
        const updatedSolution = await Solution.findByIdAndUpdate(
            req.params.id,
            {$set:req.body},
            {new:true}
        );
        res.status(200).json(updatedSolution);
    } catch (err) {
        next(err);
    }
}

const deleteSolution = async(req, res, next)=>{
    const assignmentId = req.params.assignmentid;
    try {
        await Solution.findByIdAndDelete(req.params.id);
        try {
            await Assignment.findByIdAndUpdate(assignmentId, {
                $pull:{answers:req.params.id},
            });
        } catch (err) {
            next(err);
        }
        res.status(200).json("Solution deleted successfully");
    } catch (err) {
        next(err)
    }
}

const getSolution = async(req, res, next)=>{
    try {
        const solution = await Solution.findById(req.params.id);
        res.status(200).json(solution);
    } catch (err) {
        next(err);
    }
}

const getAllSolutions = async(req, res, next)=>{
    try {
        const solutions = await Solution.find();
        res.status(200).json(solutions);
    } catch (err) {
        next(err);
    }
}

module.exports = {createSolution, updateSolution, deleteSolution, getSolution, getAllSolutions}