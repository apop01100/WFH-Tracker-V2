import express from 'express';
import { CreateAttendanceController, GetAllAttendancesController } from '../controllers/attendanceControllers.js';
import { validateCreateAttendance } from '../middlewares/createAttendanceValidator.js';
import { authenticate } from '../middlewares/auth.js';
import { validateGetLimitAndPage } from '../middlewares/getUserAttendances.js';
import { validateDeleteAttendance } from '../middlewares/deleteAttendanceValidator.js';
import { DeleteAttendanceController } from '../controllers/userControllers.js';

const attendanceRouter = express.Router();

attendanceRouter.post('/attendance', authenticate, validateCreateAttendance, CreateAttendanceController);
attendanceRouter.get('/attendance', authenticate, validateGetLimitAndPage, GetAllAttendancesController);
attendanceRouter.delete('/attendance', authenticate, validateDeleteAttendance, DeleteAttendanceController);

export default attendanceRouter;