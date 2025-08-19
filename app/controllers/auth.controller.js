const authService = require('../services/auth.service');
const jwt = require('jsonwebtoken')
const {ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET} =  require('../environment/environment')
const {getDb} = require('../server')

const userModel = require('../models/user.model')

let refreshTokens = {}

exports.user = async(req,res) => {
    const db = await getDb();
    const username = req.params.username
    const user = await db.collection('users').findOne({username: username});
    if(!user) return res.status(404).send({error: "not found"});
    res.send(user)
}

exports.users = async(req,res) => {
    const db = await getDb();
   const users = await db.collection('users').find().toArray();
   res.send(users)
}
exports.login = async(req,res) => {
    const {email, password} = req.body;
    if(email && password){
        const user = await authService.getUserByEmailAndPassword(email, password)

        if(user){
            const access_token = generateAccesToken(user)
            const refresh_token = generateRefreshToken(user)
            const username = user.username;

            if(!refreshTokens[username]){
                refreshTokens[username] = []
            }
            refreshTokens[username].push(refresh_token)
            res.status(200).send({
                "status" : "success",
                "data":{
                    username: user.username,
                    access_token: access_token,
                    refresh_token: refresh_token
                }
            })
        }else{
            res.status(404).send('user not found')
        }
    }else{
        res.status(400).send('email and password required')
    }

}
exports.token = (req,res) => {
    const {token: refreshToken, username} = req.body
    if(refreshToken == null) {return res.status(401).send('unauth')}
    else{
        if(!refreshTokens[username] ||!refreshTokens[username].includes(refreshToken)){
            return res.status(403).send('forbidden')
        }
        jwt.verify(refreshToken,REFRESH_TOKEN_SECRET, (err,payload) => {
            if(err) return res.status(403).send('forbidden');
            const accessToken = generateAccesToken({username: payload.username})
            res.status(200).json({access_token: accessToken})
        })
    }

}
exports.register = async(req,res) => {
    const db = await getDb();
    let {email, username, password} = req.body;
    
    email = email.trim().toLowerCase();
    username = username.trim();
    
    const userMail = await db.collection('users').findOne({email: email})
    const userUsername = await db.collection('users').findOne({username: username})

    if(!userMail && !userUsername){
        const passwordHash = await authService.createHashword(password)
        const user = await userModel.addUser(email,username,passwordHash)

        res.status(201).send({
            access_token: generateAccesToken(user),
            refresh_token: generateRefreshToken(user),
            user: {
                email: user.email,
                username: user.username,
            }
        })
    }else{
        res.status(409).send({error:"email/username kullanımda"})
    }
}
exports.logout = (req,res) => {
    const {token, username} = req.body
    if(!token || !username) return res.status(401).send('unauth');
    if(!refreshTokens[username] || !refreshTokens[username].includes(token)) return res.status(403).send('forbidden');
    refreshTokens[username] = refreshTokens[username].filter(t => t !== token)
    res.status(200).send({status: "success", message: "logged out"})
}


const generateAccesToken = (user) => {
    return jwt.sign({username: user.username}, ACCESS_TOKEN_SECRET,{expiresIn:"1h"})
}

const generateRefreshToken = (user) => {
    return jwt.sign({username: user.username},REFRESH_TOKEN_SECRET,{expiresIn: "7d"})
}

