import express from 'express';
import { CreateAttendanceController, GetAllAttendancesController, MarkAttendanceController } from '../controllers/attendanceControllers.js';
import { validateCreateAttendance } from '../middlewares/createAttendanceValidator.js';
import { authenticate } from '../middlewares/auth.js';
import { validateGetLimitAndPage } from '../middlewares/getUserAttendances.js';
import { validateDeleteAttendance } from '../middlewares/deleteAttendanceValidator.js';
import { DeleteAttendanceController } from '../controllers/userControllers.js';

const attendanceRouter = express.Router();

attendanceRouter.post('/attendance/mark', authenticate, validateCreateAttendance, MarkAttendanceController);
attendanceRouter.get('/attendance', authenticate, validateGetLimitAndPage, GetAllAttendancesController);
attendanceRouter.delete('/attendance', authenticate, validateDeleteAttendance, DeleteAttendanceController);
attendanceRouter.post('/attendance', authenticate, CreateAttendanceController);

export default attendanceRouter;