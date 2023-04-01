const express = require("express")
const router = express.Router()
const User = require("../model/user")
const bcrypt = require("bcryptjs")
const JsonWebToken = require("jsonwebtoken")
const dotenv = require('dotenv');

dotenv.config();


router.get("/users", async(req, res) => {
    const users = await User.find()
    res.send(users)
})
async function getSingleUser(userID) {
    const result = await User.findOne({username: userID})
    return result
}

router.get("/users/test", async(req, res) => {
    res.send(process.env.TEST)
})

router.get("/users/:id", async(req, res) => {
    console.log(req.headers)
    fetchUserByToken(req).then(async (user) => {
        const result = await User.findOne({username: req.params.id})
        if(result) {
            res.send(result)
        }
    
        else {
            res.status(400)
            res.send({error: "No user found"})
        }
    }).catch((err) => {
        res.send("Token not valid")
    })
    
})

router.post("/users/register", async (req, res) => {
    console.log(req.query)
    const user = new User({
        username: req.body.username,
        prename: req.body.prename,
        surname: req.body.surname,
        birthday: Date(),
        validatedMail: false,
        password: bcrypt.hashSync(req.body.password, 10)
    })
    try {
        await user.save()
        const token = JsonWebToken.sign({username: user.username}, process.env.SECRET_JWT)
        res.json({sucess: true, token: token})
    }
    catch(err) {
        console.log(err)
        res.status(400)
        res.send({error: "Failed"})
    }   
})

router.post("/users/login", (req, res) => {
    User.findOne({username: req.body.username}).then((user) => {
        if(!user) {
            res.json({success: false, error:"User " + req.body.username + " does not exist"})
        }
        else {
            if(!bcrypt.compareSync(req.body.password, user.password)) {
                res.json({success: false, error: "Wrong password"})
            }
            else {
                const token = JsonWebToken.sign({username: user.username}, process.env.SECRET_JWT, {expiresIn: "24h"})
                res.json({success: true, token: token})
            }
        }
    })
})

router.delete("/users", async (req, res) => {
    try {
        await User.deleteOne({username:req.params.username})
        res.status(204).send()
    } catch {
        res.status(404)
        res.send({error: "User does not exist"})
    }
    
})

router.delete("/users/deleteAll", async (req, res) => {
    try {
        await User.deleteMany({})
        res.status(204).send()
    } catch {
        res.status(404)
        res.send({error: "User does not exist"})
    }
    
})


function fetchUserByToken(req) {
    return new Promise(async (resolve,reject) => {
        if(req.headers && req.headers.authorization) {
            let authorization = req.headers.authorization
            let decoded

            try {
                decoded = JsonWebToken.verify(authorization, process.env.SECRET_JWT)
                // console.log(decoded)
            } catch(err) {
                reject("Token not valid")
                return
            }

            let username = decoded.username
            const result = await getSingleUser(username)
            if(result) {
                resolve(result)
            }
            else {
                reject("Token error")
            }
        }
        else {
            reject("No token found")
        }
    })
}



module.exports = router