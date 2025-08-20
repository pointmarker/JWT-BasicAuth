const express = require('express')
const app = express();
const path = require('path')
const {connectDb, mongoStart} = require('./config/db')
const database = require('./config/db')
const router = require('./routes/index');
const { authorize } = require('./middleware/auth.middleware');
const cookieParser = require('cookie-parser')

mongoRun = async() => {
    const client = await mongoStart();
    connectDb(client)
}
mongoRun();

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname,"public")))
app.use('/', router);

process.on('SIGINT',async() => {
    console.log('mongodb kapanıyor...')
    await database.mongoClose()
    console.log('uygulama kapanıyor...')
    process.exit(0);
})

app.get("/",[
    (req,res,next) => {console.log('LOGGED');next()},
    (req,res) => res.status(200).sendFile(path.join(__dirname,"public","pages","index.html"))
])

app.get('/login',(req,res) => {
    res.status(200).sendFile(path.join(__dirname,"public","pages","login.html"))
})

app.get('/register', (req,res) => {
    res.status(200).sendFile(path.join(__dirname,"public","pages","register.html"))
})

app.get('/user/:username',(req,res) => {
    res.status(200).sendFile(path.join(__dirname,"public","pages","user.html"))
})

app.get('/users',(req,res) => {
    res.status(200).sendFile(path.join(__dirname,"public","pages","users.html"))
})

app.listen(3000, () => console.log('server running on PORT 3000'))