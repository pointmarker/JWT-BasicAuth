const jwt = require('jsonwebtoken')
const {ACCESS_TOKEN_SECRET} = require('../environment/environment')

exports.authorize = (req,res,next) => {
    const {authorization} = req.headers;

    if(!authorization) return res.status(401).send('unauth');
    if(!authorization.startsWith('Bearer'))return res.status(401).send('unauth');

    const split = authorization.split('Bearer ');
    if(split.length !== 2) return res.status(401).send('unauth');

    const token = split[1]
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