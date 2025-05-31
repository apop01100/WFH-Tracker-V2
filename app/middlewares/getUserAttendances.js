import { body } from 'express-validator';

export const validateGetLimitAndPage = [
    body('limit')
    .notEmpty().withMessage("Limit number is required")
    .isNumeric().withMessage("Limit's number must be number"),

    body('page')
    .notEmpty().withMessage("Page's number is required")
    .isNumeric().withMessage("Page's number must be number")
];