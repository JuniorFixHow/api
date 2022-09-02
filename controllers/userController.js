const User = require("../model/User");
const Assignment = require("../model/Assignment");
const createError = require("../utils/error");
const bcrypt = require("bcrypt");

const updateUser = async(req, res, next)=>{
    const {id} = req.params;
    let {username, email, phone, photo, password, isAdmin} = req.body;

    if(password !=="" && password.length < 8){
        next(createError(400, "Password too short. At leat 8 is OK"));
    }
    else{
        const user = await User.findById(id);
        if(user){
            const saltRounds = 10;
            bcrypt.hash(password, saltRounds)
                .then(hashedPassword=>{
                    User.findByIdAndUpdate(id,
                            { 
                                $set:{
                                    username: req.body.username? req.body.username : user.username, 
                                    email: req.body.email? req.body.email : user.email, 
                                    phone: req.body.phone? req.body.phone : user.phone, 
                                    photo: req.body.photo? req.body.photo : user.photo, 
                                    password: req.body.password? hashedPassword : user.password
                                }

                            },
                            {new:true},
                        )
                        .then(result=>{
                            res.status(200).json({message:'Details updated successfully', data: result})
                        })
                        .catch(error=>{
                            next(createError(400, "Error occured updating user. User may already exist"));
                        })
                })
                .catch(err=>{
                    next(err);
                })
        }
        else{
            next(createError(404, "User does not exist"));
        }
    }
}

const getAllUsers = async(req, res, next)=>{
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (err) {
        next(err);
    }
}

const getUser = async(req, res, next)=>{
    try {
        const user = await User.findById(req.params.id);
        res.status(200).json(user);
    } catch (error) {
        next(err);
    }
}

const deleteUser = async(req, res, next)=>{
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json("User deleted successfully");
    } catch (err) {
        next(err);
    }
}

//user assignments
const getUserAssignments = async (req, res, next)=>{
    try{
        const user = await User.findById(req.params.id);
        const list = await Promise.all(
            user.assignments.map((assignment)=>{
                return Assignment.findById(assignment);
            })
        );
        res.status(200).json(list);
    }
    catch(err){
        next(err);
    }
}


module.exports = {updateUser, getAllUsers, getUser, deleteUser, getUserAssignments};