const env = require('../environment/environment')
const {MongoClient, ServerApiVersion} = require('mongodb')
let client;

exports.mongoStart = async() => {
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

exports.mongoClose = async() => {
    if(client){
        await client.close()
        console.log('mongoDb bağlantısı kesildi')
    }
}
