import { body } from 'express-validator';

export const validateUpdateUserForUser = [
    body('first_name')
    .optional()
    .isLength({ min: 2, max: 50 }),
  
    body('last_name')
    .optional(),
    
    body('username')
    .optional()
    .isAlphanumeric(),
  
    body('email')
    .optional()
    .isEmail(),
];

export const validateUpdateUserForAdmin = [
    body('username')
    .optional()
    .isAlphanumeric(),
  
    body('update_user.positon')
    .optional()
    .trim()
    .toLowerCase(),
];