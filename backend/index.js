require('dotenv').config()
const session = require('express-session');
const express = require('express')
const app = express()
const dbConnection = require('./dbconnection/connection')
const userRoute = require('./routes/user')
const adminRoute = require('./routes/admin')
const paymentRoute = require('./routes/payment')
const cookieParser = require('cookie-parser')
const cors = require('cors')

dbConnection()
app.use(cookieParser())

app.use(session({
  secret: 'yourSecretKey',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }  
}));

app.use(cors({
  origin: ['https://ecommerce-1-fl12.onrender.com'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.urlencoded({ extended: false }));
app.use(express.json())

app.use('/',userRoute)
app.use('/admin',adminRoute)
app.use('/payment',paymentRoute)

app.listen(process.env.PORT,()=>{
    console.log(`server started at ${process.env.PORT}`);
})