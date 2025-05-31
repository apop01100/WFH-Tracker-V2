import express, { json } from 'express';
import cors from 'cors';
import userRouter from './app/routes/userRoutes.js'
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import positionRouter from './app/routes/positionRoutes.js';
import attendanceRouter from './app/routes/attendanceRoutes.js';
import adminRouter from './app/routes/adminRoutes.js';
dotenv.config();

const app = express();

app.use(cors());
app.use(json());
app.use(cookieParser());

app.use('/api/v1', userRouter);
app.use('/api/v1', positionRouter);
app.use('/api/v1', attendanceRouter);
app.use('/api/v1', adminRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
