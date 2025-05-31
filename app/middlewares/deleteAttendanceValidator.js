import { body } from 'express-validator';

export const validateDeleteAttendance= [
  body('attendance_at')
    .notEmpty().withMessage('Attendance date is required')
    .isISO8601().withMessage('Attendance date must be a valid date (YYYY-MM-DD)'),
];