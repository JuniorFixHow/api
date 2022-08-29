const express = require( "express");
const cors = require( "cors");
const ConnectDB = require( "./Db");
const mongoose = require( "mongoose");
const cookieParser = require( "cookie-parser");
const authRoutes = require( "./routes/authRoutes");
const userRoutes = require( "./routes/userRoutes");
const cookieSession = require( "cookie-session");
const dotenv = require( "dotenv");
const passport = require( "passport");
const assignmentRoutes = require( "./routes/assignments");
const solutionRoutes = require( "./routes/solutions");
const courseRoutes = require( "./routes/courseRoutes");
const studentRoutes = require( "./routes/studentRoutes");


const app = express();
ConnectDB();
mongoose.connection.on("disconnected", ()=>{
    console.log("Mongo is disconnected");
})
mongoose.connection.on("connected", ()=>{
    console.log("Mongo is back!");
})
dotenv.config();
app.use(cookieSession(
    {
        name:"session",
        keys: [process.env.JWT],
        maxAge: 24*60*60*100
    }
))

require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());
app.use(cors({
    origin:"http://localhost:3000",
    methods: "GET, POST, PUT, PATCH, DELETE",
    credentials:true
}));
app.use(cookieParser());
app.use(express.json());

app.use("/api/users", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/solutions", solutionRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/students", studentRoutes);


app.use((err, req, res, next)=>{
    const errorStatus = err.status ||500;
    const errorMessage = err.message || "Something went wrong!"
    return res.status(errorStatus).json({
        success:false,
        status:errorStatus,
        message:errorMessage,
        stack: err.stack
    });
})


app.listen(5500, ()=>{
    console.log("Server is listening on port 5500");
})