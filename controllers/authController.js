const express = require( "express");
const UserVerification= require( "../model/UserVerification");
const bcrypt = require( "bcrypt");
const PasswordReset = require( "../model/ResetPassword");
const nodemailer = require( "nodemailer");

const path= require("path");
const { v4: uuid} = require( "uuid");
const dotenv = require( "dotenv");
const User = require( "../model/User");
const jwt = require( "jsonwebtoken");
const createError = require( "./../utils/error")
const passport = require('passport');

const router = express.Router();
let transporter = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
})

transporter.verify((error, success)=>{
    if(error){
        console.log(error);
    }
    else{
        console.log("Ready for messages");
        console.log(success);
    }
})

const register = async(req, res)=>{
    const {username, email, password, phone, photo} = req.body;
    if(password.length<8){
        res.status(400).json('Password too short! At least 8 is ok')
    }
    else{
        User.find({username}).then(result=>{
            if(result.length){
                res.status(402).json("User already exists");
            }
            else{
                User.find({email}).then(result=>{
                    if(result.length){
                        res.status(402).json("Email taken by another user");
                    }
                    else{
                        const saltRounds = 10;
                        bcrypt.hash(password, saltRounds).then(hashedPassword=>{
                            const user = new User({
                                username, 
                                email,
                                phone,
                                password:hashedPassword,
                                photo,
                                verified: false
                            });
                            user.save()
                                .then(result=>{
                                    sendVerificationEmail(result, res);
                                })
                                .catch(error=>{
                                    res.status(400).json("An error occured registering your account. Try again");
                                })
                        })
                        .catch(error=>{
                            res.status(400).json("An error occured whiles hashing your password");
                        })
                    }
                })
                .catch(error=>{
                    console.log(error);
                    res.status(400).json("An error occured verifying the esistence of your email");
                })
            }
        })
        .catch(error=>{
            console.log(error);
            res.status(400).json("An error occured verifying the existence of your username");
        })
    }
    // sendVerificationEmail(result, res);
}

const sendVerificationEmail = ({_id, email}, res)=>{
    const currentUrl = "http://localhost:5500/";

    const uniqueString = uuid() + _id;

    const mailOptions = {
        from: process.env.EMAIL,
        to:email,
        subject: 'Email Verification',
        html: `<p>Verify your email to complete registration.</p> <p>This link <b>expires in 6 hours </b>
        <p>Click <a href=${currentUrl + "api/users/verify/" + _id + "/" + uniqueString } > here</a> to proceed</p>
        </p>`,
    };

    const saltRounds = 10;
    bcrypt.hash(uniqueString, saltRounds)
        .then((hashedUniquePassword)=>{
            const newVerification = new UserVerification({
                userId: _id,
                uniqueString: hashedUniquePassword,
                createdAt: Date.now(),
                expiresAt: Date.now() + 21600000,
            });

            newVerification.save()
                .then(()=>{
                    transporter
                        .sendMail(mailOptions)
                        .then(async()=>{
                            res.status(200).json("Verification link sent");
                        })
                        .catch((error)=>{
                            res.status(400).json("Email verification failed")
                        })
                })
                .catch((error)=>{
                    console.log(error);
                    res.status(400).json("Could not save email verification data");
                })
        })
        .catch(()=>{
            res.status(400).json("An error occured while processing email", );
        })
}


const verify =(req, res)=>{


    let {userId, uniqueString} = req.params;
    UserVerification
        .find({userId})
        .then((result)=>{
            if(result.length > 0){
                const {expiresAt} = result[0];
                const hashedUniqueString = result[0].uniqueString;
                if(expiresAt < Date.now()){
                    UserVerification
                        .deleteOne({userId})
                        .then(result=>{
                            User
                                .deleteOne({_id: userId})
                                .then(()=>{
                                    let message = 'Verification link expired. Pleasse sign up again';
                                    res.redirect(`/api/users/verified/?error=true&message=${message}`)
                                })
                                .catch(error=>{
                                    let message = 'Clearing user with expired ID failed';
                                    res.redirect(`/api/users/verified/?error=true&message=${message}`)
                                })
                        })
                        .catch((error)=>{
                            let message = 'An error occured trying to clear expired verification record';
                            res.redirect(`/api/users/verified/?error=true&message=${message}`)
                        })
                }
                else{
                    bcrypt
                        .compare(uniqueString, hashedUniqueString)
                        .then(result=>{
                            if(result){
                                User
                                    .updateOne({_id: userId}, {verified:true})
                                    .then(()=>{
                                        UserVerification
                                            .deleteOne({userId})
                                            .then(()=>{
                                                res.sendFile(path.join(__dirname, "./../views/verified.html"))
                                            })
                                            .catch(error=>{
                                                console.log(error);
                                                let message = 'An error occured trying to finalize verification';
                                                res.redirect(`/api/users/verified/?error=true&message=${message}`)
                                            })
                                    })
                                    .catch(error=>{
                                        console.log(error);
                                        let message = 'An error occured trying to update user record';
                                        res.redirect(`/api/users/verified/?error=true&message=${message}`)
                                    })
                            }
                            else{
                                let message = 'Incorrect verification details passed. Check your inbox for the orginal link';
                                res.redirect(`/api/users/verified/?error=true&message=${message}`)
                            }
                        })
                        .catch(error=>{
                            let message = 'An error occured trying to compare unique link';    
                            res.redirect(`/api/users/verified/?error=true&message=${message}`)
                        })
                }
            }
            else{
                let message = 'Error occured. Either account has been verified already or does not exist. Please login or sign up';
                res.redirect(`/api/users/verified/?error=true&message=${message}`)
            }
        })
        .catch((error)=>{
            console.log(error);
            let message = 'An error occured trying to check the existence your email';
            res.redirect(`/api/users/verified/?error=true&message=${message}`)
        })
};

const verificationFile = (req, res)=>{
    res.sendFile(path.join(__dirname, "./../views/verified.html"));
}

const login = async(req, res, next)=>{
    try {
        const user = await User.findOne({email: req.body.email});
        if(!user){
            next(createError(404, "Incorrect email or password!"))
        }
        
        const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);
        if(!isPasswordCorrect) {
            next(createError(400, "Incorrect email or password!"));
        }
        else if(!user.verified){
            next(createError(400, "Email not verified yet. Check your mailbox"));
        }
        else{
            const token = jwt.sign({id:user._id, isAdmin: user.isAdmin}, "ENQ70Fvmh52nMq5htO4r46T/tSBmhvEEVhQNacH5kJc=");
            const { password, verified, isAdmin, ...otherDetails} = user._doc;
            res.cookie("access_token", token, {
                httpOnly:true,
            })
            .status(200).json({...otherDetails});
        }
        

    } catch (err) {
        console.log(err)
        res.status(400).json("Error occured loggin you in. Try again")
    }
}


const requestPasswordReset = async(req, res)=>{
    const {email, redirectUrl} = req.body;
    User
        .find({email})
        .then((user)=>{
            if(user.length){
                if(!user[0].verified){
                    res.status(400).json('Email not verified yet. Check your inbox');
                } 
                else{
                    sendResetEmail(user[0], redirectUrl,res);
                }
            }
            else{
                res.status(422).json('No user bears the provided eamil');
            }
        })
        .catch(error=>{
            console.log(error);
            res.status(400).json('Error occured whiles verifying the user');
        })
}

sendResetEmail =({_id, email}, redirectUrl, res)=>{
    const resetString = uuid() + _id;
    PasswordReset
        .deleteMany({userId:_id})
        .then((result)=>{
            const mailOptions = {
                from: process.env.EMAIL,
                to:email,
                subject: 'Reset Password',
                html: `<p>A request received to reset your password. Ignore this message if you are not the one who made the request.</p> <p>This link <b>expires in an hour </b>
                <p>Click <a href=${redirectUrl + "/" + _id + "/" + resetString } > here</a> to proceed</p>
                </p>`,

                
            };

            const saltRounds = 10;
            bcrypt 
                .hash(resetString, saltRounds)
                .then(hashedResetString=>{
                    const newPasswordReset = new PasswordReset({
                        userId: _id,
                        resetString: hashedResetString,
                        createdAt: Date.now(),
                        expiresAt: Date.now() + 3600000
                    });

                    newPasswordReset
                        .save()
                        .then(()=>{
                            transporter
                                .sendMail(mailOptions)
                                .then(()=>{
                                    res.status(200).json('Password reset email sent');
                                })
                                .catch(error=>{
                                    console.log(error);
                                    res.status(400).json('Error occured sending password reset email');
                                })
                        })
                        .catch(error=>{
                            console.log(error);
                            res.status(400).json('Error occured saving password reset data');
                        })
                })
                .catch(error=>{
                    console.log(error);
                    res.status(400).json('Error occured processing your credentials');

                })
        })
        .catch(error=>{
            console.log(error);
            res.status(400).json('Error occured deleting existing password reset requests');
        })
}


const resetPass = (req, res)=>{
    let {userId, resetString, newPassword} = req.body;
    if(newPassword.length < 8){
        res.status(400).json('Password too short. At least 8 is OK')
    }
    else{
        PasswordReset
        .find({userId})
        .then(user=>{
            if(user.length > 0){
                const expiresAt = user[0];
                const hashedResetString = user[0].resetString;
                if(expiresAt < Date.now()){
                    PasswordReset
                        .deleteOne({userId})
                        .then(()=>{
                            res.status(400).json('Reset status expired');
                        })
                        .catch(error=>{
                            console.log(error);
                            res.status(400).json('Clearing password reset request failed');
                        })
                }
                else{
                    bcrypt
                        .compare(resetString, hashedResetString)
                        .then((result)=>{
                            if(result){
                                const saltRounds = 10;
                                bcrypt
                                    .hash(newPassword, saltRounds)
                                    .then(hashedNewPassword=>{
                                        User.updateOne({_id: userId}, {password: hashedNewPassword})
                                        .then(()=>{
                                           PasswordReset
                                            .deleteOne({userId})
                                            .then(()=>{
                                                res.status(201).json('Password reset successfully');
                                            }) 
                                            .catch(error=>{
                                                console.log(error);
                                                res.status(400).json('Password reset failed in the final staged')
                                            })
                                        })
                                        .catch(error=>{
                                            res.status(400).json('User password update failed');
                                        })
                                    })
                                    .catch(error=>{
                                        console.log(error);
                                        res.status(400).json('An error occured trying to process paswword details');
                                    })
                            }
                            else{
                                res.status(400).json("Invalid reset details provided"); 
                            }
                        })
                        .catch(error=>{
                            res.status(400).json('An error occured comparing reset data.')
                        })
                }       
            }
            else{
                res.status(422).json("Password reset request not found");
            }
        })
        .catch(error=>{
            console.log(error);
            res.status(400).json('Error occured validating reset records');
        })
    }
    
}


//Google Authentication


const loginSuccess = (req, res)=>{
    if(req.user){
        res.status(200).json({
            success: true,
            message: "Account authenticated successfully",
            userG: req.user,
            // cookies: req.cookies
        });
    }
};

const gloginFailed = (req, res)=>{
    res.status(401).json({
        success: false,
        message: "Failed to authenticate user"
    });
};

const gloginAuth = (
  passport.authenticate('google', { scope: ['profile', 'email'] }));

const gloginCallBack = (
  passport.authenticate('google', { 
    failureRedirect: '/login/failed',
    successRedirect: 'http://localhost:3000'
})
);
//     function(req, res) {
//     // Successful authentication, redirect home.
//     res.redirect('http://localhost:3000/room');
//     res.status(200).json({user: req.user});
//   }

  const glogout = (req, res)=>{
    req.logout();
    res.redirect('http://localhost:3000');
  }


module.exports ={
    verificationFile,
    verify,
    login,
    register,
    requestPasswordReset,
    resetPass,
    gloginAuth,
    glogout,
    gloginCallBack,
    gloginFailed,
    loginSuccess
}

