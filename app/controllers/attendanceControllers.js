import { validationResult } from 'express-validator';
import { Attendance } from '../services/attendanceService.js';

export const MarkAttendanceController = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const { user_id } = req.user
    const { img_url } = req.body

    const dateTime = new Date().toISOString().replace('T', ' ').substring(0, 19);

    try {
        const markedAttendance = await Attendance.markAttendance(user_id, dateTime, img_url);
        return res.status(200).json({ message: 'Attendance marked successfully', data: markedAttendance });
    } catch (error) {
        console.error('Mark attendance error:', error.message);
        return res.status(400).json({ error: error.message, data: null});
    }
}

export const GetUserAttendances = async (req, res) => {
    const { role, user_id } = req.user;
    if (role !== 'user') {
        return res.status(403).json({ errors: 'Unauthorized user'})
    }

    const { limit, page } = req.query;

    const pageNumber = parseInt(page) || 1;
    const limitNumber = parseInt(limit) || 10;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const offset = (pageNumber - 1) * limitNumber;

    try {
        const getAttendance = await Attendance.getUserAttendance(user_id, limitNumber, offset)
        return res.status(200).json({ message: "Get user's attendances successfully", data: getAttendance });
    } catch (error) {
        console.error("Get user's attendances error:", error.message);
        return res.status(400).json({ error: error.message, data: null });
    }
}

export const GetAllAttendancesController = async (req, res) => {
    const { role } = req.user;
    if (role !== 'admin') {
        return res.status(403).json({ errors: 'Unauthorized user'})
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const { limit, page } = req.query;

    const pageNumber = parseInt(page) || 1;
    const limitNumber = parseInt(limit) || 10;

    const offset = (pageNumber - 1) * limitNumber;

    try {
        const getAllAttendance = await Attendance.getAllAttendance(limitNumber, offset)
        return res.status(200).json({ message: "Get attendances successfully", data: getAllAttendance });
    } catch (error) {
        console.error("Get attendances error:", error.message);
        return res.status(400).json({ error: error.message, data: null });
    }
}

export const CreateAttendanceController = async (req, res) => {
    const { role, user_id } = req.user
    if (role !== 'admin') {
        return res.status(403).json({ errors: 'Unauthorized user'})
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const dateTime = new Date().toISOString().replace('T', ' ').substring(0, 19);

    try {
        const createdAttendance = await Attendance.createAttendance(dateTime);
        return res.status(201).json({ message: 'Attendance created successfully', data: createdAttendance });
    } catch (error) {
        console.error('Create attendance error:', error.message);
        return res.status(400).json({ error: error.message, data: null});
    }
}

export const DeleteAttendanceController = async (req, res) => {
    const { role, user_id } = req.user
    if (role !== 'admin') {
        return res.status(403).json({ errors: 'Unauthorized user'})
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const { attendance_at } = req.body;

    try {
        const deletedAttendance = await Attendance.deleteAttendanceByAdmin(attendance_at);
        return res.status(200).json({ message: 'Attendance delete successfully', data: deletedAttendance });
    } catch (error) {
        console.error('Delete Attendance error:', error.message);
        return res.status(400).json({ error: error.message, data: null });
    }
}