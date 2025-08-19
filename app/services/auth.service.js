const {getDb} = require('../server')
const bcrypt = require('bcrypt')    

exports.createHashword = async(password) => {
    return await bcrypt.hash(password,10)
}

exports.getUserByEmailAndPassword = async(email, password) => {
    const db = await getDb();
    //userı bul
    const user = await db.collection('users').findOne({email})
    //yoksa null dön
    if(!user) return null;
    //hashedşifreyle girilen şifreyi kıyasla
    const isMatch = await bcrypt.compare(password, user.passwordHash)
    if(!isMatch) return null
    //match ise kullanıcıyı dön
    return user;
}