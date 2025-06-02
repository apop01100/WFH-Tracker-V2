import express from 'express';
import { CreateUserController, GetAllUser, GetMeController, GetUserPofile, LoginUserController, LogoutController, UpdateUserForUserController } from '../controllers/userControllers.js';
import { validateCreateUser } from '../middlewares/createUserValidator.js';
import { validateUserLogin } from '../middlewares/loginUserValidator.js';
import { validateUpdateUserForUser } from '../middlewares/updateUserValidator.js';
import { authenticate } from '../middlewares/auth.js';
import { GetUserAttendances } from '../controllers/attendanceControllers.js';

const userRouter = express.Router();

userRouter.post('/users', validateCreateUser, CreateUserController);
userRouter.post('/users/login', validateUserLogin, LoginUserController);
userRouter.put('/users', authenticate, validateUpdateUserForUser, UpdateUserForUserController);
userRouter.get('/users/profile', authenticate, GetUserPofile);
userRouter.get('/users', authenticate, GetAllUser);
userRouter.get('/users/attendances', authenticate, GetUserAttendances);

userRouter.get('/me', authenticate, GetMeController);
userRouter.get('/logout', authenticate, LogoutController);

export default userRouter;
