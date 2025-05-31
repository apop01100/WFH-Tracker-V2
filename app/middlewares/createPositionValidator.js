import { body } from 'express-validator';

export const validateCreatePosition = [
  body('position')
    .notEmpty().withMessage('Position name is required')
    .trim()
    .toLowerCase()
]