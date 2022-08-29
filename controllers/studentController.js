const Student = require("../model/Student");
const Course = require("../model/Course");
const createError = require("../utils/error");

const createStudent = async(req, res, next)=>{
    const courseId = req.params.courseid;
    const newStudent = new Student(req.body);
    try {
        const saveStudent = await newStudent.save();
        try {
            await Course.findByIdAndUpdate(courseId, {
                $push:{students: saveStudent._id},
            });
        } catch (err) {
            next(err);
        }
        res.status(200).json(saveStudent);
    } catch (err) {
        next(err);
    }
}


const updateStudent = async(req, res, next)=>{
    try {
        const updatedStudent = await Student.findByIdAndUpdate(
            req.params.id,
            {$set:req.body},
            {new:true}
        );
        res.status(200).json(updatedStudent);
    } catch (err) {
        next(err);
    }
}

const deleteStudent = async(req, res, next)=>{
    const courseId = req.params.courseid;
    try {
        await Student.findByIdAndDelete(req.params.id);
        try {
            await Course.findByIdAndUpdate(courseId, {
                $pull:{students:req.params.id},
            });
        } catch (err) {
            next(err);
        }
        res.status(200).json("Student deleted successfully");
    } catch (err) {
        next(err)
    }
}

const getStudent = async(req, res, next)=>{
    try {
        const solution = await Student.findById(req.params.id);
        res.status(200).json(solution);
    } catch (err) {
        next(err);
    }
}

const getAllStudents = async(req, res, next)=>{
    try {
        const solutions = await Student.find();
        res.status(200).json(solutions);
    } catch (err) {
        next(err);
    }
}

module.exports = {createStudent, updateStudent, deleteStudent, getStudent, getAllStudents}