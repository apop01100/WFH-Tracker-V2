import { validationResult } from 'express-validator';
import { localKey } from '../config/paseto.js';
import { encrypt } from 'paseto-ts/v4';
import { Admin } from '../services/adminService.js';
import { User } from '../services/userServices.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { userResponse } from './userControllers.js';
dotenv.config();

function adminResponse(admin) {
    return {
        id: admin.id,
        username: admin.username,
        created_at: admin.created_at,
        updated_at: admin.updated_at,
    }
}

export const CreateAdminController = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const { username, password } = req.body

    const saltRounds = parseInt(process.env.SALT_ROUNDS, 10);
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    try {
        const createdAdmin = await Admin.createAdmin(username, hashedPassword);
        return res.status(201).json({ message: 'User created successfully', data: adminResponse(createdAdmin) });
    } catch (error) {
        console.error('Create user error:', error.message);
        return res.status(400).json({ error: error.message, data: null });
    }
}

export const LoginAdminController = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    try {
        const getAdmin = await Admin.getAdminByUsername(username);
        if (!getAdmin) {
            return res.status(401).json({ message: 'Invalid username' });
        }

        const isMatch =await bcrypt.compare(password, getAdmin.password)

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        const token = await encrypt(
            localKey,
            { sub: getAdmin.username, user_id: getAdmin.id, role: 'admin', iat: new Date().toISOString()},
        )

        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            maxAge: 60 * 60 * 1000
        })

        return res.status(200).json({ message: 'Login successful', data: adminResponse(getAdmin) });
    } catch (error) {
    console.error('Login error: ', error.message);
    return res.status(400).json({ message: error.message });
  }
}

export const UpdateUserForAdminController = async (req, res) => {
    const { role } = req.user
    if (role !== 'admin') {
        return res.status(403).json({ errors: 'Unauthorized user'})
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const { username, update_user } = req.body

    try {
        const getUser = await User.getUserByUsername(username);
        if (!getUser) {
            return res.status(401).json({ message: "User doesn't exist" });
        }

        const updatedUser = await User.updateUser(getUser.id, update_user)
        return res.status(200).json({ message: 'User update successfully', data: userResponse(updatedUser) });
    } catch(error) {
        console.error('Update user error:', error.message);
        return res.status(400).json({ error: error.message, data: null });
    }
}

export const DeleteUserForAdminController = async (req, res) => {
    const { role } = req.user
    if (role !== 'admin') {
        return res.status(403).json({ errors: 'Unauthorized user'})
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const { username } = req.body;

    try {
        const getUser = await User.getUserByUsername(username);
        if (!getUser) {
            return res.status(401).json({ message: "User doesn't exist" })
        }

        const deletedUser = await User.deleteUser(username);
        return res.status(200).json({ message: 'User delete successfully', data: deletedUser });
    } catch (error) {
        console.error('Delete user error:', error.message);
        return res.status(400).json({ error: error.message, data: null });
    }
}

export const GetAdminProfileController = async (req, res) => {
    const { role, user_id } = req.user
    if (role !== 'admin') {
        return res.status(403).json({ errors: 'Unauthorized user'})
    }

    try {
        const getAdmin = await Admin.getAdminrById(user_id)
        return res.status(200).json({ message: 'Get admin successfully', data: adminResponse(getAdmin) });
    } catch (error) {
        console.error('Get admin error:', error.message);
        return res.status(400).json({ error: error.message, data: null });
    }
}