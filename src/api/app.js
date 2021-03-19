import express from 'express'
import './db/mongoose'
import userRouter from './routers/user'
import transactionRouter from './routers/transaction'



const app = express()

app.use(express.json())
app.use(userRouter)
app.use(transactionRouter)

module.exports= app