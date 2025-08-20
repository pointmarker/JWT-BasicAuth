const {getDb} = require('../config/db')

async function addUser(email,username,passwordHash) {
    const db = await getDb()
    const res = await db.collection('users').insertOne({
        email,
        username,
        passwordHash,
        createdAt: new Date()
    });

    return res;
}

module.exports = {addUser};