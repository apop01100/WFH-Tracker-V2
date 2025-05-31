import { validationResult } from 'express-validator';
import { Position } from '../services/positionService.js';


export const CreatePositionController = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const { position } = req.body

    try {
        const createdPosition = await Position.createPosition(position);
        return res.status(201).json({ message: 'Position created successfully', data: createdPosition });
    } catch (error) {
        console.error('Create position error:', error.message);
        return res.status(400).json({ error: error.message, data: null});
    }
}

export const GetAllPositions = async (req, res) => {
    const { role } = req.user
    if (role !== 'admin') {
        return res.status(403).json({ errors: 'Unauthorized user'})
    }

    const { limit, page } = req.body;
    const offset = (page - 1) * limit;

    try {
        const getAllPositions = await Position.getAllPosition(limit, offset);
        return res.status(201).json({ message: 'Get user successfully', data: getAllPositions });
    } catch (error) {
        console.error('Get user error:', error.message);
        return res.status(400).json({ error: error.message, data: null });
    }
}
