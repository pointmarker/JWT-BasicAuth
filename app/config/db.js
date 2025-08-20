const env = require('../environment/environment')
const {MongoClient, ServerApiVersion} = require('mongodb')
let client;

async function mongoStart() {
    client = new MongoClient (env.MONGO_URI, {
        serverApi: {
            version:ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    });

    try {
        //client ı server a bağla
        console.log("mongodb bağlantısı kuruluyor")
        await client.connect() 
        //başarılı bağlantı tescillemesi için ping gönder
        await client.db('admin').command({ping: 1})
        console.log('pinged and connected successfully to mongoDb')

        return client
    }
    catch(err){
        console.error(err)
    }
}

async function mongoClose(){
    if(client){
        await client.close()
        console.log('mongoDb bağlantısı kesildi')
    }
}


let db;
async function connectDb(client) {
    db = client.db('free-cluster')
}

function getDb(){
    if(!db) throw new Error('db not initialized');
    return db
}

module.exports = {connectDb,getDb, mongoClose,mongoStart}