const authService = require('../services/auth.service');
const jwt = require('jsonwebtoken')
const {ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET} =  require('../environment/environment')
const {getDb} = require('../config/db')

const {addUser}= require('../models/user.model')

let refreshTokens = {}

exports.user = async(req,res) => {
    console.log('user controller çalıştı')
    const db = await getDb();
    const username = req.params.username
    let user = await db.collection('users').findOne({username: username});
    if(!user) return res.status(404).send({error: "not found"});
    user = {
        username: user.username,
        email: user.email
    }
    res.send(user)
}

exports.users = async(req,res) => {
    const db = await getDb();
   const users = await db.collection('users').find().toArray();
   res.send(users)
}
exports.login = async(req,res) => {
    console.log('login controller çalıştı')
    const {username, password} = req.body;
    if(username && password){
        const user = await authService.getUserByUsernameAndPassword(username, password)
        if(user){
            console.log('kullanıcı bulundu')
            const access_token = generateAccesToken(user)
            const refresh_token = generateRefreshToken(user)
            const username = user.username;

            console.log(`tokenlar oluşturuldu: àccess: `,access_token,`\nrefresh: `,refresh_token)

            if(!refreshTokens[username]){
                refreshTokens[username] = []
            }

            refreshTokens[username].push(refresh_token)

            res.cookie('access_token',access_token,{
                httpOnly:true,
                secure:false
            })

            res.cookie('refresh_token',refresh_token,{
                httpOnly: true,
                secure:false
            })

            console.log('cookieler oluşturuldu')
            console.log('logincontrollerdaki işlemler bitti')
            res.status(200).send({username: user.username})
        }else{
            res.status(404).send('user not found')
        }
    }else{
        res.status(400).send('email and password required')
    }
}

exports.currentUser = (req,res) => {
    console.log('currentuser controller çalıştı')
    res.status(200).send(req.payload)
}
exports.token = (req,res) => {
    const refreshToken = req.cookies.refresh_token;
    
    if(refreshToken == null) {return res.status(401).send('unauth')}
    try {
        //kullanıcı bilgisini jwt ile al
        const payload = jwt.verify(token,REFRESH_TOKEN_SECRET)
        const username = payload.username;

        if(!refreshTokens[username] ||!refreshTokens[username].includes(refreshToken)){
            return res.status(403).send('forbidden')
        }

        const accessToken = generateAccesToken({username})
        
        res.cookie('access_token',accessToken,{
            httpOnly:true,
            secure:false
        })

        res.status(200).json({message: "success"})
    } catch (error) {
        console.error(error)
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
        const user = await addUser(email,username,passwordHash)

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
    //tokenı al
    const token = req.cookies.refresh_token

    //token ya da kullanıcı adı yoksa hata dön
    if(!token) return res.status(401).send('unauth');

    try {
        //kullanıcı bilgisini jwt ile al
        const payload = jwt.verify(token,REFRESH_TOKEN_SECRET)
        const username = payload.username;

        //tokenı ramde yoksa hata dön
        if(!refreshTokens[username] || !refreshTokens[username].includes(token)) return res.status(403).send('forbidden');
        //tokenı ramden sil
        refreshTokens[username] = refreshTokens[username].filter(t => t !== token)

        //cookieleri sil
        res.clearCookie('access_token')
        res.clearCookie('refresh_token')

        //cevap dönd
        res.status(200).send({status: "success", message: "logged out"})
    } catch (error) {
        console.error(err);
        return res.status(403).send('invalid token');
    }
}


const generateAccesToken = (user) => {
    return jwt.sign({username: user.username}, ACCESS_TOKEN_SECRET,{expiresIn:"1h"})
}

const generateRefreshToken = (user) => {
    return jwt.sign({username: user.username},REFRESH_TOKEN_SECRET,{expiresIn: "7d"})
}

