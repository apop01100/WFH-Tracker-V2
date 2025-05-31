import { body } from 'express-validator';

export const validateDeleteUser = [
  body('username')
    .notEmpty().withMessage('Username is required')
    .isAlphanumeric().withMessage('Username must be alphanumeric'),
];