import express from 'express';
import './db/mongoose';
import userRouter from './routers/user';
import transactionRouter from './routers/transaction';
import stakingRouter from './routers/staking';

const app = express();

app.use(express.json());
app.use(userRouter);
app.use(transactionRouter);
app.use(stakingRouter);

module.exports = app;
