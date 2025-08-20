const jwt = require('jsonwebtoken')
const {ACCESS_TOKEN_SECRET} = require('../environment/environment')

exports.authorize = (req,res,next) => {
    const token = req.cookies.access_token;
    if(!token) return res.status(401).send('unauth')
    try {
        jwt.verify(token, ACCESS_TOKEN_SECRET, (err,payload) => {
            if(err) return res.status(401).send('unauth');
            req.payload = payload;
            next();
        })
    } catch (error) {
        return res.status(401).send("unauth")
    }
}