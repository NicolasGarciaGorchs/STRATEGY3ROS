const express = require('express')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const MongoStore = require('connect-mongo')
const handlebars = require('express-handlebars')
const mongoConnect = require('./db')
const router = require('./router')
const initilizePassport = require('./config/passport.config')
const passport  = require('passport')

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(__dirname + '/public'))
app.use(cookieParser())
app.use(session({
    store: MongoStore.create({
        mongoUrl: 'mongodb+srv://nicolasgarciagorchs:nicolasgarciagorchs@primerbasededatos.fk1940x.mongodb.net/prueba?retryWrites=true&w=majority',
        mongoOptions: {useNewUrlParser: false, useUnifiedTopology: false},
        ttl: 3600    
    }),
    secret: 'miSecreto', //guarda cifrado
    resave: false, //
    saveUnitialized: false
}))

initilizePassport()
app.use(passport.initialize())
app.use(passport.session())

app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')

mongoConnect()

router(app)


app.listen(3000, () => {
    console.log(3000)
})
