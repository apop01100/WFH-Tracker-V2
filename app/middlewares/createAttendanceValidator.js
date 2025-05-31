import { body } from 'express-validator';

export const validateCreateAttendance = [
  body('img_url')
    .notEmpty().withMessage('Image URL is required'),
];