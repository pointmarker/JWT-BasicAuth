const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    email : {type: String, required:true, unique: true},
    username: {type:String,required:true, unique: true},
    passwordHash: {type: String},
    createdAt: {type:Date, default: Date.now}
})


userSchema.statics.addUser = async function(email, username, passwordHash){
    const newUser = new this({
        email,
        username,
        passwordHash
    })

    return newUser.save()
}
const userModel = mongoose.model('user.model',userSchema,"users")

module.exports = {userModel};