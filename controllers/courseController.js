const Course= require( "../model/Course");

const createCourse = async(req, res, next)=>{
    
    const newCourse = new Course(req.body);
    try {
        const saveCourse = await newCourse.save();
        res.status(200).json(saveCourse);
    } catch (err) {
        next(err)
    }
}

const updateCourse = async(req, res, next)=>{
    try {
        const updatedCourse = await Course.findByIdAndUpdate(req.params.id, {$set:req.body}, {new:true});
        res.status(200).json(updatedCourse);
    } catch (err) {
        next(err);
    }
}
const deleteCourse = async(req, res, next)=>{
    try {
        await Course.findByIdAndDelete(req.params.id);
        res.status(200).json("Course deleted successfully");
    } catch (err) {
        next(err);
    }
}
const getCourse = async(req, res, next)=>{
    try {
        const course = await Course.findById(req.params.id);
        res.status(200).json(course);
    } catch (error) {
        next(err);
    }
}
const getAllCourses = async(req, res, next)=>{
    
    try {
        const courses = await Course.find();
        res.status(200).json(courses);
    } catch (err) {
        next(err);
    }
}

module.exports = {createCourse, updateCourse, deleteCourse, getCourse, getAllCourses};

