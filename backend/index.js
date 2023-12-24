const express = require('express')
const cors = require('cors')
const User = require('./Models/User')
const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const app = express()
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')

const salt = bcrypt.genSaltSync(10)
const secret = bcrypt.genSaltSync(10)

app.use(cors({
    credentials: true,
    origin:'http://localhost:3000'
}))
app.use(express.json())
app.use(cookieParser())

mongoose.connect('mongodb+srv://lectern:GhsBXzYjur5EDD0P@lecternblog.kacz5ux.mongodb.net/?retryWrites=true&w=majority')

//register new users
app.post('/register', async (req, res) =>{
    const {username, password} = req.body;
    try {
        const userDoc = await User.create({
            username,
            password: bcrypt.hashSync(password, salt)
        })
        res.json(userDoc)
    }catch (error) {
        res.status(400).json(error);
    }
    //res.json({requestData:{username,password}})
    //console.log("Registered User")
})

//login existing users
app.post('/login', async (req, res) => {
    const {username, password} = req.body;
    const userDoc = await User.findOne({username})
    const pass = bcrypt.compareSync(password, userDoc.password)
    if(pass){
        //user is logged in
        jwt.sign({username, id:userDoc._id}, secret, {}, (err, token) => {
            if (err) throw err;
            res.cookie('token', token).json('ok')
        })
    } else{
        res.status(400).json('incorrect credentials')
    }
})

//check the login token (rn using it to change the header)
app.get('/profile', (req, res) =>{
    const{token} = req.cookies
    jwt.verify(token, secret, {}, (err, info) => {
        if(err) throw err;
        res.json(info)
    })
    res.json(req.cookies)
})

//log the user out and reset token
app.post('/logout', (req, res) => {
    res.cookie('token', '').json('ok')
})

//run the server
app.listen(4001, () => {
    console.log("Server is running")
})
//mongodb+srv://lectern:GhsBXzYjur5EDD0P@lecternblog.kacz5ux.mongodb.net/?retryWrites=true&w=majority
//username: lectern
//password: GhsBXzYjur5EDD0P