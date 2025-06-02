import express from 'express';
import { CreateAdminController, GetAdminProfileController, LoginAdminController, UpdateUserForAdminController } from '../controllers/adminControllers.js';
import { validateAdmin } from '../middlewares/adminValidator.js';
import { authenticate } from '../middlewares/auth.js';
import { validateUpdateUserForAdmin } from '../middlewares/updateUserValidator.js';
import { validateDeleteUser } from '../middlewares/deleteUserValidator.js';
import { DeleteUserForAdminController } from '../controllers/adminControllers.js';

const adminRouter = express.Router();

adminRouter.post('/admin', validateAdmin, CreateAdminController);
adminRouter.post('/admin/login', validateAdmin, LoginAdminController);
adminRouter.put('/admin/user', authenticate, validateUpdateUserForAdmin, UpdateUserForAdminController);
adminRouter.delete('/admin/user', authenticate, validateDeleteUser, DeleteUserForAdminController);
adminRouter.get('/admin', authenticate, GetAdminProfileController);

export default adminRouter;
